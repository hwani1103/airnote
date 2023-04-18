import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<any> {

  const noteList = await client.note.findMany({
    include: {
      user: {
        select: {
          nickname: true,
        }
      }
    }
  })

  res.json({ ok: true, noteList })

}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
    isPrivate: false
  })
);
