import client from "@libs/server/client";
import withHandler from "@libs/server/withHandler";
import { withApiSession } from "@libs/server/withSession";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

//NextAuth OAuth로그인 설정.
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (session?.user) {
    const { email } = session?.user;

    if (email) {
      await client.user.upsert({
        where: {
          email,
        },
        create: {
          email,
          nickname: "Anonymous",
        },
        update: {},
      });

      let currentUser = await client.user.findUnique({
        where: {
          email,
        },
      });

      if (currentUser) {
        req.session.user = {
          id: currentUser.id,
        };
      }

      await req.session.save();

      res.redirect("/");
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
    isPrivate: false,
  })
);
