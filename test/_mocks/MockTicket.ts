import { Chance } from "chance";
import { Ticket } from "../../src/definitions/types/Ticket";

export class MockTicket {

  public static getRandomTicket(userId: number): Ticket {
    const chance = new Chance();
    return {
      violator_id: userId,
      external_id: `${chance.integer({ min: 100000, max: 999999 })}`,
      lot_id: 1,
      make: chance.word(),
      model: chance.word(),
      tag: chance.string({ length: 8 }),
      plate_state_id: 1,
      amount: chance.integer({ min: 10, max: 100}) + .01,
      issued_at: "NOW()",
      violation_type_id: 1
    }
  }

}