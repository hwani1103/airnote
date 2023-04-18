import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<any> {

  const noteCount = await client.note.count()

  res.json({ ok: true, noteCount })

}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
    isPrivate: false
  })
);
