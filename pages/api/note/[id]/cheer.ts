import mail from "@sendgrid/mail";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  const { query: { id }, session: { user } } = req

  const alreadyExists = await client.cheer.findFirst({
    where: {
      noteId: Number(id),
      userId: user?.id,
    }
  })

  if (alreadyExists) {
    console.log('이미있어서')
    await client.cheer.delete({
      where: {
        id: alreadyExists.id,
      }
    })
    console.log('삭제함')
    res.json({ ok: true, toggle: false, })
  } else {
    await client.cheer.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          }
        },
        note: {
          connect: {
            id: Number(id)
          }
        }
      }
    })
    res.json({ ok: true, toggle: true, })
  }
}




export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
