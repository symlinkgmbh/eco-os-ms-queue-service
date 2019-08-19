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

import { AbstractRoutes, injectValidatorService } from "@symlinkde/eco-os-pk-api";
import { PkApi } from "@symlinkde/eco-os-pk-models";
import { Application, Request, Response, NextFunction } from "express";
import { JobsController } from "../controllers/JobsController";

@injectValidatorService
export class Jobs extends AbstractRoutes implements PkApi.IRoute {
  private jobsController: JobsController = new JobsController();
  private validatorService!: PkApi.IValidator;
  private postJobPattern: PkApi.IValidatorPattern = {
    job: "",
    failover: "",
  };

  private updateJobPattern: PkApi.IValidatorPattern = {
    status: "",
  };
  constructor(app: Application) {
    super(app);
    this.activate();
  }

  public activate(): void {
    this.addJob();
    this.getJobs();
    this.getJob();
    this.updateJob();
    this.getScheduledJobs();
    this.getProcessingJobs();
    this.getCrashedJobs();
    this.getFinishedJobs();
  }

  private addJob(): void {
    this.getApp()
      .route("/job")
      .post((req: Request, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.postJobPattern);
        this.jobsController
          .createJob(req)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getJobs(): void {
    this.getApp()
      .route("/jobs")
      .get((req: Request, res: Response, next: NextFunction) => {
        this.jobsController
          .getAllJobs()
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getJob(): void {
    this.getApp()
      .route("/job/:id")
      .get((req: Request, res: Response, next: NextFunction) => {
        this.jobsController
          .getJob(req)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private updateJob(): void {
    this.getApp()
      .route("/job/:id")
      .put((req: Request, res: Response, next: NextFunction) => {
        this.validatorService.validate(req.body, this.updateJobPattern);
        this.jobsController
          .updateJob(req)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getScheduledJobs(): void {
    this.getApp()
      .route("/job/filter/scheduled")
      .get((req: Request, res: Response, next: NextFunction) => {
        this.jobsController
          .getScheduledJobs()
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getProcessingJobs(): void {
    this.getApp()
      .route("/job/filter/processing")
      .get((req: Request, res: Response, next: NextFunction) => {
        this.jobsController
          .getProcessingJobs()
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getCrashedJobs(): void {
    this.getApp()
      .route("/job/filter/crashed")
      .get((req: Request, res: Response, next: NextFunction) => {
        this.jobsController
          .getCrashedJobs()
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }

  private getFinishedJobs(): void {
    this.getApp()
      .route("/job/filter/finished")
      .get((req: Request, res: Response, next: NextFunction) => {
        this.jobsController
          .getFinishedJobs()
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            next(err);
          });
      });
  }
}
