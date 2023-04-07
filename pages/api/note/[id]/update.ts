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
      }
    })

    res.json({
      ok: true,
      noteUpdate,
    });
  } else if (req.method === 'POST') {
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
  }

  res.json({
    ok: true,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
