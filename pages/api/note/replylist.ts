import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<any> {

  const { query: { id, skip } } = req;
  const replyList = await client.reply.findMany({
    take: 5,
    skip: Number(skip),
    where: {
      userId: Number(id)
    },
    orderBy: { createdAt: 'desc' }
  })

  res.json({ ok: true, replyList })

}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
    isPrivate: false
  })
);
