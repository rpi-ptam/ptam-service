"use strict";

import bind from "bind-decorator";
import { Request, Response } from "express";

import { Logger } from "../../services/Logger";
import { CacheRegistry } from "../../registries/CacheRegistry";
import { RepositoryRegistry } from "../../registries/RepositoryRegistry";

import { Appeal } from "../../definitions/types/Appeal";

import { Roles } from "../../decorator/RolesDecorator";
import { RequiredParams } from "../../decorator/RequiredParamsDecorator";

import {
  STUDENT,
  JUDICIAL_BOARD_CHAIR,
  JUDICIAL_BOARD_MEMBER,
  PARKING_OFFICE_OFFICIAL
} from "../../contants/Roles";

/**
 * Appeals Controller
 */
export class AppealsController {

  private readonly repoRegistry: RepositoryRegistry;
  private readonly cacheRegistry: CacheRegistry;

  constructor(repoRegistry: RepositoryRegistry, cacheRegistry: CacheRegistry) {
    this.repoRegistry = repoRegistry;
    this.cacheRegistry = cacheRegistry;
    void (this.cacheRegistry);
  }

  /**
   * Get a specific appeal with the underlying ticket.
   * User must be a member of the judicial board, judicial board chair or a parking-office-official.
   *
   * @author Aaron J. Shapiro <shapia4@rpi.edu>
   *
   * @param req {Express.Request}
   * @param res {Express.Response}
   */
  @bind
  @Roles(JUDICIAL_BOARD_MEMBER, JUDICIAL_BOARD_CHAIR, PARKING_OFFICE_OFFICIAL)
  @RequiredParams("ticketId")
  public async getAppeal(req: Request, res: Response): Promise<void> {
    const { appealsRepository } = this.repoRegistry;
    const { ticketId } = req.query;

    try {
      /* Try to get the appeal by the ticket identifier */
      const appeal = await appealsRepository.getByTicketId(ticketId);

      /* If there is no appeal, fail safely */
      if (appeal === null) {
        res.status(200).json({success: false, error: "APPEAL_NOT_FOUND"});
        return;
      }
      /* Found appeal successfully, respond gracefully */
      res.status(200).json({ success: true, appeal });
    }
    catch (error) {
      Logger.error(error);
      res.status(500).json({ success: false, error: "INTERNAL_ERROR" });
    }
  }

  @bind
  @Roles(JUDICIAL_BOARD_MEMBER, JUDICIAL_BOARD_CHAIR, PARKING_OFFICE_OFFICIAL)
  @RequiredParams("start", "count")
  public async getAppealsBulk(req: Request, res: Response): Promise<void> {
    const { appealsRepository } = this.repoRegistry;
    const { start, count } = req.query;
    try {
      /* The request specifies whether the appeals should be decided, filter accordingly */
      if (req.query.hasOwnProperty("decided")) {
        const appealTicketPairs = req.query.decided === 'true' ? await appealsRepository.getDecidedAppealsBulk(start, count) :
          await appealsRepository.getUndecidedAppealsBulk(start, count);
        res.status(200).json({ success: true, appeals: appealTicketPairs });
        return;
      }
      /* Otherwise be agnostic and get all */
      const appealTicketPairs = await appealsRepository.getAppealsBulk(start, count);
      res.status(200).json({ success: true, appeals: appealTicketPairs });
    }
    catch (error) {
      Logger.error(error);
      res.status(500).json({ success: false, error: "INTERNAL_ERROR" });
    }
  }

  /**
   * Insert an appeal for a given ticket.
   * User must be a student since members of the judicial board are not allowed to appeal parking tickets.
   *
   * @author Aaron J. Shapiro <shapia4@rpi.edu>
   *
   * @param req {Express.Request}
   * @param res {Express.Response}
   */
  @bind
  @Roles(STUDENT)
  @RequiredParams("ticket_id", "justification")
  public async createAppeal(req: Request, res: Response): Promise<void> {
    const { appealsRepository, ticketsRepository } = this.repoRegistry;
    const { ticketId, justification } = req.body;

    try {
      /* Verify that the underlying ticket exists */
      const ticket = await ticketsRepository.getById(ticketId);
      /* If the referenced ticket does not exist, there cannot be an appeal */
      if (ticket === null) {
        res.status(400).json({ success: false, error: "MALFORMED_REQUEST" });
        return;
      }

      /*
      if (ticket.violator_id !== userId) {
        res.status(401).json({ success: false, error: "UNAUTHORIZED" });
        return;
      }
      */

      /* Prepare the appeal literal */
      const appeal: Appeal = { ticket_id: ticketId, justification: justification, appealed_at: "NOW()" };
      await appealsRepository.insertAppeal(appeal);

      /* Respond gracefully */
      res.status(200).json({ success: true });
    }
    catch (error) {
      Logger.error(error);
      res.status(500).json({ success: false, error: "INTERNAL_ERROR" });
    }

  }

  /**
   * Create a verdict for a given appeal.
   * User must be a member of the judicial board or the judicial board chair to review an appeal.
   * @author Aaron J. Shapiro <shapia4@rpi.edu>
   *
   * @param req {Express.Request}
   * @param res {Express.Response}
   */
  @bind
  @Roles(JUDICIAL_BOARD_MEMBER, JUDICIAL_BOARD_CHAIR)
  @RequiredParams("ticket_id", "verdict_id")
  public async createVerdict(req: Request, res: Response): Promise<void> {
    const { appealsRepository } = this.repoRegistry;
    const { ticketId, verdictId, verdictComment } = req.body;

    try {
      /* Verify that the underlying appeal exists */
      const appeal = await appealsRepository.getByTicketId(ticketId);
      /* If the referenced appeal does not exist, there cannot be an appeal */
      if (appeal === null) {
        res.status(404).json({ success: false, error: "APPEAL_NOT_FOUND" });
        return;
      }

      /* TODO: Use User-Identifier */
      await appealsRepository.updateVerdict(ticketId, verdictId, verdictComment, 0);
    }
    catch (error) {
      Logger.error(error);
      res.status(500).json({ success: false, error: "INTERNAL_ERROR" });
    }
  }

}