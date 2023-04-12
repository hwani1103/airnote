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
  // 로그인 한 user의 id랑.
  // 이 note가 들고있는 replis중에서, 그 reply의 userId가 같은게 있는지 없는지를 알아야함.

  const noteInfo = await client.note.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      title: true,
      content: true,
      cheers: true,
      createdAt: true,
      user: {
        select: {
          nickname: true,
          age: true,
          gender: true,
          occupation: true,
          id: true,
        }
      },
    }
  })

  const noteReply = await client.reply.findMany({
    orderBy: { createdAt: 'desc' },
    where: {
      noteId: noteInfo?.id
    },
    select: {
      id: true,
      createdAt: true,
      user: {
        select: {
          nickname: true,
        }
      }
    }
  })

  if (noteInfo === null) {
    return res.status(404).json({
      ok: false,
    })
  } else {
    res.json({
      ok: true, noteInfo, noteReply,
    });
  }
}

export default
  withHandler({
    methods: ["GET"],
    handler,
    isPrivate: false,
  })


