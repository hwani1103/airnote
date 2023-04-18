import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<any> {

  const { session: { user } } = req;

  await client.note.create({
    data: {
      title: 'title!', content: 'content!',
      user: {
        connect: {
          id: user?.id,
        }
      }
    }
  })

  await res.revalidate('/statictest')

  // statictest.tsx는, 모든 note를 조회하는 prisma 쿼리가 있는 클라이언트 페이지임.
  // 그 쿼리는 getStaticProps에 들어있고
  // 다른 페이지에서 이 API를 호출하면, 응답을 하기전에 revalidate를 해주면, 그 페이지의 데이터가 최신화
  // 이걸 자기 페이지에서 쓰려면. 강제로 리다이렉트를 한번 해줘야
  // 왜냐면, revalidate가 일어나도 실제 다시 빌드하고 가져오는 시간이 최소 얼마는 걸릴테니 그동안은 접속해도 예전데이터임
  // 그래서 글을 쓰면, 그 디테일 페이지를 먼저 보여주면서 리스트 페이지를 revalidate시켜버리면 , 디테일에서 리스트로 갈쯤에는 최신화가 되어있음
  // 아주 좋은기능



  res.json({ ok: true })

}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
    isPrivate: false
  })
);
