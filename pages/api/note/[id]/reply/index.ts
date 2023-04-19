import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<any> {

  const { query: { id } } = req;
  if (!id) return res.status(400).end();
  if (req.method === 'GET') {
    const noteInfo = await client.note.findUnique({
      where: {
        id: Number(id),
      },

      select: {
        title: true,
        content: true,
        id: true,
        _count: {
          select: {
            cheers: true,
          }
        },
        user: {
          select: {
            nickname: true,
            id: true,
            age: true,
            gender: true,
            occupation: true,
          }
        }
      }
    })
    if (!noteInfo) return res.status(404).json({ ok: false })
    res.json({
      ok: true, noteInfo
    });
  } else if (req.method === 'POST') {
    const { body: { reply, author, userId }, session: { user } } = req;
    if (user?.id !== author.id || !reply) return res.status(400)
    const newReply = await client.reply.create({
      data: {
        reply,
        note: {
          connect: {
            id: Number(id),
          }
        },
        user: {
          connect: {
            id: user?.id,
          }
        }
      }
    })
    await client.notification.create({
      data: {
        message: `${author.nickname}님이 회원님의 Note에 댓글을 달았습니다.`,
        user: {
          connect: {
            id: userId,
          },
        },
        reply: {
          connect: {
            id: newReply.id
          }
        },
        note: {
          connect: {
            id: newReply.noteId
          }
        }
      },
    })

    res.json({
      ok: true, replyId: newReply.id
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
    isPrivate: false,
  })
);

