
import { Request } from "express";

export type JwtObj = {
    [key:string]: string | any | null;
  };
export interface ExtraReq extends Request{
    userId?:string
    userName?:string,
    userImg?:string
    friendLimit?:number
}