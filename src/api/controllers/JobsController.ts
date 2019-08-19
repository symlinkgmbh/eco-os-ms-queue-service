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

import { Request } from "express";
import { IJobs } from "../models";
import { IQueueService, queueServiceContainer, QUEUESERVICETYPES } from "../infrastracture";

export class JobsController {

    private queueService: IQueueService;

    constructor() {
        this.queueService = queueServiceContainer.get<IQueueService>(QUEUESERVICETYPES.IQueueService);
    }

    public async createJob(req: Request): Promise<IJobs> {
       return await this.queueService.addJob(req);
    }
    public async getJob(req: Request): Promise<IJobs> {
        return await this.queueService.getJob(req);
    }
    public async getAllJobs(): Promise<Array<IJobs>> {
        return await this.queueService.getAllJobs();
    }
    public async getScheduledJobs(): Promise<Array<IJobs>> {
        return await this.queueService.getScheduledJobs();
    }
    public async getProcessingJobs(): Promise<Array<IJobs>> {
        return await this.queueService.getProcessingJobs();
    }
    public async getCrashedJobs(): Promise<Array<IJobs>> {
        return await this.queueService.getCrashedJobs();
    }
    public async getFinishedJobs(): Promise<Array<IJobs>> {
        return await this.queueService.getFinishedJobs();
    }
    public async updateJob(req: Request): Promise<IJobs> {
        return await this.queueService.updateJob(req);
    }
}
