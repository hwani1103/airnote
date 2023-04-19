import Layout from "@components/layout";
// import NoteDetailModal from "@components/noteDetailModal";
import { User } from "@prisma/client";
import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { cls, LoginUser } from "@libs/client/utils";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
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
}
interface NoteCount {
  ok: boolean;
  noteCount: number;
}
const NoteDetailModal = dynamic(() => import("@components/noteDetailModal"));
const Note: NextPage = () => {
  const router = useRouter();
  const { data, isLoading } = useSWR<NoteList>("/api/note"); // 그냥 이렇게 하면됨. 요청 한번 이후에 안간다. okok
  const [skip, setSkip] = useState(10); // pagination.지금 2개씩 가져오게 해뒀음.
  const { data: moreData, mutate } = useSWR<NoteList>(`/api/note?skip=${skip}`);
  const { data: loginUser } = useSWR<LoginUser>("/api/users/me");
  const { data: noteCount } = useSWR<NoteCount>("api/note/notes");
  useEffect(() => {
    // ok 문제없음 useEffect.
    if (data && data.ok) {
      setNotes(data.noteList); // 이거는 초기 한번밖에 수행안됨. 이후에는 moreData가 바뀌기때문에.
    }
  }, [data]);
  const [notes, setNotes] = useState<NoteList["noteList"]>([]);
  const moreNote = () => {
    // 가져오기 버튼. 이걸 스크롤로 구현하면 더 좋겠지만 아직 어려워서 못했음. 리팩토링 때 고려
    // 그리고 더이상 가져올 게 없으면. 즉 notes의 length와 전체 note의 length가 같으면 더 가져오기 버튼 숨겨버리기.
    // 그리고 지금 setSkip에서 한번씩 버그 생김. setSkip의 값이 계속 누적되면서.. 이 버그를 해결해야함.
    // 버그상황일떄 얘를 2로 다시 바꿔주면 됨. 리스트도 다시 2개로 초기화한다음에..
    setSkip(skip + 10);
    mutate();
    if (moreData) {
      setNotes((prevNotes) => [...prevNotes, ...moreData.noteList]);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteId, setNoteId] = useState(0);
  const handleOpenModal = (noteId: number) => {
    setNoteId(noteId);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <Layout seoTitle={"NoteList"}>
      <div className="pt-16 lg:pt-24 " />
      <p className="text-center text-slate-800 text-md py-4">
        총 {noteCount?.noteCount} 개의 Note가 검색되었어요.
      </p>
      <div className="gap-4 grid grid-cols-2 lg:grid-cols-2">
        {isLoading ? "노트를 가져오는중 ..." : ""}

        {notes.map((note) => {
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
                    {moment(note.createdAt).format("M월 D일에 작성")}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div className="col-span-2">
          {noteCount?.noteCount === notes.length ? (
            <p className="text-center text-slate-800 text-md py-4">
              더이상 조회된 Note가 없습니다.
            </p>
          ) : (
            <button
              onClick={moreNote}
              className="text-center text-slate-800 text-md w-full py-4"
            >
              더 보기
            </button>
          )}
        </div>
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
export default Note;
