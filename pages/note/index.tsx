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
  const { data: noteCount } = useSWR<NoteCount>("api/note/notelist");
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
      <p>총 {noteCount?.noteCount} 개의 Note가 있어요.</p>
      <div className="space-y-4">
        {isLoading ? "노트를 가져오는중 ..." : ""}

        {notes.map((note) => {
          return (
            <div key={note.id}>
              <div
                className={cls(
                  note.user.id === loginUser?.profile?.id
                    ? "blcok rounded-lg p-4 bg-indigo-200"
                    : "blcok rounded-lg p-4 bg-yellow-200"
                )}
              >
                <div>
                  <div
                    onClick={() => {
                      {
                        note.user.id === loginUser?.profile?.id
                          ? router.push(`/note/${note.id}`)
                          : handleOpenModal(note.id);
                      }
                    }}
                  >
                    <h2>{note.title}</h2>
                    <p>{note.content}</p>
                    <p>{note.createdAt}</p>
                    <p>[ {note.user.nickname} ]</p>
                  </div>
                </div>
                {isModalOpen && (
                  <NoteDetailModal
                    noteId={noteId}
                    handleFlag={handleCloseModal}
                  />
                )}
              </div>
            </div>
          );
        })}
        {noteCount?.noteCount === notes.length ? (
          "더이상 가져올 Note가 없습니다."
        ) : (
          <button onClick={moreNote}>더가져오기</button>
        )}
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
