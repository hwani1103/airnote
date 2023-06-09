import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<any> {

  const { query: { id, skip } } = req;
  const noteList = await client.note.findMany({
    take: 5,
    skip: Number(skip),
    where: {
      userId: Number(id)
    },
    orderBy: { createdAt: 'desc' }
  })

  const totalNotes = await client.note.count({
    where: {
      userId: Number(id)
    }
  })


  res.json({ ok: true, noteList, totalNotes })

}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
    isPrivate: false
  })
);
