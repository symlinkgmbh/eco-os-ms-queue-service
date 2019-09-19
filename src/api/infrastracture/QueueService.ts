/**
 * Copyright 2018-2019 Symlink GmbH
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 */



import { IQueueService } from "./IQueueService";
import { IJobs, JobStates } from "../models";
import { injectRedisClient } from "@symlinkde/eco-os-pk-redis";
import { PkRedis, MsOverride } from "@symlinkde/eco-os-pk-models";
import { StaticQueueUtil } from "./StaticQueueUtil";
import { Log, LogLevel } from "@symlinkde/eco-os-pk-log";
import { CustomRestError, apiResponseCodes } from "@symlinkde/eco-os-pk-api";
import { injectable } from "inversify";

@injectRedisClient
@injectable()
export class QueueService implements IQueueService {
  private redisClient!: PkRedis.IRedisClient;

  public async addJob(req: MsOverride.IRequest): Promise<IJobs> {
    try {
      const jobId: string = StaticQueueUtil.buildId();
      const { job, failover } = req.body;
      const createJob: IJobs = {
        attempts: 0,
        createdAt: new Date(),
        lastStatusUpdate: new Date(),
        status: JobStates.scheduled,
        id: jobId,
        job,
        failover,
      };
      await this.redisClient.set(jobId, createJob, 3600);
      return createJob;
    } catch (err) {
      Log.log(err, LogLevel.error);
      throw new CustomRestError(
        {
          code: 500,
          message: "problem in create queue job",
        },
        500,
      );
    }
  }

  public async getJob(req: MsOverride.IRequest): Promise<IJobs> {
    const result = await this.redisClient.get<IJobs>(req.params.id);

    if (!result) {
      throw new CustomRestError(
        {
          code: apiResponseCodes.C825.code,
          message: apiResponseCodes.C825.message,
        },
        404,
      );
    }

    return result;
  }

  public async updateJob(req: MsOverride.IRequest): Promise<IJobs> {
    try {
      const { status, trace } = req.body;
      const entry = await this.getJob(req);

      if (status === JobStates.crashed || status === JobStates.error) {
        entry.attempts = entry.attempts + 1;
      }

      if (trace !== undefined) {
        entry.job.trace = trace;
      }

      entry.lastStatusUpdate = new Date();
      entry.status = status;
      await this.redisClient.set(entry.id, entry, 3600);
      return entry;
    } catch (err) {
      Log.log(err, LogLevel.error);
      throw new CustomRestError(
        {
          code: 500,
          message: "problem in update queue job",
        },
        500,
      );
    }
  }
  public async getAllJobs(): Promise<Array<IJobs>> {
    return await this.redisClient.getAll<IJobs>("ecq*");
  }
  public async getScheduledJobs(): Promise<Array<IJobs>> {
    return [];
  }
  public async getProcessingJobs(): Promise<Array<IJobs>> {
    return [];
  }
  public async getCrashedJobs(): Promise<Array<IJobs>> {
    return [];
  }
  public async getFinishedJobs(): Promise<Array<IJobs>> {
    return [];
  }
}
