import Layout from "@components/layout";
import useMutation from "@libs/client/useMutation";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface NoteCreateForm {
  title: string;
  content: string;
}

interface newNoteInfo {
  ok: boolean;
  noteId: number;
}

const NoteCreate: NextPage = () => {
  const router = useRouter();

  const [mutate, { loading, data }] = useMutation<newNoteInfo>("/api/note");

  const { register, handleSubmit, reset } = useForm<NoteCreateForm>();

  const onValid = (form: NoteCreateForm) => {
    mutate(form);
  };
  useEffect(() => {
    if (data && data.ok && data.noteId) {
      router.push(`/note/${data.noteId}`);
    }
  }, [data, router]);

  return (
    <Layout>
      <div>
        <p>
          노트를 적어볼까요? useForm과 인풋 텍스트area 필요하고, 유져 정보는
          어디서 가져올까? 여기서는 안가져와도 될것같아 왜냐면 , session id로
          API에서 활용하면될것같거든.
        </p>
        <form
          onSubmit={handleSubmit(onValid)}
          className="flex flex-col mx-auto space-y-2 mt-4"
        >
          <p className="text-xl">제목</p>
          <input
            className="rounded-lg p-4 bg-indigo-100 border-1 border-indigo-800"
            {...register("title", {
              required: true,
            })}
            type="text"
            id="title"
          />
          <p className="text-xl">내용</p>
          <textarea
            className="resize-none h-60 rounded-lg p-4 bg-indigo-100 border-1 border-indigo-800"
            {...register("content", {
              required: true,
            })}
            id="content"
          />
          <button className="bg-indigo-500 p-2 rounded-full w-1/2 mx-auto text-white">
            전송
          </button>
        </form>
      </div>
    </Layout>
  );
};
export default NoteCreate;

// const [modalFlag, setModalFlag] = useState(false);
// const handleFlag = () => {
//   setModalFlag(!modalFlag);
// 근데 개별 Note읽는 모달은 이걸로 안될것같긴한데 일단 참고삼아 냅둬보자.
// };