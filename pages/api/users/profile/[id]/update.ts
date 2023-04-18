import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
): Promise<any> {

  const { query: { id }, body: { nickname, age }, session: { user } } = req;
  let { body: { occupation, gender } } = req;
  if (id != user?.id) {
    return res.status(404).json({ ok: false })
  }

  if (!id || !nickname || !user || !age || !gender || !occupation) return res.status(404).end();


  if (gender !== 'man' && gender !== 'woman') return res.status(404).json({ ok: false })
  if (gender == 'man') {
    gender = '남자'
  } else if (gender == 'woman') {
    gender = '여자'
  }
  if (
    occupation !== 'elementary' &&
    occupation !== 'middle' &&
    occupation !== 'high' &&
    occupation !== 'soldier' &&
    occupation !== 'unemployed' &&
    occupation !== 'entreprenuer' &&
    occupation !== 'resting' &&
    occupation !== 'officer' &&
    occupation !== 'professional'
  ) return res.status(404).json({ ok: false })

  if (occupation == 'elementary') {
    occupation = '초등학생'
  } else if (occupation == 'middle') {
    occupation = '중학생'
  } else if (occupation == 'high') {
    occupation = '고등학생'
  } else if (occupation == 'soldier') {
    occupation = '군인'
  } else if (occupation == 'unemployed') {
    occupation = '취준생'
  } else if (occupation == 'resting') {
    occupation = '쉬는중'
  } else if (occupation == 'officer') {
    occupation = '직장인'
  } else if (occupation == 'professional') {
    occupation = '전문직'
  } else if (occupation == 'entreprenuer') {
    occupation = '사업가'
  }


  if (!/^[1-9][0-9]?$|^99$/.test(age)) {
    return res.status(404).json({ ok: false })
  }
  let ageRange;
  if (age < 10) {
    ageRange = '어린이';
  } else if (age < 20) {
    ageRange = '10대';
  } else if (age < 30) {
    ageRange = '20대';
  } else if (age < 40) {
    ageRange = '30대';
  } else if (age < 50) {
    ageRange = '40대';
  } else if (age < 60) {
    ageRange = '50대';
  } else if (age < 70) {
    ageRange = '60대';
  } else {
    ageRange = '고령층'
  }


  if (!/^[a-zA-Z가-힣]{2,15}$/.test(nickname)) {
    // return res.status(403).json({ok: false})
    return res.status(404).json({ ok: false })
  }

  const userProfile = await client.user.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      profileSet: true,
    }
  })

  if (userProfile?.profileSet) {
    return res.status(404).json({ ok: false })
  }
  await client.user.update({
    where: {
      id: Number(id),
    },
    data: {
      nickname,
      age: ageRange,
      occupation,
      gender,
      profileSet: true,
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
