import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<any> {
  const { skip = 0, take = 2 } = req.query;
  console.log(skip, take)
  if (req.method === 'GET') {
    const noteList = await client.note.findMany({
      take: +take,
      skip: +skip,
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

  } else if (req.method === 'POST') {

    const { body: { title, content } } = req;
    const { session: { user } } = req;
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
