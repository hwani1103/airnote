import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<any> {

  const { query: { id } } = req;

  if (req.method === 'GET') {
    const noteInfo = await client.note.findUnique({
      where: {
        id: Number(id),
      },

      select: {
        title: true,
        content: true,
        userId: true,
        user: {
          select: {
            nickname: true,
            id: true,
          }
        }
      }
    })

    res.json({
      ok: true, noteInfo
    });
  } else if (req.method === 'POST') {
    const { body: { reply, author, userId }, session: { user } } = req;
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
        message: `${author}님이 회원님의 게시글에 댓글을 달았습니다.`,
        user: {
          connect: {
            id: userId,
          },
        },
        reply: {
          connect: {
            id: newReply.id
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

