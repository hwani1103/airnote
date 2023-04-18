import { Note, User } from "@prisma/client";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import useSWR from "swr";
import client from "@libs/server/client";
import Link from "next/link";
import { useRouter } from "next/router";
interface NoteData {
  ok: boolean;
  note: Note;
}

const Home: NextPage<NoteData> = ({ note }) => {
  const router = useRouter();
  // const { data } = useSWR(`/api/staticprops/${router.query.id}`);

  if (router.isFallback) {
    return <div>Loading for you !!</div>;
  }
  return (
    <div className="flex flex-col justify-center items-center p-4 space-x-2 space-y-2">
      <Link href="/statictest">statictest</Link>
      <Link href="/statictestcreate.tsx">노트만들기</Link>
      <div>{note?.title}</div>
      <div>{note?.id}</div>
      <div>{note?.userId}</div>
      <div>{note?.content}</div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
    // fallback blocking은 최초 페이지가 만들어질 때 user는 아무것도 볼 수 없음.
    // 그 이후에는 바로바로 렌더링되긴함.
    // false는 안쓰면되고
    // true는. 동작은 blocking이랑 동일한데
    // 최초에 로딩되는동안 무언가가 보여지고 로딩이 되면 자동으로
    // 생성된 페이지가 보여짐.
    // 사용방법은 if(router.isFallback){return <div>Loading</div>}
    // 근데, 이 방법이 더 좋을지 blocking이 더 좋을지는 모르겠다.
    // 애초에 로딩이 최초1번인데.. 굳이 그럴필요가 있나 싶기도하고 모르겠다
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx?.params?.id) {
    return {
      props: {},
    };
  }

  const note = await client.note.findUnique({
    where: {
      id: Number(ctx.params.id),
    },
  });

  return {
    props: {
      note: JSON.parse(JSON.stringify(note)),
    },
  };
};

export default Home;
