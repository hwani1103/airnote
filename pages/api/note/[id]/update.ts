import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<any> {

  const { query: { id }, body: { title, content }, session: { user } } = req;
  if (req.method === 'GET') {
    const noteUpdate = await client.note.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        title: true,
        content: true,
        userId: true,
      }
    })
    if (noteUpdate && noteUpdate.userId != user?.id) {
      return res.status(400).json({ ok: false })
    }
    res.json({
      ok: true,
      noteUpdate,
    });
  } else if (req.method === 'POST') {
    if (!id || !title || !content) return res.status(400).end();
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

    await client.note.update({
      where: {
        id: Number(id),
      },
      data: {
        title, content,
      }
    })

    res.json({
      ok: true,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
