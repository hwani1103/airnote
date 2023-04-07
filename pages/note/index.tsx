import Layout from "@components/layout";
import NoteCreateModal from "@components/noteCreateModal";
import { User } from "@prisma/client";
import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

interface NoteList {
  ok: boolean;
  noteList: {
    title: string;
    content: string;
    createdAt: string;
    id: number;
    user: User;
  }[];
}

const Note: NextPage = () => {
  const { data } = useSWR<NoteList>("/api/note");
  const { data: loginUser } = useSWR("/api/users/me");
  return (
    <Layout>
      <div className="space-y-4">
        {data?.noteList?.map((note) => {
          return (
            <div className="rounded-lg p-4 bg-yellow-200" key={note.id}>
              <h2>{note.title}</h2>
              <p>{note.content}</p>
              <p>{note.createdAt}</p>
              <p>[ {note.user.nickname} ]</p>
            </div>
          );
        })}
      </div>
      {loginUser?.ok ? (
        <div className="fixed bottom-20 right-10 bg-red-400 p-4 rounded-full text-white flex flex-col">
          <Link href="/note/create">노트작성</Link>
        </div>
      ) : (
        ""
      )}
    </Layout>
  );
};
export default Note;

// const [modalFlag, setModalFlag] = useState(false);
// const handleFlag = () => {
//   setModalFlag(!modalFlag);
// };
