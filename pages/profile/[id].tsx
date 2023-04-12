import Layout from "@components/layout";
import type { NextPage } from "next";
import useSWR, { useSWRConfig } from "swr";
import { LoginUser } from "@libs/client/utils";
import { useRouter } from "next/router";
import { User } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import Custom404 from "pages/404";
import useUser from "@libs/client/useUser";
import { signOut } from "next-auth/react";

interface UserInfo {
  ok: boolean;
  userInfo: {
    nickname: string;
    age: number;
    occupation: string;
    createdAt: Date;
    gender: string;
    notes: {
      title: string;
      id: number;
    }[];
    notifications: {
      message: string;
      reply: {
        noteId: number;
        id: number;
      };
    }[];
  };
}

interface UpdateForm {
  nickname: string;
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
    setNicknameUpdateFlag(false);
  };

  useEffect(() => {
    if (updateProfile && updateProfile.ok) {
      updateMutate();
      unboundMutate("/api/users/me");
    }
  }, [updateProfile]);

  const [nicknameUpdateFlag, setNicknameUpdateFlag] = useState(false);
  const nicknameUpdate = () => {
    setNicknameUpdateFlag(!nicknameUpdateFlag);
  };

  const logOut = async () => {
    await signOut({ callbackUrl: "/enter" });
    router.push("/note");
    await fetch(`/api/users/logout`, { method: "GET" });
  };

  if (user) {
    if (!data) {
      return <div>Loading...</div>;
    } else if (!data.ok) {
      return <Custom404 />;
    }
    return (
      <Layout seoTitle={"Profile"}>
        <div>
          <p className="px-4">프로필 페이지</p>
          <div className="flex">
            <div className="space-y-1 p-4 flex flex-col w-[50%] bg-red-300">
              {router.query.id == loginUser?.profile.id ? (
                <div>
                  <p className="text-sm p-2 border-b-2 border-indigo-700 flex justify-between">
                    닉네임 : {data?.userInfo.nickname}{" "}
                    <button
                      onClick={nicknameUpdate}
                      className="inline-block align-middle "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </button>
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm p-2 border-b-2 border-indigo-700 flex justify-between">
                    닉네임 : {data?.userInfo.nickname}{" "}
                  </p>
                </div>
              )}
              <p className="text-sm p-2 border-b-2 border-indigo-700 ">
                나이 : {data?.userInfo.age}
              </p>
              <p className="text-sm p-2 border-b-2 border-indigo-700 ">
                직업 : {data?.userInfo.occupation}
              </p>
              <p className="text-sm p-2 border-b-2 border-indigo-700 ">
                성별 : {data?.userInfo.gender}
              </p>
              <p className="text-sm p-2 border-b-2 border-indigo-700 ">
                가입일 :{" "}
                {data?.userInfo.createdAt &&
                  new Date(data.userInfo.createdAt).toLocaleDateString(
                    "ko-KR",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
              </p>
            </div>
            <div className="w-full space-y-1 p-4">
              {nicknameUpdateFlag ? (
                <form onSubmit={handleSubmit(onValid)}>
                  <p className="text-sm border-b-2 border-indigo-700 flex items-center">
                    <input
                      {...register("nickname", {
                        required: true,
                      })}
                      className="pl-4 pr-16 text-xl w-full bg-slate-800 text-white appearance-none select-none"
                      type="text"
                      placeholder={data?.userInfo.nickname}
                    />
                    <button className="bg-white rounded-full fixed right-12 ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-7 h-7"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </p>
                </form>
              ) : (
                ""
              )}
              {router.query.id == loginUser?.profile.id ? (
                <div>
                  <p className="px-4 bg-indigo-500 text-white">
                    총 {data?.userInfo.notifications.length}개의 알림이
                    있습니다.
                  </p>
                  <div className="p-2 space-y-2 m-2">
                    {data?.userInfo.notifications.map((notification) => (
                      <div className="bg-red-200 p-1 rounded-2xl">
                        <Link
                          href={`/note/${notification.reply.noteId}/reply/${notification.reply.id}`}
                          key={notification.reply.id}
                        >
                          {notification.message}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="cursor-pointer p-4 bg-yellow-200" onClick={logOut}>
            로그아웃하기
          </div>
          <div className="space-y-2 px-4 flex flex-col">
            <p>그동안 올린 고민들</p>
            {data?.userInfo.notes.map((note) => (
              <Link
                key={note.id}
                href={`/note/${note.id}`}
                className="text-sm shadow-sm border border-green-400 p-2 text-slate-800 rounded-lg "
              >
                {note.title}
              </Link>
            ))}
          </div>
        </div>
      </Layout>
    );
  } else return <div></div>;
};
export default Home;
