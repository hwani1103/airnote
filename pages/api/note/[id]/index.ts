import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<any> {

  const { query: { id } } = req;

  const noteInfo = await client.note.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      title: true,
      content: true,
      cheers: true,
      replies: true,
      createdAt: true,

      user: {
        select: {
          nickname: true,
          age: true,
          gender: true,
          occupation: true,
          id: true,
        }
      }
    }

  })

  res.json({
    ok: true, noteInfo
  });
}

export default
  withHandler({
    methods: ["GET"],
    handler,
    isPrivate: false,
  })

