import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookieOptions = {
  cookieName: "airnote",

  password: process.env.COOKIE_PWD!,

}

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieOptions);
}

