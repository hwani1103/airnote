import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<any> {
  const { token } = req.body; // 요청에서 token을 뽑아낸다. tokenMutate(form)했으니까.
  const foundToken = await client.token.findUnique({
    where: { payload: token }, // 생성된 payload가 요청의 token과 일치하는 token을 찾는다.
  });

  if (!foundToken) return res.status(404).end(); // 없으면 리턴. 404

  req.session.user = {
    id: foundToken.userId, // 세션.. 아무튼 foundToken했으면, 로그인 성공 처리니까. 세션을 만들고 session에 userId를저장한다.
    //이렇듯 세션을 이용할 수 있으려면 withApiSession으로 감싸줘야함.

    //isPrivate은 default가 true임. 그러니까 비로그인 회원도 접근가능할 API는 isPrivate을 false로 해줘야됨 얘처럼.
  };

  await req.session.save(); //세션에 유져를 저장하고 save.save는 세션 암호화.
  await client.token.deleteMany({
    where: {
      userId: foundToken.userId,
    },
  });
  res.json({ ok: true });

}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: false
  })
);
