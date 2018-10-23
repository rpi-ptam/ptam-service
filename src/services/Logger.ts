export class Logger {

  public static error(...messages: Array<any>) {
    messages.forEach(message => console.error(message));
  }

}