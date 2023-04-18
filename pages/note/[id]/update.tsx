import Layout from "@components/layout";
import useMutation from "@libs/client/useMutation";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
interface noteUpdate {
  ok: boolean;
  noteUpdate: noteUpdateForm;
}

interface noteUpdateForm {
  title: string;
  content: string;
}

const NoteUpdate: NextPage = () => {
  const router = useRouter();

  const { data: noteData, mutate: prevDataMutate } = useSWR<noteUpdate>(
    router.query.id ? `/api/note/${router.query.id}/update` : ""
  );

  const [mutate, { loading, data }] = useMutation(
    `/api/note/${router.query.id}/update`
  );

  const { register, handleSubmit, reset } = useForm<noteUpdateForm>();

  const onValid = (form: noteUpdateForm) => {
    if (loading) return;
    mutate(form);
  };
  useEffect(() => {
    // 이런 Case에서, if(data)가 없으면, data가 undefined일떄도 useEffect의 콜백이 동작하므로 조심해야함.
    if (data && data.ok) {
      returnDetailPage();
      prevDataMutate();
    }
  }, [data]);

  const returnDetailPage = () => {
    router.push(`/note/${router.query.id}`);
  };

  return (
    <Layout seoTitle={"NoteUpdate"}>
      <div className="pt-16 lg:pt-24 " />
      <div className="p-2 max-w-[1240px] mx-auto">
        <form
          onSubmit={handleSubmit(onValid)}
          className="flex flex-col mx-auto space-y-4 mt-4"
        >
          <p className="text-xl lg:text-2xl">제목</p>
          <input
            defaultValue={noteData?.noteUpdate.title}
            className="rounded-lg p-4 border-1 border-indigo-800"
            {...register("title", {
              required: true,
            })}
            type="text"
            id="title"
          />
          <p className="text-xl lg:text-2xl">내용</p>

          <textarea
            defaultValue={noteData?.noteUpdate.content}
            className="resize-none h-60 rounded-lg p-4 border-1 border-indigo-800"
            {...register("content", {
              required: true,
            })}
            id="content"
          />
          <div className="flex">
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
                "저장"
              )}
            </button>
            <button
              onClick={returnDetailPage}
              type="button"
              className="bg-slate-200 p-2 rounded-full w-full mx-auto 
          text-slate-800 text-xl border border-slate-700 
          hover:text-slate-200 hover:bg-slate-600 active:translate-x-1 ease-in-out duration-300"
            >
              취소
            </button>
          </div>
        </form>
      </div>
      <div className="pt-16 lg:pt-24 " />
    </Layout>
  );
};
export default NoteUpdate;
