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
import { TfiCommentsSmiley } from "react-icons/Tfi";
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
      <div className="pt-16 lg:pt-24 " />
      <div className="w-[95%] mx-auto max-w-[1240px]">
        <div className="p-2 border border-slate-700 rounded-lg space-y-2 pb-4">
          <div className="flex justify-between">
            <div className="flex rounded-xl px-1 divide-x divide-slate-400 items-center">
              <p className="pointer-events-none text-sm lg:px-2 lg:text-base text-slate-500 px-1 font-medium shadow-sm">
                {data?.noteInfo.user.gender}{" "}
              </p>
              <p className="pointer-events-none text-sm lg:px-2 lg:text-base text-slate-500 px-1 font-medium shadow-sm">
                {data?.noteInfo.user.age}{" "}
              </p>
              <p className="pointer-events-none text-sm lg:px-2 lg:text-base text-slate-500 px-1 font-medium shadow-sm">
                {data?.noteInfo.user.occupation}{" "}
              </p>
            </div>
            <p className="pointer-events-none text-sm lg:px-2 lg:text-base text-yellow-900 border border-indigo-500 py-1 px-2 font-medium shadow-sm bg-white rounded-xl">
              {cheerCount}명이 응원해요!📯
            </p>
          </div>
          <p className="pointer-events-none px-2 lg:px-3 lg:text-xl text-indigo-700">
            {data?.noteInfo?.user.nickname} 님의 Note : {data?.noteInfo?.title}
          </p>
          <div className="space-y-2 border lg:space-y-4 lg:p-2 lg:text-xl border-slate-700 rounded-lg">
            <p className="pointer-events-none text-base lg:text-lg p-4">
              {data?.noteInfo?.content}
            </p>
          </div>
          {loginUser?.profile?.id === data?.noteInfo?.user.id &&
          loginUser &&
          loginUser.ok ? (
            <div className="flex space-x-2 justify-end">
              <Link
                href={`/note/${router.query.id}/update`}
                className="bg-rose-300 cursor-pointer hover:bg-rose-700 hover:text-white ease-in-out duration-200 lg:text-lg px-2 rounded-lg text-slate-700 border border-red-800"
              >
                수정
              </Link>
              <div
                onClick={onDelete}
                className="bg-rose-300 cursor-pointer hover:bg-rose-700 hover:text-white ease-in-out duration-200 lg:text-lg px-2 rounded-lg text-slate-700 border border-red-800"
              >
                삭제
              </div>
            </div>
          ) : (
            ""
          )}

          {data?.noteInfo.user.id !== loginUser?.profile?.id &&
          loginUser &&
          loginUser.ok ? (
            <div className="flex space-x-3 justify-end">
              <div
                className={cls(
                  cheerFlag
                    ? "cursor-pointer self-center text-2xl ease-in-out duration-200 text-black"
                    : "cursor-pointer self-center text-2xl ease-in-out duration-200 text-rose-500 scale-125"
                )}
                onClick={cheerToggle}
              >
                <TfiCommentsSmiley className="block " />
              </div>
              <Link
                className="bg-rose-300 hover:bg-rose-700 hover:text-white ease-in-out duration-200 lg:text-lg px-2 rounded-lg text-slate-700 border border-red-800"
                href={`/note/${router.query.id}/reply/create`}
              >
                답글
              </Link>
            </div>
          ) : (
            ""
          )}

          {/* 글을 쓴 사람이랑, 로그인한 사람이랑 같으면서, 로그인 정보가 ok일때
        삭제버튼과 수정버튼을 보여준다. */}
        </div>
        <p className="pointer-events-none mt-2 lg:text-lg mb-6 text-sm text-slate-500 px-1 font-medium shadow-sm text-end">
          {moment(data?.noteInfo?.createdAt).format(
            "YY년 M월 DD일 a h시 mm분 작성"
          )}
        </p>
      </div>

      {data?.noteReply?.length && data?.noteReply.length > 0 ? (
        <div className="h-60 overflow-auto rounded-sm w-[95%] max-w-[1240px] mx-auto border border-slate-700 space-y-2">
          <p className="pointer-events-none px-4 pt-4 lg:text-xl text-indigo-700 border-b border-red-700 pb-2">
            {data?.noteInfo?.user.nickname} 님에게 전달된 답글이{" "}
            <span className="text-red-500">{data?.noteReply?.length}개</span>{" "}
            있어요.
          </p>
          {data?.noteReply?.map((reply) => {
            const diff = moment().diff(reply.createdAt, "day");
            let timeAgo: string = "";
            if (diff < 1) {
              const hourDiff = moment().diff(reply.createdAt, "hour");
              const minuteDiff = moment().diff(reply.createdAt, "minute");
              if (minuteDiff < 15) {
                timeAgo = `방금 전`;
              } else if (minuteDiff < 60) {
                timeAgo = `${minuteDiff}분 전`;
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
                className="p-2 m-2 border-b-2 border-indigo-400 text-sm text-slate-700"
              >
                <Link href={`/note/${router.query.id}/reply/${reply.id}`}>
                  <div className="pointer-events-none flex items-center space-x-2 lg:text-lg">
                    <p>{reply.user.nickname} 님이</p>
                    <p className="text-sm text-slate-700">
                      <span className="text-red-500 text-base">{timeAgo}</span>
                      에 작성하신 답글입니다.
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="pointer-events-none px-4 pt-4 text-rose-500 max-w-[1240px] mx-auto">
          아직 {data?.noteInfo?.user.nickname} 님에게 전달된 답글이 없어요.
        </p>
      )}

      <div className="pt-16 lg:pt-24 " />
    </Layout>
  );
};
export default NoteDetail;
