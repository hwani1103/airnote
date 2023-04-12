import Layout from "@components/layout";
import useMutation from "@libs/client/useMutation";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import type { LoginUser } from "@libs/client/utils";
import { User } from "@prisma/client";
import Custom404 from "pages/404";
interface NoteData {
  ok: true;
  noteInfo: {
    title: string;
    content: string;
    user: User;
  };
}

interface ReplyData {
  ok: true;
  prevReply: {
    reply: string;
    userId: number;
    user: User;
  };
}

interface ReplyForm {
  replyUpdate: string;
}

const NoteCreate: NextPage = () => {
  const router = useRouter();
  const { data: loginUser } = useSWR<LoginUser>("/api/users/me"); //수정삭제 버튼 여부 로그인유져 검증
  const { data } = useSWR<NoteData>(
    router.query.id ? `/api/note/${router.query.id}/reply` : ""
  ); // 답글 수정화면에서도 원본의 제목내용을 보여줌
  const { data: replyData, mutate: prevReplyUpdate } = useSWR<ReplyData>(
    `/api/note/${router.query.id}/reply/${router.query.no}/update`
  ); // defaultvalue로 사용할 이전 답글

  const [mutate, { loading, data: mutateResult }] = useMutation(
    `/api/note/${router.query.id}/reply/${router.query.no}/update`
  );

  const { register, handleSubmit, reset } = useForm<ReplyForm>(); // rpely update form

  const onUpdate = (form: ReplyForm) => {
    if (loading) return;
    mutate(form);
  };
  const updateReplyAsync = async () => {
    if (mutateResult && mutateResult.ok) {
      await prevReplyUpdate();
      setUpdateFlag(false);
    }
  };
  // 페이지 이동 X. 같은 페이지에서 update및 재렌더링이므로 useEffect와 async를 사용하여 응답을 받은 후 재렌더링하게 함.
  useEffect(() => {
    if (mutateResult && mutateResult.ok) updateReplyAsync();
  }, [mutateResult]);

  const onDelete = () => {
    if (router.query.id && router.query.no) {
      fetch(`/api/note/${router.query.id}/reply/${router.query.no}/delete`, {
        method: "GET",
      }).then(() => {
        router.push(`/note/${router.query.id}`);
      });
    }
  };

  const [updateFlag, setUpdateFlag] = useState(false);
  const updateReply = () => {
    setUpdateFlag(true);
  };
  const updateCancle = () => {
    setUpdateFlag(false);
  };

  if (!replyData) {
    return <div>Loading...</div>;
  } else if (!replyData.ok) {
    return <Custom404 />;
  }
  return (
    <Layout seoTitle={"ReplyDetail"}>
      <div>
        <p>
          여기서는 이전 글의 Note정보는 필요없고, Reply정보만 있으면됨. 그래서
          defaultValue로 깔아주면되지.
        </p>
        <p>글쓴이 : {data?.noteInfo.user.nickname}</p>
        <p>글제목 : {data?.noteInfo.title}</p>
        <p>내용 : {data?.noteInfo.content}</p>
        {updateFlag ? (
          <form
            onSubmit={handleSubmit(onUpdate)}
            className="flex flex-col mx-auto space-y-2 mt-4"
          >
            <p className="text-xl">답글 수정</p>
            <textarea
              className="resize-none h-60 rounded-lg p-4 bg-indigo-100 border-1 border-indigo-800"
              {...register("replyUpdate", {
                required: true,
              })}
              defaultValue={replyData?.prevReply.reply}
              id="content"
            />
            <div className="flex">
              <button
                onClick={updateReply}
                className="bg-indigo-500 p-2 rounded-full w-1/2 mx-auto text-white"
              >
                {loading ? "Loading.." : "저장"}
              </button>
              <button
                onClick={updateCancle}
                type="button"
                className="bg-indigo-500 p-2 rounded-full w-1/2 mx-auto text-white"
              >
                취소
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col mx-auto space-y-2 mt-4">
            <p className="text-xl">답글</p>
            <textarea
              className="pointer-events-none resize-none h-60 rounded-lg p-4 bg-indigo-100 border-1 border-indigo-800"
              defaultValue={replyData?.prevReply.reply}
              readOnly
              id="content"
            />

            {loginUser?.profile.id === replyData?.prevReply.userId ? (
              <div className="flex">
                <button
                  type="button"
                  onClick={updateReply}
                  className="bg-indigo-500 p-2 rounded-full w-1/2 mx-auto text-white"
                >
                  수정
                </button>
                <button
                  onClick={onDelete}
                  type="button"
                  className="bg-indigo-500 p-2 rounded-full w-1/2 mx-auto text-white"
                >
                  삭제
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        )}
        <p>답글 작성자 : {replyData?.prevReply.user.nickname}</p>
      </div>
    </Layout>
  );
};
export default NoteCreate;
