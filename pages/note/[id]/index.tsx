import Layout from "@components/layout";
import { cls } from "@libs/client/utils";
import { Cheer, Note, Reply, User } from "@prisma/client";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Custom404 from "pages/404";
import useSWR from "swr";
import { LoginUser } from "@libs/client/utils";
import { useEffect, useState } from "react";
import useMutation from "@libs/client/useMutation";
import moment from "moment";
import "moment/locale/ko";
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
  noteReply?: {
    id: number;
    createdAt: string;
    user: {
      nickname: string;
    };
  }[];
}

interface cheerToggle {
  ok: boolean;
  toggle: boolean;
}

const NoteDetail: NextPage = () => {
  const router = useRouter();
  const { data: loginUser } = useSWR<LoginUser>("/api/users/me");
  const { data, isLoading } = useSWR<NoteInfo>(
    router.query.id ? `/api/note/${router.query.id}` : ""
  ); // note

  const [mutate, { loading }] = useMutation<cheerToggle>( // cheer update
    `/api/note/${router.query?.id}/cheer`
  );

  const onDelete = async () => {
    // note delete
    await fetch(`/api/note/${router.query.id}/delete`, {
      method: "GET",
    }).then(() => {
      router.push("/note");
    });
  };

  const isCheered: () => boolean = () => {
    // cheer button true/false check
    let flag = true;
    if (data?.noteInfo?.cheers && data?.noteInfo?.cheers?.length > 0) {
      data?.noteInfo?.cheers.map((cheer) => {
        if (cheer?.userId === loginUser?.profile?.id) {
          flag = false;
          return;
        }
      });
    }
    return flag;
  };

  const [cheerCount, setCheerCount] = useState(0); // cheer count state
  const [cheerFlag, setCheerFlag] = useState(true); // cheer flag state
  const [optimisticFlag, setOptimisticFlag] = useState(false);

  useEffect(() => {
    if (data) {
      setCheerFlag(isCheered());
      setCheerCount(data?.noteInfo?.cheers?.length!);
    }
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

  if (!data) {
    return <div>Loading...</div>;
  } else if (!data.ok) {
    return <Custom404 />;
  }

  return (
    <Layout seoTitle={"Note Detail"}>
      <div className="flex flex-col space-y-2">
        <p>Note Detail</p>
        <p>제목 : {data?.noteInfo?.title}</p>
        <p>닉네임 : {data?.noteInfo?.user.nickname}</p>
        <p>내용 : {data?.noteInfo?.content}</p>
        <p>나이 : {data?.noteInfo?.user.age}</p>
        <p>직업 : {data?.noteInfo?.user.occupation}</p>
        <p>성별 : {data?.noteInfo?.user.gender}</p>
        <p>cheer수 : {cheerCount}</p>
        <p>
          생성날짜 :{" "}
          {moment(data?.noteInfo?.createdAt).format("YYYY년 MM월 DD일")}
        </p>
        <p>
          생성날짜 + 시간 :{" "}
          {moment(data?.noteInfo?.createdAt).format(
            "YYYY년 MM월 DD일 a h시 m분"
          )}
        </p>
        <div className="h-48 overflow-auto p-4 m-4 border border-red-500">
          {data?.noteReply?.map((reply) => {
            const diff = moment().diff(reply.createdAt, "day");
            let timeAgo: string = "";
            if (diff < 1) {
              const hourDiff = moment().diff(reply.createdAt, "hour");
              if (hourDiff < 1) {
                timeAgo = `방금 전`;
              } else {
                timeAgo = `${hourDiff}시간 전`;
              }
            } else if (diff < 7) {
              timeAgo = `${diff}일 전`;
            } else if (diff < 28) {
              const weekDiff = Math.floor(diff / 7);
              timeAgo = `${weekDiff}주일 전`;
            } else if (diff < 365) {
              const monthDiff = moment().diff(reply.createdAt, "month");
              timeAgo = `${monthDiff}개월 전`;
            } else {
              const yearDiff = moment().diff(reply.createdAt, "year");
              timeAgo = `${yearDiff}년 전`;
            }
            return (
              <div
                key={reply.id}
                className="p-2 m-2 border-b-2 border-indigo-400"
              >
                <Link href={`/note/${router.query.id}/reply/${reply.id}`}>
                  <p>{reply.user.nickname} 님께서</p>
                  <p>
                    <span className="text-red-500">{timeAgo}</span>에 작성하신
                    답글입니다.
                  </p>
                  <p>{moment(reply.createdAt).format("M월 D일 a h시 m분")}</p>
                </Link>
              </div>
            );
          })}
        </div>
        <div>
          {data?.noteInfo.user.id !== loginUser?.profile?.id &&
          loginUser &&
          loginUser.ok ? (
            <div>
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
              <Link
                className="p-4 bg-yellow-700 text-white ring-2 ring-offset-2 ring-blue-500 mx-auto rounded-lg"
                href={`/note/${router.query.id}/reply/create`}
              >
                답글 작성하기
              </Link>
            </div>
          ) : (
            ""
          )}
        </div>
        {/* 글을 쓴 사람이랑, 로그인한 사람이랑 같으면서, 로그인 정보가 ok일때
        삭제버튼과 수정버튼을 보여준다. */}
        {loginUser?.profile?.id === data?.noteInfo?.user.id &&
        loginUser &&
        loginUser.ok ? (
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
