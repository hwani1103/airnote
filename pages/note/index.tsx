import Layout from "@components/layout";
import NoteDetailModal from "@components/noteDetailModal";
import { User } from "@prisma/client";
import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { cls, LoginUser } from "@libs/client/utils";
import { useRouter } from "next/router";
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

const Note: NextPage = () => {
  const router = useRouter();
  const { data, isLoading } = useSWR<NoteList>("/api/note"); // 처음 노트를 불러오기. 여기 SWR이 두개여야하는지, 나중에리팩토링 ㄱㄱ
  const [skip, setSkip] = useState(2); // pagination.지금 2개씩 가져오게 해뒀음.
  const { data: moreData, mutate } = useSWR<NoteList>(`/api/note?skip=${skip}`);
  const { data: loginUser } = useSWR<LoginUser>("/api/users/me");
  useEffect(() => {
    if (data) {
      setNotes(data.noteList); // data가 변경될때마다 note state변경
    }
  }, [data]);

  const [notes, setNotes] = useState<NoteList["noteList"]>([]); // 새로가져온 note들을 state로 관리하면서 재렌더링해주기 위함. 타입설정이 특이함. NoteList타입 중의 noteList만 타입으로 쓰겠다는 뜻.

  const moreNote = () => {
    // 가져오기 버튼. 이걸 스크롤로 구현하면 더 좋겠지만 아직 어려워서 못했음. 리팩토링 때 고려
    // 그리고 더이상 가져올 게 없으면. 즉 notes의 length와 전체 note의 length가 같으면 더 가져오기 버튼 숨겨버리기.
    // 그리고 지금 setSkip에서 한번씩 버그 생김. setSkip의 값이 계속 누적되면서.. 이 버그를 해결해야함.
    // 버그상황일떄 얘를 2로 다시 바꿔주면 됨. 리스트도 다시 2개로 초기화한다음에..
    setSkip(skip + 2);
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
    <Layout>
      <div className="space-y-4">
        {isLoading ? "노트의 총 개수를 가져오는중 ..." : ""}

        {notes.map((note) => {
          return (
            <div key={note.id}>
              <div
                className={cls(
                  note.user.id === loginUser?.profile.id
                    ? "blcok rounded-lg p-4 bg-indigo-200"
                    : "blcok rounded-lg p-4 bg-yellow-200"
                )}
                // href={`/note/${note.id}`}
              >
                {/* className={cls("block rounded-lg p-4", {note.user.id === loginUser?.profile.id ? "" : ""})} */}

                <div>
                  <div
                    onClick={() => {
                      {
                        console.log(note.user.id);
                        console.log(loginUser?.profile.id);
                        note.user.id === loginUser?.profile.id
                          ? router.push(`/note/${note.id}`)
                          : handleOpenModal(note.id);
                      }
                    }}
                  >
                    <h2>{note.title}</h2>
                    <p>{note.content}</p>
                    <p>{note.createdAt}</p>
                    <p>[ {note.user.nickname} ]</p>
                    <p>답글 === {note._count?.replies} 개 </p>
                    <p>응원 === {note._count?.cheers} 개 </p>
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
        <button onClick={moreNote}>더가져오기</button>
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
