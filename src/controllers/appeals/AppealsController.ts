"use strict";

import bind from "bind-decorator";
import { Response } from "express";

import { Logger } from "../../services/Logger";
import { CacheRegistry } from "../../registries/CacheRegistry";
import { AppealProcessor } from "../../utilties/AppealProcessor";
import { RepositoryRegistry } from "../../registries/RepositoryRegistry";

import { Appeal } from "../../definitions/types/Appeal";
import { AuthorizedRequest } from "../../definitions/AuthorizedRequest";

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

  private readonly appealProcessor: AppealProcessor;

  constructor(repoRegistry: RepositoryRegistry, cacheRegistry: CacheRegistry) {
    this.repoRegistry = repoRegistry;
    this.cacheRegistry = cacheRegistry;

    this.appealProcessor = new AppealProcessor(cacheRegistry);
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
  @RequiredParams("appeal_id")
  public async getAppeal(req: AuthorizedRequest, res: Response): Promise<void> {
    const { appealsRepository } = this.repoRegistry;
    const { appeal_id } = req.query;

    try {
      /* Try to get the appealTicketPair by the ticket identifier */
      const appealTicketPair = await appealsRepository.getWithTicketById(appeal_id);

      /* If there is no appealTicketPair, fail safely */
      if (appealTicketPair === null) {
        res.status(200).json({success: false, error: "APPEAL_NOT_FOUND"});
        return;
      }
      const processedAppealTicketPair = this.appealProcessor.processAppealTicketPair(appealTicketPair);
      /* Found appealTicketPair successfully, respond gracefully */
      res.status(200).json({ success: true, appeal_ticket_pair: processedAppealTicketPair });
    }
    catch (error) {
      Logger.error(error);
      res.status(500).json({ success: false, error: "INTERNAL_ERROR" });
    }
  }

  @bind
  @Roles(JUDICIAL_BOARD_MEMBER, JUDICIAL_BOARD_CHAIR, PARKING_OFFICE_OFFICIAL)
  @RequiredParams("start", "count")
  public async getAppealsBulk(req: AuthorizedRequest, res: Response): Promise<void> {
    const { appealsRepository } = this.repoRegistry;
    const { start, count } = req.query;
    try {
      /* The request specifies whether the appeals should be decided, filter accordingly */
      if (req.query.hasOwnProperty("decided")) {
        const appealTicketPairs = req.query.decided === 'true' ?
          await appealsRepository.getDecidedAppealsBulk(start, count) : await appealsRepository.getUndecidedAppealsBulk(start, count);
        res.status(200).json({ success: true, appeals: appealTicketPairs });
        return;
      }
      /* Otherwise be agnostic and get all */
      const appealTicketPairs = await appealsRepository.getAppealsBulk(start, count);
      const processedAppealTicketPairs = this.appealProcessor.processAppealTicketPairs(appealTicketPairs);
      res.status(200).json({ success: true, appeals: processedAppealTicketPairs });
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
  public async createAppeal(req: AuthorizedRequest, res: Response): Promise<void> {
    const { appealsRepository, ticketsRepository } = this.repoRegistry;
    const { ticket_id, justification } = req.body;

    try {
      if (!req.user) throw Error("token mismatch");

      /* Verify that the underlying ticket exists */
      const ticket = await ticketsRepository.getById(ticket_id);

      /* If the referenced ticket does not exist, there cannot be an appeal */
      if (ticket === null) {
        res.status(400).json({ success: false, error: "MALFORMED_REQUEST" });
        return;
      }

      if (ticket.violator_id !== req.user.id) {
        res.status(401).json({ success: false, error: "UNAUTHORIZED" });
        return;
      }

      /* Prepare the appeal literal */
      const appeal: Appeal = { ticket_id, justification: justification, appealed_at: "NOW()", verdict: null };
      await appealsRepository.insertAppeal(appeal);

      /* Respond gracefully */
      res.status(200).json({ success: true });
    }
    catch (error) {
      Logger.error(error);
      res.status(500).json({ success: false, error: "INTERNAL_ERROR" });
    }

  }

  @bind
  @Roles(JUDICIAL_BOARD_CHAIR, JUDICIAL_BOARD_MEMBER, PARKING_OFFICE_OFFICIAL)
  public async getStatistics(req: AuthorizedRequest, res: Response): Promise<void> {
    void (req);
    const { appealsRepository } = this.repoRegistry;
    try {
      const appealStatistics = await appealsRepository.getStatistics();
      res.status(200).json({ success: true, statistics: appealStatistics });
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
  @RequiredParams("ticket_id", "verdict")
  public async createVerdict(req: AuthorizedRequest, res: Response): Promise<void> {
    const { appealsRepository } = this.repoRegistry;
    const { ticketId, verdict, verdictComment } = req.body;

    try {
      if (!req.user || !req.user.id) throw Error("token mismatch");

      const verdictId = this.cacheRegistry.verdictsCache.getByValue(verdict);
      if (!verdictId) throw Error("verdict mismatch");

      /* Verify that the underlying appeal exists */
      const appeal = await appealsRepository.getByTicketId(ticketId);
      /* If the referenced appeal does not exist, there cannot be an appeal */
      if (appeal === null) {
        res.status(404).json({ success: false, error: "APPEAL_NOT_FOUND" });
        return;
      }

      await appealsRepository.updateVerdict(ticketId, verdictId, verdictComment, req.user.id);
    }
    catch (error) {
      Logger.error(error);
      res.status(500).json({ success: false, error: "INTERNAL_ERROR" });
    }
  }

}