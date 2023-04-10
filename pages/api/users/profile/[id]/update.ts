import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<any> {

  const { query: { id }, body: { nickname }, session: { user } } = req;
  console.log(id)
  console.log(user?.id);
  if (id != user?.id) {
    return res.json({ ok: false })
  } else {
    await client.user.update({
      where: {
        id: Number(id),
      },
      data: {
        nickname,
      }
    })
  }


  res.json({ ok: true });

}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: true
  })
);
