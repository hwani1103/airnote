import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<any> {

  const { query: { id }, session: { user } } = req;

  const userInfo = await client.user.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      nickname: true,
      age: true,
      occupation: true,
      createdAt: true,
      gender: true,
      notes: {
        select: {
          title: true,
          id: true,
        }
      },
      notifications: { // 알림을 눌러서 해당 답글로 가는것.
        select: {
          message: true,
          reply: {
            select: {
              noteId: true,
              id: true,
            }
          }
        }
      }
    }

  })

  res.json({ ok: true, userInfo });

}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
    isPrivate: true
  })
);
