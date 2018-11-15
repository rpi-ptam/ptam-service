import { AppealTicketPair } from "../definitions/types/AppealTicketPair";
import { CacheRegistry } from "../registries/CacheRegistry";

export class AppealProcessor {

  private readonly cacheRegistry: CacheRegistry;

  constructor(cacheRegistry: CacheRegistry) {
    this.cacheRegistry = cacheRegistry;
  }

  public processAppealTicketPairs(appealTicketPairs: Array<AppealTicketPair>): Array<AppealTicketPair> {
    return appealTicketPairs.map(atp => this.processAppealTicketPair(atp));
  }

  public processAppealTicketPair(atp: AppealTicketPair): AppealTicketPair {
    const { verdictsCache } = this.cacheRegistry;
    return {
      ...atp,
      appeal: {
        ...atp.appeal,
        verdict: atp.appeal.verdict_id ? verdictsCache.getByKey(atp.appeal.verdict_id) : null,
        verdict_id: null
      }
    }
  }

}