import { User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import type { LoginUser } from "@libs/client/utils";
interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { data, isLoading, mutate } = useSWR<LoginUser>("/api/users/me");
  const router = useRouter();

  const logOut = async () => {
    await fetch(`/api/users/logout`, { method: "GET" });
    router.push("/");
  };

  useEffect(() => {
    mutate();
  }, [router]);

  return (
    <div>
      <div className="p-2 bg-green-200">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <div className="flex space-x-4 p-2">
              <Link
                className="p-2 text-xl bg-indigo-200 rounded-lg border-2 border-sky-500"
                href="/"
              >
                홈
              </Link>
              {data && data.ok ? (
                <button
                  onClick={logOut}
                  className="p-2 text-xl bg-indigo-200 rounded-lg border-2 border-sky-500"
                >
                  {" "}
                  로그아웃{" "}
                </button>
              ) : (
                <Link
                  className="p-2 text-xl bg-indigo-200 rounded-lg border-2 border-sky-500"
                  href="/enter"
                >
                  로그인
                </Link>
              )}

              <Link
                className="p-2 text-xl bg-indigo-200 rounded-lg border-2 border-sky-500"
                href="/note"
              >
                Note
              </Link>
            </div>
            {data?.ok ? (
              <div className="flex flex-col">
                <div className="flex items-center space-x-8">
                  <p className="text-2xl">로그인 성공.</p>
                </div>
                <p>{data?.profile?.nickname} 님 어서오세요.</p>
              </div>
            ) : (
              <div className="flex items-center space-x-8">
                <p> 로그인을 해주세요. </p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mt-4 p-4">{children}</div>
    </div>
  );
}