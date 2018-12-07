"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chance_1 = require("chance");
var MockTicket = /** @class */ (function () {
    function MockTicket() {
    }
    MockTicket.getRandomTicket = function (userId) {
        var chance = new chance_1.Chance();
        return {
            violator_id: userId,
            external_id: "" + chance.integer({ min: 100000, max: 999999 }),
            lot_id: 1,
            make: chance.word(),
            model: chance.word(),
            tag: chance.string({ length: 8 }),
            plate_state_id: 1,
            amount: chance.integer({ min: 10, max: 100 }),
            issued_at: "NOW()",
            violation_type_id: 1
        };
    };
    return MockTicket;
}());
exports.MockTicket = MockTicket;
