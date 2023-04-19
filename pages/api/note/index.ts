import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<any> {

  if (req.method === 'GET') {
    const noteList = await client.note.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        title: true,
        content: true,
        createdAt: true,
        id: true,
        userId: true,
        user: {
          select: {
            nickname: true,
            id: true,
            age: true,
            occupation: true,
            gender: true,
          }
        },
        _count: {
          select: {
            replies: true,
            cheers: true,
          }
        }
      },
    })
    res.json({ ok: true, noteList })

    //이게 이런문제가있네. GET요청은 isPrivate이 false지만, POST요청은 true여야됨. note를 만드는작업인데 당연히 로그인해야지.
    //어쩔수없이 여기서 검증하자.
  } else if (req.method === 'POST') {
    const { body: { title, content }, session: { user } } = req;
    if (!user) return res.status(404).json({ ok: false })
    if (!title || !content) return res.status(404).json({ ok: false })

    const newNote = await client.note.create({
      data: {
        title, content,
        user: {
          connect: {
            id: user?.id,
          }
        }
      }
    })
    // await res.revalidate('/note')

    res.json({ ok: true, noteId: newNote.id });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
    isPrivate: false
  })
);
