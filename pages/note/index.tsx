import Layout from "@components/layout";
import { User } from "@prisma/client";
import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { cls, LoginUser } from "@libs/client/utils";
import { useRouter } from "next/router";
import client from "@libs/server/client";
import moment from "moment";
import "moment/locale/ko";
interface NoteList {
  ok: boolean;
  noteList: {
    title: string;
    content: string;
    createdAt: string;
    id: number;
    user: User;
    _count: {
      replies: number;
      cheers: number;
    };
  }[];
  noteCount: number;
}

interface NoteCount {
  ok: boolean;
  noteCount: number;
}
const Note: NextPage<NoteList> = ({ noteList, noteCount }) => {
  const router = useRouter();
  const { data: loginUser } = useSWR<LoginUser>("/api/users/me");

  return (
    <Layout seoTitle={"NoteList"}>
      <div className="pt-16 lg:pt-24 " />
      <p>{noteCount} 개의 노트가 있어요.</p>
      <div className="gap-4 grid grid-cols-2 lg:grid-cols-2">
        {noteList?.map((note) => {
          return (
            <div
              key={note.id}
              className="p-2 col-span-2 lg:col-span-1 cursor-pointer hover:bg-slate-200 ease-in-out duration-100"
            >
              <div
                onClick={() => {
                  router.push(`/note/${note.id}`);
                }}
                className={cls(
                  note.user.id === loginUser?.profile?.id
                    ? "rounded-lg p-4 bg-white border border-slate-500 space-y-2"
                    : "rounded-lg p-4 bg-white border border-slate-500 space-y-2"
                )}
              >
                <p className="border-b border-slate-800 p-1 font-medium shadow-sm">
                  고민 제목 : {note.title}
                </p>
                <p className="border-b border-slate-800 p-1 font-medium shadow-sm">
                  작성자 : {note.user.nickname}{" "}
                </p>
                <div className="flex py-2 items-center justify-between">
                  <div className="flex rounded-xl px-1 divide-x divide-slate-400">
                    <p className="text-sm text-slate-500 px-1 font-medium shadow-sm">
                      {note.user.gender}{" "}
                    </p>
                    <p className="text-sm text-slate-500 px-1 font-medium shadow-sm">
                      {note.user.age}{" "}
                    </p>
                    <p className="text-sm text-slate-500 px-1 font-medium shadow-sm">
                      {note.user.occupation}{" "}
                    </p>
                  </div>
                  <p className="text-end text-sm text-slate-500 px-1">
                    {moment(note.createdAt).format("M/D에 작성")}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {loginUser?.ok ? (
        <Link href="/note/create">
          <div
            className="cursor-pointer fixed bottom-10 right-5 hover:bg-slate-700 p-3 rounded-xl hover:text-white bg-slate-300 text-slate-700 ease-in-out duration-300
        lg:p-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6 lg:w-8 lg:h-8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              />
            </svg>
          </div>
        </Link>
      ) : (
        ""
      )}
      <div className="pt-16 lg:pt-24 " />
    </Layout>
  );
};

export async function getStaticProps() {
  console.log("getStaticProps!!!!!!!!!!!!!!!!");
  const noteList = await client.note.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      title: true,
      content: true,
      createdAt: true,
      id: true,
      userId: true,
      user: {
        select: {
          nickname: true,
          id: true,
          age: true,
          occupation: true,
          gender: true,
        },
      },
      _count: {
        select: {
          replies: true,
          cheers: true,
        },
      },
    },
  });
  console.log(noteList.length);
  const noteCount = await client.note.count();
  console.log(noteCount);
  return {
    props: {
      noteList: JSON.parse(JSON.stringify(noteList)),
      noteCount,
    },
  };
}

export default Note;
