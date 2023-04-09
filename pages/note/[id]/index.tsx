import Layout from "@components/layout";
import NoteCreateModal from "@components/noteDetailModal";
import useMutation from "@libs/client/useMutation";
import { Cheer, Note, Reply, User } from "@prisma/client";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import type { LoginUser } from "@libs/client/utils";
import { cls } from "@libs/client/utils";
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
  flag: boolean;
}

interface cheerToggle {
  ok: boolean;
  toggle: boolean;
}

const NoteDetail: NextPage = () => {
  const router = useRouter();
  const { data: loginUser } = useSWR<LoginUser>("/api/users/me"); // user
  const { data, isLoading } = useSWR<NoteInfo>(
    router.query.id ? `/api/note/${router.query.id}` : ""
  ); // note

  const [mutate, { loading }] = useMutation<cheerToggle>( // cheer update
    `/api/note/${router.query?.id}/cheer`
  );

  const onDelete = async () => {
    // note delete
    if (router.query.id) {
      await fetch(`/api/note/${router.query.id}/delete`, {
        method: "GET",
      }).then(() => {
        router.push("/note");
      });
    } else return;
  };

  const isCheered: () => boolean = () => {
    // cheer button true/false check
    let flag = true;
    if (data?.noteInfo.cheers && data?.noteInfo.cheers.length > 0) {
      data?.noteInfo.cheers.map((cheer) => {
        if (cheer.userId === loginUser?.profile.id) {
          flag = false;
          return;
        }
      });
    }
    return flag;
  };

  const [cheerCount, setCheerCount] = useState(0); // cheer count state
  const [cheerFlag, setCheerFlag] = useState(true); // cheer flag state
  const [optimisticFlag, setOptimisticFlag] = useState(false); // cheer optimistic race condition prevent state

  useEffect(() => {
    setCheerFlag(isCheered());
    setCheerCount(data?.noteInfo.cheers.length!);
  }, [data]);

  const cheerToggle = () => {
    if (optimisticFlag) return;
    setOptimisticFlag(true);
    setTimeout(() => {
      setOptimisticFlag(false);
    }, 2000);

    if (cheerFlag) {
      setCheerCount(cheerCount + 1);
    } else {
      setCheerCount(cheerCount - 1);
    }

    setCheerFlag(!cheerFlag);
    if (loading) return;
    mutate({});
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="flex flex-col space-y-2">
        <p>Note Detail</p>
        <p>제목 : {data?.noteInfo?.title}</p>
        <p>닉네임 : {data?.noteInfo?.user.nickname}</p>
        <p>내용 : {data?.noteInfo?.content}</p>
        <p>나이 : {data?.noteInfo?.user.age}</p>
        <p>직업 : {data?.noteInfo?.user.occupation}</p>
        <p>성별 : {data?.noteInfo?.user.gender}</p>
        <p>cheer수 : {cheerCount}</p>
        <p>reply수 : {data?.noteInfo?.replies?.length}</p>
        <p>생성날짜 : {data?.noteInfo?.createdAt}</p>
        <p>reply확인</p>
        <div>
          {data?.noteInfo.user.id !== loginUser?.profile.id ? (
            <div>
              <Link
                className="p-4 bg-yellow-700 text-white ring-2 ring-offset-2 ring-blue-500 mx-auto rounded-lg"
                href={`/note/${router.query.id}/reply/create`}
              >
                답글 작성하기
              </Link>

              <button
                className={cls(
                  cheerFlag
                    ? "p-4 rounded-xl ring-2 ring-offset-2 ring-rose-800 border border-indigo-500 bg-indigo-500 text-white"
                    : "p-4 rounded-xl ring-2 ring-offset-2 ring-rose-800 border border-indigo-500 bg-red-500 text-white"
                )}
                onClick={cheerToggle}
              >
                {optimisticFlag
                  ? "Cheer Button 2초에 한번씩만 가능함"
                  : "Cheer Button"}
              </button>
            </div>
          ) : (
            ""
          )}
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
      </div>
    </Layout>
  );
};
export default NoteDetail;

// const [modalFlag, setModalFlag] = useState(false);
// const handleFlag = () => {
//   setModalFlag(!modalFlag);
// };
