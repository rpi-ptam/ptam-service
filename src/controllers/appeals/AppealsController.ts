"use strict";

import { Request, Response } from "express";
import { RepositoryRegistry } from "../../registries/RepositoryRegistry";
import { CacheRegistry } from "../../registries/CacheRegistry";
import bind from "bind-decorator";
import {roles} from "../../decorator/RolesDecorator";
import {JUDICIAL_BOARD_CHAIR, JUDICIAL_BOARD_MEMBER, PARKING_OFFICE_OFFICIAL} from "../../contants/Roles";

/**
 * Appeals Controller
 */
export class AppealsController {

  private readonly repoRegistry: RepositoryRegistry;
  private readonly cacheRegistry: CacheRegistry;

  constructor(repoRegistry: RepositoryRegistry, cacheRegistry: CacheRegistry) {
    this.repoRegistry = repoRegistry;
    this.cacheRegistry = cacheRegistry;
    void (this.repoRegistry);
    void (this.cacheRegistry);
  }

  /**
   * Get a specific appeal with the underlying ticket.
   * User must be a member of the judicial board, judicial board chair or a parking-office-official.
   *
   * @author Aaron J. Shapiro <shapia4@rpi.edu>
   *
   * @param req
   * @param res
   */
  @roles(JUDICIAL_BOARD_MEMBER, JUDICIAL_BOARD_CHAIR, PARKING_OFFICE_OFFICIAL)
  @bind
  public async getAppeal(req: Request, res: Response): Promise<void> {
    void (req);
    res.status(500).json({ success: false, error: "UNIMPLEMENTED_ENDPOINT" });
  }

  @bind
  public async getAppeals(req: Request, res: Response): Promise<void> {
    void (req);
    res.status(500).json({ success: false, error: "UNIMPLEMENTED_ENDPOINT" });
  }

  @bind
  public async createAppeal(req: Request, res: Response): Promise<void> {
    void (req);
    res.status(500).json({ success: false, error: "UNIMPLEMENTED_ENDPOINT" });
  }

  @bind
  public async createVerdict(req: Request, res: Response): Promise<void> {
    void (req);
    res.status(500).json({ success: false, error: "UNIMPLEMENTED_ENDPOINT" });
  }

}