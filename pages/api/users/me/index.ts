import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (!req.session.user) return;
  if (req.method === 'GET') {
    const profile = await client.user.findUnique({
      where: {
        id: req.session.user?.id,
      },
      select: {
        nickname: true,
        id: true,
      }
    });
    res.json({
      ok: true,
      profile,
    });
  }

  // if (req.method === 'POST') {
  //   const { body: { nickname, gender, age, occupation }, session: { user } } = req;

  //   const updateFields: Record<string, any> = {};
  //   if (nickname) updateFields.nickname = nickname;
  //   if (gender) updateFields.gender = gender;
  //   if (age) updateFields.age = Number(age);
  //   if (occupation) updateFields.occupation = occupation;

  //   await client.user.upsert({
  //     where: { id: user.id },
  //     update: updateFields,
  //     create: updateFields,
  //   });

  //   res.json({
  //     ok: true,
  //   });
  // }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
    isPrivate: true,
  })
);
