import { Request } from "express";
import { User } from "./types/User";

export interface AuthorizedRequest extends Request {
  user?: User
}