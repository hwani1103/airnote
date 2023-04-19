import Layout from "@components/layout";
import type { NextPage } from "next";
import useSWR, { useSWRConfig } from "swr";
import { LoginUser } from "@libs/client/utils";
import { useRouter } from "next/router";
import { Note, Notification, Reply, User } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import Custom404 from "pages/404";
import useUser from "@libs/client/useUser";
import { signOut } from "next-auth/react";
import moment from "moment";
import "moment/locale/ko";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/Io";
import { TbEdit } from "react-icons/tb";
interface UserInfo {
  ok: boolean;
  userInfo: {
    nickname: string;
    age: string;
    occupation: string;
    createdAt: Date;
    gender: string;
    profileSet: boolean;
    _count: {
      replies: number;
      notifications: number;
      notes: number;
    };
  };
}

interface UpdateForm {
  nickname: string;
  age: string;
  gender: string;
  occupation: string;
}

interface UpdateResponse {
  ok: boolean;
}

const Home: NextPage = () => {
  const { user, isLoading: loginCheck } = useUser();
  const router = useRouter();
  const { data: loginUser } = useSWR<LoginUser>(`/api/users/me`);
  const {
    data,
    isLoading,
    mutate: updateMutate,
  } = useSWR<UserInfo>(
    router.query.id ? `/api/users/profile/${router.query.id}` : ""
  );

  const { mutate: unboundMutate } = useSWRConfig();

  const [mutate, { loading, data: updateProfile }] =
    useMutation<UpdateResponse>(`/api/users/profile/${router.query.id}/update`);

  const { register, handleSubmit, reset } = useForm<UpdateForm>();
  const onValid = async (form: UpdateForm) => {
    if (loading) return;
    await mutate(form);
  };

  useEffect(() => {
    if (updateProfile && updateProfile.ok) {
      updateMutate();
      unboundMutate("/api/users/me");
      setModal(false);
    }
  }, [updateProfile]);

  const logOut = async () => {
    await signOut({ callbackUrl: "/enter" });
    router.push("/note");
    await fetch(`/api/users/logout`, { method: "GET" });
  };

  const [notes, setNotes] = useState<Note[]>([]);
  const [noteSkip, setNoteSkip] = useState(0);
  const [noteFetch, setNoteFetch] = useState(false);
  const fetchNotes = async (skip: number) => {
    const response = await fetch(
      `/api/note/notelist?id=${router.query.id}&skip=${skip}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (data && data?.noteList?.length > 0) {
      setNotes(data.noteList);
    }
    setNoteFetch(true);
  };

  useEffect(() => {
    if (noteFetch) {
      fetchNotes(noteSkip);
    }
  }, [noteSkip]);

  const [replies, setReplies] = useState<Reply[]>([]);
  const [replySkip, setReplySkip] = useState(0);
  const [replyFetch, setReplyFetch] = useState(false);
  const fetchReplies = async (skip: number) => {
    const response = await fetch(
      `/api/note/replylist?id=${router.query.id}&skip=${skip}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (data && data?.replyList?.length > 0) {
      setReplies(data.replyList);
    }
    setReplyFetch(true);
  };
  useEffect(() => {
    if (replyFetch) {
      fetchReplies(replySkip);
    }
  }, [replySkip]);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationSkip, setNotificationSkip] = useState(0);
  const [notificationFetch, setNotificationFetch] = useState(false);
  const fetchNotifications = async (skip: number) => {
    const response = await fetch(
      `/api/note/notificationlist?id=${router.query.id}&skip=${skip}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (data && data?.notificationList?.length > 0) {
      setNotifications(data.notificationList);
    }
    setNotificationFetch(true);
  };
  useEffect(() => {
    if (notificationFetch) {
      fetchNotifications(notificationSkip);
    }
  }, [notificationSkip]);
  const [modal, setModal] = useState(false);

  const openModal = () => {
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
  };

  if (user) {
    if (!data) {
      return <div>Loading...</div>;
    } else if (!data.ok) {
      return <Custom404 />;
    }

    return (
      //공개프로필부터만들자.
      <Layout seoTitle={"Profile"}>
        <div className="pt-16 lg:pt-24 " />
        <div className="grid grid-cols-2 gap-4 max-w-[1240px] mx-auto box-content">
          <div className="h-64 col-span-2 flex-col border bg-gradient-to-br from-blue-300 to-red-200 border-slate-700 rounded-lg w-[95%] mx-auto flex justify-center items-center relative overflow-hidden">
            <p className="text-xl lg:text-2xl text-slate-700 font-bold p-4">
              오늘도 즐거운 하루 보내세요! 😀
            </p>
            <p className="shadow-sm text-slate-800 text-lg lg:text-xl">
              {data?.userInfo.nickname} 님의 프로필입니다.
            </p>
            {router.query.id == loginUser?.profile.id ? (
              <>
                {data?.userInfo.profileSet ? (
                  <p className="text-slate-500 text-sm pointer-events-none">
                    기본 프로필 설정 완료
                  </p>
                ) : (
                  <div
                    onClick={openModal}
                    className="flex items-center mt-4 space-x-2 cursor-pointer group lg:text-lg"
                  >
                    <p className="text-slate-500">프로필 설정하기</p>
                    <TbEdit className="text-slate-500 group-hover:text-2xl group-hover:text-indigo-500 ease-in-out duration-100 " />
                  </div>
                )}

                <div
                  onClick={logOut}
                  className="absolute cursor-pointer mx-auto top-[-3.5%] right-[-2.5%] lg:right-[-1%] bg-red-400 px-4 p-3 pb-2 pl-2 text-white flex items-start justify-start rounded-xl
                hover:border-2 hover:border-slate-500
                "
                >
                  <p>로그아웃</p>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
          <div className="h-64 w-[95%] lg:w-[90%] col-span-2 lg:col-span-1 mx-auto border-slate-700 border flex rounded-lg ">
            <div className=" w-[40%] p-4 flex flex-col justify-around items-center border-r border-slate-800 border-dashed">
              <p className="text-slate-800 bg-indigo-100 p-1 px-4 m-1 rounded-full relative overflow-hidden">
                나이
                <div className="absolute bg-indigo-500 w-4 h-8 top-0 right-[-15%] rounded-full"></div>
              </p>
              <p className="text-slate-800 bg-indigo-100 p-1 px-4 m-1 rounded-full relative overflow-hidden">
                성별
                <div className="absolute bg-indigo-500 w-4 h-8 top-0 right-[-15%] rounded-full"></div>
              </p>
              <p className="text-slate-800 bg-indigo-100 p-1 px-4 m-1 rounded-full relative overflow-hidden">
                직업
                <div className="absolute bg-indigo-500 w-4 h-8 top-0 right-[-15%] rounded-full"></div>
              </p>
              <p className="text-slate-800 bg-indigo-100 p-1 px-4 m-1 rounded-full relative overflow-hidden">
                가입일
                <div className="absolute bg-indigo-500 w-4 h-8 top-0 right-[-11%] rounded-full"></div>
              </p>
            </div>
            <div className=" w-[60%] p-4 flex flex-col justify-around items-center">
              <p className="text-slate-800 font-semibold">
                {data?.userInfo?.age ? data?.userInfo?.age : "미입력"}
              </p>
              <p className="text-slate-800 font-semibold">
                {data?.userInfo?.gender ? data?.userInfo?.gender : "미입력"}
              </p>
              <p className="text-slate-800 font-semibold">
                {data?.userInfo?.occupation
                  ? data?.userInfo?.occupation
                  : "미입력"}
              </p>
              <p className="text-slate-800 font-semibold">
                {moment(data?.userInfo?.createdAt).format("YYYY년 MM월 DD일")}
              </p>
            </div>
          </div>

          {router.query.id == loginUser?.profile.id ? (
            <div className="h-64 lg:w-[90%] rounded-lg overflow-auto border lg:col-span-1 border-slate-700 w-[95%] col-span-2 mx-auto ">
              <div className="border-b border-slate-700 overflow-auto">
                {data?.userInfo._count.notifications > 0 ? (
                  <>
                    <p className="float-left px-2 rounded-br-lg bg-rose-200">
                      알림
                    </p>
                    <p className="text-center">
                      총 {data?.userInfo._count.notifications}개의 알림이
                      있어요.{" "}
                      <span
                        onClick={() => {
                          fetchNotifications(notificationSkip);
                        }}
                        className="text-red-400 cursor-pointer hover:text-red-800"
                      >
                        확인하기
                      </span>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="float-left px-2 rounded-br-lg bg-rose-200">
                      알림
                    </p>
                    <p className="text-center">읽지 않은 알림이 없습니다.</p>
                  </>
                )}
              </div>
              <div className="p-2 m-2 px-6 ">
                <div className="space-y-2 divide-y divide-slate-500 p-2 ">
                  {notifications.length > 0
                    ? notifications.map((notification, i) => {
                        if (i < 5)
                          return (
                            <>
                              <Link
                                href={`/note/${notification.noteId}/reply/${notification.replyId}`}
                              >
                                <div
                                  className="font-medium hover:text-indigo-500"
                                  key={notification.id}
                                >
                                  {notification.message}
                                </div>
                              </Link>
                            </>
                          );
                      })
                    : ""}
                </div>

                {notificationFetch ? (
                  <div className="flex justify-around items-center m-2">
                    <IoIosArrowBack
                      onClick={async () => {
                        await setNotificationSkip((prev) => {
                          return Math.max(prev - 5, 0);
                        });
                      }}
                      className="text-xl cursor-pointer"
                    />
                    <IoIosArrowForward
                      onClick={async () => {
                        await setNotificationSkip((prev) => {
                          return prev + 5;
                        });
                      }}
                      className="text-xl cursor-pointer"
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="h-64 lg:w-[90%] rounded-lg border lg:col-span-1 border-slate-700 w-[95%] col-span-2 mx-auto overflow-hidden">
            <div className="border-b border-slate-700 overflow-auto">
              {data?.userInfo._count.notes > 0 ? (
                <>
                  <p className="float-left px-2 rounded-br-lg bg-green-300">
                    노트
                  </p>
                  <p className="text-center">
                    총 {data?.userInfo._count.notes}개의 노트를 작성하셨어요.{" "}
                    <span
                      onClick={() => {
                        fetchNotes(noteSkip);
                      }}
                      className="text-red-400 cursor-pointer hover:text-red-800"
                    >
                      확인하기
                    </span>
                  </p>
                </>
              ) : (
                <>
                  <p className="float-left px-2 rounded-br-lg bg-green-300">
                    노트
                  </p>
                  <p className="text-center">작성 내역이 없습니다.</p>
                </>
              )}
            </div>
            <div className="p-2 m-2 px-6">
              <div className="space-y-2 divide-y divide-slate-500 p-2">
                {notes.length > 0
                  ? notes.map((note, i) => {
                      if (i < 5)
                        return (
                          <p
                            className="font-medium hover:text-indigo-500 cursor-pointer"
                            key={note.id}
                          >
                            <Link href={`/note/${note.id}`}>{note.title}</Link>
                          </p>
                        );
                    })
                  : ""}
              </div>
              {noteFetch ? (
                <div className="flex justify-around items-center m-2">
                  <IoIosArrowBack
                    onClick={async () => {
                      await setNoteSkip((prev) => {
                        return Math.max(prev - 5, 0);
                      });
                    }}
                    className="text-xl cursor-pointer"
                  />
                  <IoIosArrowForward
                    onClick={async () => {
                      await setNoteSkip((prev) => {
                        return prev + 5;
                      });
                    }}
                    className="text-xl cursor-pointer"
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="h-64 lg:w-[90%] rounded-lg border lg:col-span-1 border-slate-700 w-[95%] col-span-2 mx-auto overflow-hidden">
            <div className="border-b border-slate-700 overflow-auto">
              {data?.userInfo._count.replies > 0 ? (
                <>
                  <p className="float-left px-2 rounded-br-lg bg-sky-300">
                    답글
                  </p>
                  <p className="text-center">
                    총 {data?.userInfo._count.replies}개의 답글을 작성하셨어요.{" "}
                    <span
                      onClick={() => {
                        fetchReplies(replySkip);
                      }}
                      className="text-red-400 cursor-pointer hover:text-red-800"
                    >
                      확인하기
                    </span>
                  </p>
                </>
              ) : (
                <>
                  <p className="float-left px-2 rounded-br-lg bg-sky-300">
                    답글
                  </p>
                  <p className="text-center">작성 내역이 없습니다.</p>
                </>
              )}
            </div>
            <div className="p-2 m-2 px-6">
              <div className="space-y-2 divide-y divide-slate-500 p-2">
                {replies.length > 0
                  ? replies.map((reply, i) => {
                      if (i < 5)
                        return (
                          <p
                            className="font-medium hover:text-indigo-500 cursor-pointer"
                            key={reply.id}
                          >
                            <Link
                              href={`/note/${reply.noteId}/reply/${reply.id}`}
                            >
                              {reply.reply}
                            </Link>
                          </p>
                        );
                    })
                  : ""}
              </div>

              {replyFetch ? (
                <div className="flex justify-around items-center m-2">
                  <IoIosArrowBack
                    onClick={async () => {
                      await setReplySkip((prev) => {
                        return Math.max(prev - 5, 0);
                      });
                    }}
                    className="text-xl cursor-pointer"
                  />
                  <IoIosArrowForward
                    onClick={async () => {
                      await setReplySkip((prev) => {
                        return prev + 5;
                      });
                    }}
                    className="text-xl cursor-pointer"
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        {modal ? (
          <div
            onClick={closeModal}
            className="fixed z-20 top-0 bottom-0 left-0 right-0 h-screen flex justify-center items-center bg-gray-400/70 "
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="w-[80%] lg:w-[50%] h-[75%] bg-white border-2 border-slate-700 rounded-lg p-4 space-y-4"
            >
              <p className="text-center text-xl text-slate-700 lg:text-2xl ">
                프로필 설정
              </p>
              <form onSubmit={handleSubmit(onValid)} className="p-2 w-full">
                <p className="text-sm p-2 pointer-events-none bg-rose-400 rounded-xl text-white font-medium text-center lg:text-lg border-2 border-red-700 mb-6">
                  모든 회원정보는 최초 1회만 설정 가능합니다.{" "}
                </p>
                <div className="space-y-4">
                  <label
                    htmlFor="nickname"
                    className="text-lg block font-medium shadow-sm text-slate-700 bg-slate-200 px-2 py-1 rounded-2xl text-start border-b-2 border-slate-700"
                  >
                    닉네임 :
                    <input
                      {...register("nickname", {
                        required: true,
                      })}
                      placeholder="8자 이하로 입력해주세요."
                      id="nickname"
                      type="text"
                      className="appearance-none focus:bg-slate-600 focus:text-white rounded-lg focus:translate-x-1 border-b border-red-500 outline-none border-none focus:border-none focus:ring-0 bg-transparent"
                    />
                  </label>
                  <label
                    htmlFor="age"
                    className="text-lg block font-medium shadow-sm text-slate-700 bg-slate-200 px-2 py-1 rounded-2xl text-start border-b-2 border-slate-700 "
                  >
                    나이 :
                    <input
                      {...register("age", {
                        required: true,
                      })}
                      placeholder="나이를 숫자만 입력해주세요."
                      id="age"
                      type="text"
                      className="appearance-none focus:bg-slate-600 focus:text-white rounded-lg focus:translate-x-1 border-b border-red-500 outline-none border-none focus:border-none focus:ring-0 bg-transparent"
                    />
                  </label>
                </div>
                <div className="p-4 my-4 flex space-y-1 justify-center flex-col items-center">
                  <label className="p-1 border border-slate-500 rounded-lg text-slate-700 bg-slate-100 font-semibold">
                    성별 :
                    <select
                      {...register("gender", {
                        required: true,
                      })}
                      name="gender"
                      className="border-none rounded-xl focus:bg-slate-600 focus:border-none ring-0 focus:text-white text-slate-700 font-medium bg-transparent"
                    >
                      <option value="man" className="">
                        남자
                      </option>
                      <option value="woman">여자</option>
                    </select>
                  </label>
                  <br />
                  <label className="p-1 border border-slate-500 rounded-lg text-slate-700 bg-slate-100 font-semibold">
                    직업 :
                    <select
                      {...register("occupation", {
                        required: true,
                      })}
                      name="occupation"
                      className="border-none rounded-xl focus:bg-slate-600 focus:border-none ring-0 focus:text-white text-slate-700 font-medium bg-transparent overflow-auto  "
                    >
                      <option value="elementary">초등학생</option>
                      <option value="middle">중학생</option>
                      <option value="high">고등학생</option>
                      <option value="officer">직장인</option>
                      <option value="soldier">군인</option>
                      <option value="unemployed">취준생</option>
                      <option value="entreprenuer">사업자</option>
                      <option value="professional">전문직</option>
                      <option value="resting">쉬는중</option>
                    </select>
                  </label>
                </div>
                <button
                  className="w-full hover:text-indigo-800 ease-in-out duration-300 active:translate-x-1 hover:bg-indigo-200 text-white bg-indigo-400 mx-auto p-2 rounded-xl ring-2 ring-offset-2  text-xl ring-indigo-400 shadow-lg"
                  type="submit"
                >
                  전송
                </button>
              </form>
            </div>
            <button
              onClick={closeModal}
              className="fixed top-24 right-[12%] lg:right-[26%] lg:p-3 lg:text-sm
          p-2 bg-rose-500 rounded-xl text-black text-sm border-rose-200 border-2 
          hover:bg-rose-800 hover:text-white active:translate-x-1 ease-in duration-300
          "
              type="button"
            >
              닫기
            </button>
          </div>
        ) : (
          ""
        )}

        <div className="pt-16 lg:pt-24 " />
      </Layout>
    );
  } else return <div></div>;
};
export default Home;
{
  /* <p>{data?.userInfo._count.replies}개의 답글을 작성하셨습니다. 공개</p>
<p>{data?.userInfo._count.notifications}개의 알림이 있습니다. 비공개</p>
<p>{data?.userInfo._count.notes}개의 노트를 작성하셨습니다. 공개</p> */
}
{
  /*프로필 페이지 기능
컴포넌트로 나눠보자
1. XX님의 프로필입니다.

2. 간단 프로필. 나이, 직업, 성별 

3. 활동내역. 작성한 Note, 작성한 Reply

*/
}
// <div>
//           <p className="px-4">프로필 페이지</p>
//           <div className="flex">
//             <div className="space-y-1 p-4 flex flex-col w-[50%] bg-red-300">
//               {router.query.id == loginUser?.profile.id ? (
//                 <div>
//                   <p className="text-sm p-2 border-b-2 border-indigo-700 flex justify-between">
//                     닉네임 : {data?.userInfo.nickname}{" "}
//                     <button
//                       onClick={nicknameUpdate}
//                       className="inline-block align-middle "
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth="1.5"
//                         stroke="currentColor"
//                         className="w-6 h-6"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
//                         />
//                       </svg>
//                     </button>
//                   </p>
//                 </div>
//               ) : (
//                 <div>
//                   <p className="text-sm p-2 border-b-2 border-indigo-700 flex justify-between">
//                     닉네임 : {data?.userInfo.nickname}{" "}
//                   </p>
//                 </div>
//               )}
//               <p className="text-sm p-2 border-b-2 border-indigo-700 ">
//                 나이 : {data?.userInfo.age}
//               </p>
//               <p className="text-sm p-2 border-b-2 border-indigo-700 ">
//                 직업 : {data?.userInfo.occupation}
//               </p>
//               <p className="text-sm p-2 border-b-2 border-indigo-700 ">
//                 성별 : {data?.userInfo.gender}
//               </p>
//               <p className="text-sm p-2 border-b-2 border-indigo-700 ">
//                 가입일 :{" "}
//                 {data?.userInfo.createdAt &&
//                   new Date(data.userInfo.createdAt).toLocaleDateString(
//                     "ko-KR",
//                     {
//                       year: "numeric",
//                       month: "long",
//                       day: "numeric",
//                     }
//                   )}
//               </p>
//             </div>
//             <div className="w-full space-y-1 p-4">
//               {nicknameUpdateFlag ? (
//                 <form onSubmit={handleSubmit(onValid)}>
//                   <p className="text-sm border-b-2 border-indigo-700 flex items-center">
//                     <input
//                       {...register("nickname", {
//                         required: true,
//                       })}
//                       className="pl-4 pr-16 text-xl w-full bg-slate-800 text-white appearance-none select-none"
//                       type="text"
//                       placeholder={data?.userInfo.nickname}
//                     />
//                     <button className="bg-white rounded-full fixed right-12 ">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth={1.5}
//                         stroke="currentColor"
//                         className="w-7 h-7"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                     </button>
//                   </p>
//                 </form>
//               ) : (
//                 ""
//               )}
//               {router.query.id == loginUser?.profile.id ? (
//                 <div>
//                   <p className="px-4 bg-indigo-500 text-white">
//                     총 {data?.userInfo.notifications.length}개의 알림이
//                     있습니다.
//                   </p>
//                   <div className="p-2 space-y-2 m-2">
//                     {data?.userInfo.notifications.map((notification) => (
//                       <div className="bg-red-200 p-1 rounded-2xl">
//                         <Link
//                           href={`/note/${notification.reply.noteId}/reply/${notification.reply.id}`}
//                           key={notification.reply.id}
//                         >
//                           {notification.message}
//                         </Link>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 ""
//               )}
//             </div>
//           </div>
//           <div className="cursor-pointer p-4 bg-yellow-200" onClick={logOut}>
//             로그아웃하기
//           </div>
//           <div className="space-y-2 px-4 flex flex-col">
//             <p>그동안 올린 고민들</p>
//             {data?.userInfo.notes.map((note) => (
//               <Link
//                 key={note.id}
//                 href={`/note/${note.id}`}
//                 className="text-sm shadow-sm border border-green-400 p-2 text-slate-800 rounded-lg "
//               >
//                 {note.title}
//               </Link>
//             ))}
//           </div>
//         </div>
