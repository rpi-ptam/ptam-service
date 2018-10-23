"use strict";

import { DummyTwoWayCache } from "../_implementations/DummyTwoWayCache";

/**
 * Cache Test Suite
 * @author Aaron J. Shapiro <aaron@babaco.com>
 */
describe("Cache", () => {

  let cache: DummyTwoWayCache;

  test("Cache Instantiation/Filling", () => {
    cache = new DummyTwoWayCache();
    cache.fill();
  });

  test("Getting values by their key", () => {
    expect(cache.getByKey(1)).toBe("first");
    expect(cache.getByKey(2)).toBe("second");
    expect(cache.getByKey(3)).toBe("third");
  });

  test("Getting keys by their values", () => {
    expect(cache.getByValue("first")).toBe(1);
    expect(cache.getByValue("second")).toBe(2);
    expect(cache.getByValue("third")).toBe(3);
  });

  test("Getting bad values", () =>{
    expect(cache.getByKey(-1)).toBeNull();
  });

  test("Getting bad keys", () =>{
    expect(cache.getByValue("zero")).toBeNull();
  })

});