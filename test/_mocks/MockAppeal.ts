import { Chance } from "chance";
import { Appeal } from "../../src/definitions/types/Appeal";

export class MockAppeal {

  public static getRandomAppeal(ticketId: number): Appeal {
    const chance = new Chance();
    return {
      ticket_id: ticketId,
      justification: chance.sentence(),
      appealed_at: "NOW()",
      verdict: null
    }
  }

}