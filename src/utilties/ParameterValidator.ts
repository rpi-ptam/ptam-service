"use strict";

/**
 * ParameterValidator Class
 * @author Aaron J. Shapiro <shapia4@rpi.edu>
 */
export class ParameterValidator {

  /**
   * Determine whether or not a payload is valid against a flat list of parameters.
   * @param expectedParameters {Array<String>}
   * @param suppliedPayload {Object}
   * @returns {boolean} true if valid, false if invalid
   */
  public static isValid(expectedParameters: Array<string>, suppliedPayload: Object | null | undefined): boolean {
    /* Flatten the supplied payload into an array since we only care if the property is present */
    const suppliedParameters = Object.keys(suppliedPayload || {});
    /* Iterate over what is expected */
    for (let i = 0; i < expectedParameters.length; i++) {
      const expectedParameter = expectedParameters[i];
      /* If what is expected is not supplied, we're invalid; stop now */
      if (!suppliedParameters.includes(expectedParameter))
        return false;
    }
    /* If we have everything we expect, we're valid */
    return true;
  }

}