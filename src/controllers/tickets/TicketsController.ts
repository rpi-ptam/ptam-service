import { Response } from "express";

import { STUDENT } from "../../contants/Roles";
import { Ticket } from "../../definitions/types/Ticket";
import { AuthorizedRequest } from "../../definitions/AuthorizedRequest";

import { Logger } from "../../services/Logger";
import { CacheRegistry } from "../../registries/CacheRegistry";
import { RepositoryRegistry } from "../../registries/RepositoryRegistry";

import bind from "bind-decorator";
import { Roles } from "../../decorator/RolesDecorator";
import { RequiredParams } from "../../decorator/RequiredParamsDecorator";

/**
 * Ticket Endpoints Controller
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class TicketsController {

  private readonly repoRegistry: RepositoryRegistry;
  private readonly cacheRegistry: CacheRegistry;

  constructor(repoRegistry: RepositoryRegistry, cacheRegistry: CacheRegistry) {
    this.repoRegistry = repoRegistry;
    this.cacheRegistry = cacheRegistry;
  }

  @bind
  @Roles(STUDENT)
  @RequiredParams("external_id", "lot", "make", "model", "tag", "plate_state", "amount", "issued_at", "violation")
  public async createTicket(req: AuthorizedRequest, res: Response): Promise<void> {
    const { ticketsRepository } = this.repoRegistry;
    const { statesCache, lotsCache, violationTypesCache } = this.cacheRegistry;
    const { external_id, lot, make, model, tag, plate_state, amount, issued_at, violation } = req.body;

    try {
      if (!req.user) throw Error("user token mismatch");

      const lotId = lotsCache.getByValue(lot);
      if (!lotId) {
        res.status(400).json({ success: false, error: "LOT_INVALID" });
        return;
      }

      const stateId = statesCache.getByValue(plate_state);
      if (!stateId) {
        res.status(400).json({ success: false, error: "STATE_INVALID" });
        return;
      }

      const violationId = violationTypesCache.getByValue(violation);
      if (!violationId) {
        res.status(400).json({ success: false, error: "VIOLATION_INVALID" });
        return;
      }

      const existingTicket = await ticketsRepository.getByExternalId(external_id);
      if (existingTicket !== null) {
        res.status(200).json({ success: false, error: "TICKET_ALREADY_FILED" });
        return;
      }

      const ticket: Ticket = { violator_id: req.user.id, external_id: external_id,  lot_id: lotId, plate_state_id: stateId,
        make: make, model: model, tag: tag, amount: amount, issued_at: issued_at, violation_type_id: violationId };

      const ticketId = await ticketsRepository.insertTicket(ticket);
      res.status(200).json({ success: true, ticket_id: ticketId });
    }
    catch (error) {
      Logger.error(error);
      res.status(500).json({ success: false, error: "INTERNAL_ERROR" });
    }

  }

}