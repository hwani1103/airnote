import Layout from "@components/layout";
import NoteCreateModal from "@components/noteCreateModal";
import useMutation from "@libs/client/useMutation";
import { Cheer, Note, Reply, User } from "@prisma/client";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import type { UserData } from "@components/layout";
//여기서 필요한 정보 : Note id(router.query.id)를 가지고 API에 Note 및 Note를 작성한 User정보를 가져와야된다.
//api/note/${}로 요청. router.query.id이용. 그럼 그걸 받아서. 노트정보 및 유저를 include해서 가져와주면 된다.

interface NoteWithUser {
  note: Note;
  user: User;
  title: string;
  content: string;
  createdAt: string;
  replies: Reply[];
  cheers: Cheer[];
}

interface NoteInfo {
  ok: boolean;
  noteInfo: NoteWithUser;
}

const NoteDetail: NextPage = () => {
  const { data: loginUser } = useSWR<UserData>("/api/users/me");
  const router = useRouter();
  const { data, isLoading } = useSWR<NoteInfo>(
    router.query.id ? `/api/note/${router.query.id}` : ""
  );

  const onDelete = async () => {
    if (router.query.id) {
      await fetch(`/api/note/${router.query.id}/delete`, {
        method: "GET",
      }).then(() => {
        router.push("/note");
      });
    } else return;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  //{loginUser?.profile.id === data?.noteInfo?.user.id ? (
  console.log(loginUser?.profile.id);
  console.log(data?.noteInfo?.user.id);
  return (
    <Layout>
      <div className="flex flex-col">
        <p>Note Detail</p>
        <p>제목 : {data?.noteInfo?.title}</p>
        <p>닉네임 : {data?.noteInfo?.user.nickname}</p>
        <p>내용 : {data?.noteInfo?.content}</p>
        <p>나이 : {data?.noteInfo?.user.age}</p>
        <p>직업 : {data?.noteInfo?.user.occupation}</p>
        <p>성별 : {data?.noteInfo?.user.gender}</p>
        <p>cheer수 : {data?.noteInfo?.cheers?.length}</p>
        <p>reply수 : {data?.noteInfo?.replies?.length}</p>
        <p>생성날짜 : {data?.noteInfo?.createdAt}</p>
      </div>
      {loginUser?.profile.id === data?.noteInfo?.user.id ? (
        <div className="flex space-x-4 mt-4">
          <button
            onClick={onDelete}
            className="bg-rose-600 p-2 rounded-xl text-white"
          >
            삭제버튼
          </button>
          <Link
            href={`/note/${router.query.id}/update`}
            className="bg-rose-600 p-2 rounded-xl text-white"
          >
            수정버튼
          </Link>
        </div>
      ) : (
        ""
      )}
    </Layout>
  );
};
export default NoteDetail;

// const [modalFlag, setModalFlag] = useState(false);
// const handleFlag = () => {
//   setModalFlag(!modalFlag);
// };
