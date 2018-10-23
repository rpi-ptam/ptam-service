export interface Runnable {
  start(): Promise<void> | void;
  stop(): Promise<void> | void;
}