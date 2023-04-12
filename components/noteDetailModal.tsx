import { Cheer, Note, Reply, User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { cls, LoginUser } from "@libs/client/utils";
import { useRouter } from "next/router";
import useMutation from "@libs/client/useMutation";
import Link from "next/link";
import moment from "moment";
import "moment/locale/ko";
type Props = {
  handleFlag: () => void;
  noteId: number;
};

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

//이거는 냅뒀다가 Note Fetch한후 Read할때 적용하자. Create는 페이지를 만드는게 나을듯
export default function NoteCreateModal({ handleFlag, noteId }: Props) {
  const router = useRouter();
  const { data: loginUser } = useSWR<LoginUser>("/api/users/me"); // user
  const { data, isLoading } = useSWR<NoteInfo>(`/api/note/${noteId}`);
  const [mutate, { loading }] = useMutation<cheerToggle>( // cheer update
    `/api/note/${noteId}/cheer`
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
    if (data) {
      setCheerFlag(isCheered());
      setCheerCount(data?.noteInfo.cheers.length!);
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

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-12 bg-yellow-200">
        loading...{" "}
      </div>
    );
  }

  return (
    <div>
      <div className="fixed top-0 left-0 opacity-50 w-full h-full bg-black "></div>
      <div className="fixed top-10 right-0 left-0 bg-white w-[90%] h-[90%] mx-auto">
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
                  <Link href={`/note/${noteId}/reply/${reply.id}`}>
                    <p>{reply.user.nickname} 님께서</p>
                    <p>{timeAgo}에 작성하신 답글입니다.</p>
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
                  href={`/note/${noteId}/reply/create`}
                >
                  답글 작성하기
                </Link>
              </div>
            ) : (
              ""
            )}
          </div>
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
          <button
            onClick={handleFlag}
            className="p-2 m-4 fixed top-0 right-0 bg-rose-600 text-white rounded-lg shadow-md"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
