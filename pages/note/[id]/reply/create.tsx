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
interface NoteData {
  ok: boolean;
  noteInfo: {
    title: string;
    content: string;
    user: User;
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
      author: loginUser?.profile.nickname,
    };
    mutate(dataWithReplyAuthor); // 여기서, 로그인 사용자의 닉네임을 author로 보내주고.
  };
  useEffect(() => {
    if (replyData) {
      router.push(`/note/${router.query.id}/reply/${replyData.replyId}`);
    }
  }, [replyData]);

  return (
    <Layout>
      <div>
        <p>
          답글 작성하기 여기서. note의 detail에서 정보를 가져온다음에 그걸
          보여주고, 그걸 보면서 답글을 달 수 있는 기능을 구현하장.
        </p>
        <p>글쓴이 : {data?.noteInfo.user.nickname}</p>
        <p>글제목 : {data?.noteInfo.title}</p>
        <p>내용 : {data?.noteInfo.content}</p>
        <form
          onSubmit={handleSubmit(onValid)}
          className="flex flex-col mx-auto space-y-2 mt-4"
        >
          <p className="text-xl">답글</p>
          <textarea
            className="resize-none h-60 rounded-lg p-4 bg-indigo-100 border-1 border-indigo-800"
            {...register("reply", {
              required: true,
            })}
            id="content"
          />
          <button className="bg-indigo-500 p-2 rounded-full w-1/2 mx-auto text-white">
            {loading ? "Loading..." : "전송"}
          </button>
        </form>
      </div>
    </Layout>
  );
};
export default NoteCreate;
