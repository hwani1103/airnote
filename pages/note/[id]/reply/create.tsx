import Layout from "@components/layout";
import useMutation from "@libs/client/useMutation";
import { User } from "@prisma/client";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import type { LoginUser } from "@libs/client/utils";
import useUser from "@libs/client/useUser";
import Custom404 from "pages/404";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
interface NoteData {
  ok: boolean;
  noteInfo: {
    title: string;
    content: string;
    user: User;
    _count: {
      cheers: number;
    };
  };
}

interface ReplyForm {
  reply: string;
}

interface NewReplyData {
  ok: boolean;
  replyId: number;
}

const NoteCreate: NextPage = () => {
  useUser();
  const router = useRouter();
  const { data: loginUser } = useSWR<LoginUser>("/api/users/me");
  const { data } = useSWR<NoteData>(
    router.query.id ? `/api/note/${router.query.id}/reply` : ""
  );

  const [mutate, { loading, data: replyData }] = useMutation<NewReplyData>(
    `/api/note/${router.query.id}/reply`
  );

  const { register, handleSubmit, reset } = useForm<ReplyForm>();
  console.log(router.query.id);

  const onValid = (form: ReplyForm) => {
    if (loading) return;
    const dataWithReplyAuthor = {
      ...form,
      userId: data?.noteInfo.user.id, //게시글 작성자의 id 가 들어가야됨 !!
      author: {
        nickname: loginUser?.profile.nickname,
        id: loginUser?.profile.id,
      },
    };
    mutate(dataWithReplyAuthor); // 여기서, 로그인 사용자의 닉네임을 author로 보내주고.
  };
  useEffect(() => {
    if (replyData && replyData.ok) {
      router.push(`/note/${router.query.id}/reply/${replyData.replyId}`);
    }
  }, [replyData]);

  if (loginUser && loginUser.ok) {
    if (!data) {
      return <div>Loading...</div>;
    } else if (!data.ok) {
      return <Custom404 />;
    }
    return (
      <Layout seoTitle={"ReplyCreate"}>
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
                {data?.noteInfo?._count?.cheers}명이 응원해요!📯
              </p>
            </div>
            <p className="pointer-events-none px-2 lg:px-3 lg:text-xl text-indigo-700">
              {data?.noteInfo?.user.nickname} 님의 Note
            </p>
            <div className="space-y-2 border lg:space-y-4 lg:p-2 lg:text-xl border-slate-700 rounded-lg">
              <p className="pointer-events-none p-2 border-b border-red-700">
                {data?.noteInfo?.title}
              </p>
              <p className="pointer-events-none p-2 text-sm lg:text-base">
                {data?.noteInfo?.content}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onValid)}
            className="flex flex-col mx-auto space-y-2 mt-4"
          >
            <p className="text-xl">답글</p>
            <textarea
              className="resize-none h-60 rounded-lg p-4 border-1 border-indigo-800"
              {...register("reply", {
                required: true,
              })}
              id="content"
            />
            <button className="bg-rose-300 max-w-[600px] w-full active:translate-x-1 hover:bg-red-700 hover:text-white p-2 rounded-full mx-auto text-black">
              {loading ? (
                <div className="flex justify-center items-center">
                  <AiOutlineLoading3Quarters className="animate-spin mx-2 text-indigo-700 ring-1 ring-white rounded-full border-none " />
                </div>
              ) : (
                "전송"
              )}
            </button>
          </form>
        </div>
        <div className="pt-16 lg:pt-24 " />
      </Layout>
    );
  } else {
    return <div></div>;
  }
};
export default NoteCreate;
