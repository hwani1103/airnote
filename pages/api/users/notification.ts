import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from '@libs/server/withSession';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  const { session: { user } } = req;

  const count = await client.notification.count({
    where: {
      userId: user?.id
    }
  })



  return res.json({
    ok: true, count
  });
}

export default withApiSession(withHandler({ methods: ['GET'], handler }));