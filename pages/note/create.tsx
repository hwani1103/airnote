import Layout from "@components/layout";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
interface NoteCreateForm {
  title: string;
  content: string;
}

interface newNoteInfo {
  ok: boolean;
  noteId: number;
}

const NoteCreate: NextPage = () => {
  const { user } = useUser();

  const router = useRouter();
  const [mutate, { loading, data }] = useMutation<newNoteInfo>("/api/note");

  const { register, handleSubmit } = useForm<NoteCreateForm>();

  const onValid = (form: NoteCreateForm) => {
    if (loading) return;
    mutate(form);
  };
  useEffect(() => {
    if (data && data.ok && data.noteId) {
      router.push(`/note/${data.noteId}`);
    }
  }, [data]);

  const [tip, setTip] = useState(false);
  if (user) {
    return (
      <Layout seoTitle={"NoteCreate"}>
        <div className="pt-16 lg:pt-24 " />
        <div className="p-2 max-w-[1240px] mx-auto">
          <form
            onSubmit={handleSubmit(onValid)}
            className="flex flex-col mx-auto space-y-4 mt-4"
          >
            <p className="text-xl lg:text-2xl">제목</p>
            <input
              className="rounded-lg p-4 border-1 border-indigo-800"
              {...register("title", {
                required: true,
              })}
              type="text"
              id="title"
            />

            {tip ? (
              <div className="rounded-lg p-3 border max-w-[800px] lg:p-6 mx-auto border-red-300">
                <p className="text-center p-2 lg:text-lg font-bold text-slate-800">
                  아래의 내용을 참고하여 고민을 적어보세요!
                </p>

                <div className="space-y-1 text-slate-800">
                  <li className="text-sm lg:text-base text-medium shadow-sm">
                    고민에 대해 한줄로 요약해 보세요
                  </li>
                  <li className="text-sm lg:text-base text-medium shadow-sm">
                    내가 제어할 수 있는 범위를 생각해보세요.
                  </li>
                  <li className="text-sm lg:text-base text-medium shadow-sm">
                    최초에 고민이 생기게 된 원인을 파악해보세요.
                  </li>
                  <li className="text-sm lg:text-base text-medium shadow-sm">
                    그로인해 달라진 내 상황이나 행동을 떠올려보세요.
                  </li>
                  <li className="text-sm lg:text-base text-medium shadow-sm">
                    단계적으로 고민을 해결하기 위한 계획을 세워보세요.
                  </li>
                  <li className="text-sm lg:text-base text-medium shadow-sm">
                    최대한 많은 내용을 머릿속에서 꺼내어 글로 적어보세요!
                  </li>
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="flex items-center justify-between">
              <p className="text-xl lg:text-2xl">내용</p>

              <p
                onClick={() => {
                  setTip(!tip);
                }}
                className="px-3 py-1 mx-2 text-sm bg-red-300 text-slate-800 rounded-full ease-in-out duration-300  hover:bg-red-800 hover:text-white cursor-pointer lg:text-lg"
              >
                고민 작성 Tip!
              </p>
            </div>
            <textarea
              className="resize-none h-60 rounded-lg p-4 border-1 border-indigo-800"
              {...register("content", {
                required: true,
              })}
              id="content"
            />
            <button
              className="bg-slate-200 p-2 rounded-full w-full mx-auto 
          text-slate-800 text-xl border border-slate-700 
          hover:text-slate-200 hover:bg-slate-600 active:translate-x-1 ease-in-out duration-300"
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <AiOutlineLoading3Quarters className="animate-spin mx-2 text-indigo-700 ring-1 ring-white rounded-full border-none " />
                </div>
              ) : (
                "작성하기"
              )}
            </button>
          </form>
        </div>
        <div className="pt-16 lg:pt-24 " />
      </Layout>
    );
  } else return <div></div>;
};
export default NoteCreate;
