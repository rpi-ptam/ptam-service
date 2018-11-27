;

import { Request, Response } from "express";
import { ParameterValidator } from "../utilties/ParameterValidator";

/**
 * Required Parameter Middleware Decorator
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 *
 * @param params {Array<string>}
 * @return {Function}
 */
export function RequiredParams(...params: Array<string>): Function {
  return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<(req: Request, res: Response) => any>) {
    void (target);
    void (propertyKey);
    let func = descriptor.value;
    descriptor.value = function (req: Request, res: Response) {
      let payload: any;

      /* If the request was a POST, request verify the body */
      if (req.method === "POST") {
        payload = req.body;
      }
      /* If the request was a GET, verify the request's query */
      else if (req.method === "GET") {
        payload = req.query;
      }
      /* Otherwise we cannot verify the payload */
      else {
        res.status(405).json({ success: false, error: "METHOD_UNVERIFIABLE" });
        return;
      }

      /* Verify the payload against the required parameters */
      if (!ParameterValidator.isValid(params, payload)) {
        res.status(400).json({ success: false, error: "MALFORMED_REQUEST" });
        return;
      }

      if (func)
        return func.apply(this, [req,res]);
    };
  }
}