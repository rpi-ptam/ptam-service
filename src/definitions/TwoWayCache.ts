/**
 * Two-Way Cache (Keys and Values are UQ)
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export abstract class TwoWayCache<K,V> {

  protected map: Map<K,V> | undefined;

  abstract fill(): Promise<void> | void;

  public get length(): number {
    if (!this.map) throw Error("cache has not been filled");
    return this.map.size;
  }

  public values(): Array<V> {
    if (!this.map) throw Error("cache has not been filled");
    return Array.from(this.map.values());
  }

  public flush(): void {
    if (this.map) this.map.clear();
  }

  public getByKey(key: K): V | null {
    if (!this.map) throw Error("cache has not been filled");
    return this.map.get(key) || null;
  }

  public getByValue(value: V): K | null {
    if (!this.map) throw Error("cache has not been filled");
    for (let [mapKey, mapValue] of this.map) {
      if (value === mapValue) return mapKey;
    }
    return null;
  }

}