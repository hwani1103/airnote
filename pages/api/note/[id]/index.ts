import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<any> {

  const { query: { id } } = req;
  // 로그인 한 user의 id랑.
  // 이 note가 들고있는 replis중에서, 그 reply의 userId가 같은게 있는지 없는지를 알아야함.

  const noteInfo = await client.note.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      title: true,
      content: true,
      cheers: true,
      replies: true,
      createdAt: true,
      user: {
        select: {
          nickname: true,
          age: true,
          gender: true,
          occupation: true,
          id: true,
        }
      }
    }
  })

  res.json({
    ok: true, noteInfo
  });
}

export default
  withHandler({
    methods: ["GET"],
    handler,
    isPrivate: false,
  })


