import { Note, User } from "@prisma/client";
import type { NextPage } from "next";
import useSWR from "swr";
import client from "@libs/server/client";
import Link from "next/link";

interface noteList {
  ok: boolean;
  noteList: Note[];
}

const Home: NextPage<noteList> = (noteList) => {
  // const { data } = useSWR<noteList>("/api/statictest");
  return (
    <div>
      <p>getStaticProps를 테스트해본다</p>
      <Link href="/statictestcreate.tsx">노트만들기</Link>
      <div className="grid-cols-4 grid divide-x-2 p-4 gap-4 rounded-lg text-xl">
        {noteList?.noteList.map((note) => {
          return (
            <p key={note.id} className="m-1 bg-rose-200 p-1">
              {note.id}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  console.log("building notelist. statically");
  const noteList = await client.note.findMany({ include: { user: true } });
  return {
    props: {
      noteList: JSON.parse(JSON.stringify(noteList)),
    },
  };
}

export default Home;
