import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<any> {

  const { query: { id, no }, body: { replyUpdate }, session: { user } } = req;
  if (!id || !no) return res.status(400).end();
  if (req.method === 'GET') {
    const prevReply = await client.reply.findFirst({
      where: {
        noteId: Number(id),
        id: Number(no),
      },
      select: {
        reply: true,
        userId: true,
        user: {
          select: {
            nickname: true,
          }
        }
      }
    })
    if (!prevReply) {
      return res.status(404).json({ ok: false })
    } else {

      res.json({
        ok: true,
        prevReply,
      });
    }

  } else if (req.method === 'POST') {
    if (!replyUpdate) return res.status(400).end();
    const replyAuthor = await client.reply.findUnique({
      where: {
        id: Number(no)
      },
      select: {
        userId: true,
      }
    })
    if (replyAuthor?.userId !== user?.id) {
      return res.status(400).json({ ok: false })
    }
    await client.reply.update({
      where: {
        id: Number(no),
      },
      data: {
        reply: replyUpdate,
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
