import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<any> {

  const { query: { id } } = req;

  const note = await client.note.findUnique({
    where: {
      id: Number(id),
    }
  })


  res.json({ ok: true, note })

}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
    isPrivate: false
  })
);
