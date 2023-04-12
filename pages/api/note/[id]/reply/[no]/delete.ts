import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<any> {

  const { query: { id, no }, session: { user } } = req;
  if (!id || !no || !user) return res.status(400).end();
  const replyAuthor = await client.reply.findFirst({
    where: {
      noteId: Number(id),
      id: Number(no)
    },
    select: {
      userId: true,
    }
  })

  if (replyAuthor?.userId !== user?.id) {
    return res.status(404).json({ ok: false })
  }

  await client.reply.delete({
    where: {
      id: Number(no),
    }
  })
  res.json({
    ok: true,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
