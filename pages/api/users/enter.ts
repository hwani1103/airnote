import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import mail from "@sendgrid/mail";

mail.setApiKey(process.env.SENDGRID_KEY!);



async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  const { email } = await req.body;
  if (!email) return res.status(400).json({ ok: false });

  const tokenLifeTime = 15 * 60 * 1000 // 토큰 유효기간 설정. 이메일 입력하고 토큰을 입력 안하고 벗어났을 시의 대처
  const prevToken = await client.token.findFirst({ // 해당 유져의 email을 통해 기존 토큰이 있는지 찾는다.
    where: {
      user: {
        email,
      },
    },
  });

  if (prevToken) { // 기존에 생성해둔 토큰이 있으면서 유효시간 이내일 경우, 그 토큰으로 다시 로그인을 진행할 수 있게 ok:true 반환
    const tokenCreatedTime = prevToken.createdAt.getTime();
    if (Date.now() - tokenCreatedTime < tokenLifeTime) {
      return res.json({
        ok: true,
      });
    } else { // 기존 토큰의 유효시간이 지났을경우, 그 토큰을 삭제한다.
      await client.token.delete({
        where: {
          id: prevToken.id,
        }
      })
    }
  }

  //여기까지 온것은 기존 토큰이 없거나, 유효기간이 사라져서 삭제되었을 경우. 어쨌든 여기서는 토큰이 하나도 없음.
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            email, // 나중에 찾을때 사용할 필드가 많으면 ...user 이렇게 할 수 있음. 그러면, email, name, 그런식.
          },
          create: {
            email,
            nickname: 'Anonymous' // 마찬가지. 결국 email : email, name : name, 이런식으로 찾거나 생성하라 그말임. 지금은 필드 하나니까
          }, //그냥 ...user에서 email, 로 바꿨음.
        },
      },
    },
  });
  if (email) {
    const sendMail = await mail.send({
      from: 'hwanine7@naver.com',
      to: email,
      subject: 'Your Airnote Verification Email',
      text: `Your login token is ${payload}`,
      html: `<strong>Airnote 로그인 토큰값은 ${payload} 입니다.</strong>`
    })
  }

  return res.json({
    ok: true,
  });
}

export default withHandler({
  methods: ["POST"],
  handler,
  isPrivate: false,
});
