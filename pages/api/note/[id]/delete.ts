import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<any> {

  const { query: { id }, session: { user } } = req;
  if (!id || !user) return res.status(400).end();
  const noteAuthor = await client.note.findUnique({
    where: {
      id: Number(id)
    },
    select: {
      userId: true,
    }
  })

  if (noteAuthor?.userId !== user?.id) {
    return res.status(404).json({ ok: false })
  }

  await client.note.delete({
    where: {
      id: Number(id),
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
