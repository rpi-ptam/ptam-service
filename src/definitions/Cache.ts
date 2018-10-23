export interface Cache<K,V> {
  fill(): Promise<void> | void;
  flush(): Promise<void> | void;
  get(key: K): V;
}