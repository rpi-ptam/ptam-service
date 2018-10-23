export class Logger {

  public static info(...messages: Array<any>) {
    messages.forEach(message => console.log(message));
  }

  public static error(...messages: Array<any>) {
    messages.forEach(message => console.error(message));
  }

}