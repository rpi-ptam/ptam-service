"use strict";

import { TwoWayCache } from "../../src/definitions/TwoWayCache";

export class DummyTwoWayCache extends TwoWayCache<number,string> {

  fill(): void {
    this.map = new Map<number, string>();
    this.map.set(1, "first");
    this.map.set(2, "second");
    this.map.set(3, "third");
  }

}