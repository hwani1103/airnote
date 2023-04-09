import Layout from "@components/layout";
import useMutation from "@libs/client/useMutation";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

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
    if (data) {
      returnDetailPage();
      prevDataMutate();
    }
  }, [data]);

  const returnDetailPage = () => {
    if (router.query.id) {
      router.push(`/note/${router.query.id}`);
    }
  };

  return (
    <Layout>
      <div>
        <p>
          노트를 수정해봅시다. 여기서는 router.query.id로 일단 해당 게시물을
          조회해온 뒤 그 정보를 defaultValue로 넣어놓거나 해야함.. 오류생기면
          거의 다 reset을 안해줬거나 register 이름 뭐 그런문제일 확률이 높다잉
        </p>
        <form
          onSubmit={handleSubmit(onValid)}
          className="flex flex-col mx-auto space-y-2 mt-4"
        >
          <p className="text-xl">제목</p>
          <input
            defaultValue={noteData?.noteUpdate.title}
            className="rounded-lg p-4 bg-indigo-100 border-1 border-indigo-800"
            {...register("title", {
              required: true,
            })}
            type="text"
            id="title"
          />
          <p className="text-xl">내용</p>
          <textarea
            defaultValue={noteData?.noteUpdate.content}
            className="resize-none h-60 rounded-lg p-4 bg-indigo-100 border-1 border-indigo-800"
            {...register("content", {
              required: false,
            })}
            id="content"
          />
          <div>
            <button className="bg-indigo-500 p-2 rounded-full w-1/2 mx-auto text-white">
              저장
            </button>
            <button
              onClick={returnDetailPage}
              type="button"
              className="bg-indigo-500 p-2 rounded-full w-1/2 mx-auto text-white"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
export default NoteUpdate;
