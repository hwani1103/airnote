import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<any> {

  const { query: { id }, body: { nickname }, session: { user } } = req;

  if (id != user?.id) {
    return res.status(400).json({ ok: false })
  }

  if (!id || !nickname || !user) return res.status(400).end();

  await client.user.update({
    where: {
      id: Number(id),
    },
    data: {
      nickname,
    }
  })



  res.json({ ok: true });

}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: true
  })
);
