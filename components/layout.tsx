import { User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import type { LoginUser } from "@libs/client/utils";
import { signOut } from "next-auth/react";
import Head from "next/head";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

interface LayoutProps {
  children: React.ReactNode;
  seoTitle: string;
}

export default function Layout({ children, seoTitle }: LayoutProps) {
  // const { data, isLoading, mutate } = useSWR<LoginUser>("/api/users/me");
  const router = useRouter();

  // const logOut = async () => {
  //   await signOut({ callbackUrl: "/enter" });
  //   router.push("/note");
  //   await fetch(`/api/users/logout`, { method: "GET" });
  // };

  // useEffect(() => {
  //   mutate();
  // }, [router]);
  //front 로직 시작

  const [nav, setNav] = useState(false);
  const [color, setColor] = useState("white");
  const [textColor, setTextColor] = useState("#222831");
  const handleNav = () => {
    setNav(!nav);
  };

  useEffect(() => {
    const changeColor = () => {
      if (window.scrollY >= 60) {
        setColor("#222831");
        setTextColor("white");
      } else {
        setColor("white");
        setTextColor("#222831");
      }
    };
    window.addEventListener("scroll", changeColor);
  }, []);

  const homeClick = async () => {
    if (router.pathname == "/") {
      setNav(!nav);
    } else {
      await router.push("/");
      setNav(!nav);
    }
  };

  const confirmUser = async () => {
    if (router.pathname == "/enter" && nav) {
      setNav(!nav);
    }
    const response = await fetch("/api/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const loginUser: LoginUser = await response.json();
    if (loginUser && !loginUser.ok) {
      router.push("/enter");
    } else {
      router.push(`/profile/${loginUser.profile.id}`);
    }
  };

  return (
    <div className="mt-16 lg:mt-24">
      <Head>
        <title>{seoTitle} | Airnote</title>
      </Head>
      <div className="">
        {/* {isLoading ? (
          <div>Loading...</div>
        ) : ( */}
        <div
          style={{ backgroundColor: `${color}` }}
          className="fixed left-0 top-0 w-full z-10 ease-in duration-300"
        >
          <div className="max-w-[1240px] m-auto flex justify-between items-center text-white p-2">
            <Link href="/">
              <p
                style={{ color: `${textColor}` }}
                className="font-bold text-2xl"
              >
                Airnote
              </p>
            </Link>
            <ul className="hidden lg:flex">
              <li className="p-4">
                <Link href="/">
                  <p style={{ color: `${textColor}` }}>Home</p>
                </Link>
              </li>
              <li className="p-4">
                <Link href="/">
                  <p style={{ color: `${textColor}` }}>About</p>
                </Link>
              </li>
              <li className="p-4">
                <Link href="/">
                  <p style={{ color: `${textColor}` }}>Notes</p>
                </Link>
              </li>
              <li className="p-4">
                <p
                  onClick={confirmUser}
                  className="cursor-pointer"
                  style={{ color: `${textColor}` }}
                >
                  Account
                </p>
              </li>
            </ul>

            {/* Mobile Button */}
            <div
              onClick={handleNav}
              className="block lg:hidden z-10 cursor-pointer"
            >
              {nav ? (
                <AiOutlineClose size={20} style={{ color: "#eeeeee" }} />
              ) : (
                <AiOutlineMenu size={20} style={{ color: `${textColor}` }} />
              )}
            </div>

            {/* Mobile Menu */}
            <div
              className={
                nav
                  ? "lg:hidden absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center w-full h-screen bg-[#222831] text-center ease-in duration-300"
                  : "lg:hidden absolute top-0 left-[-100%] right-0 bottom-0 flex justify-center items-center w-full h-screen bg-[#222831] text-center ease-in duration-300"
              }
            >
              <ul>
                <li className="p-4 text-4xl hover:text-gray-500">
                  <button onClick={homeClick}>
                    <p>Home</p>
                  </button>
                </li>
                <li className="p-4 text-4xl hover:text-gray-500">
                  <Link href="/">
                    <p>About</p>
                  </Link>
                </li>
                <li className="p-4 text-4xl hover:text-gray-500">
                  <Link href="/">
                    <p>Notes</p>
                  </Link>
                </li>
                <li className="p-4 text-4xl hover:text-gray-500">
                  <button type="button" onClick={confirmUser}>
                    <p>Account</p>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* )} */}
      </div>
      <div className="">{children}</div>

      <div className="bg-[#222831] text-[#eeeeee] p-2 mt-12 relative bottom-0 left-0 right-0">
        <p className="font-bold text-lg text-center">©Airnote</p>
        <p className="font-bold text-sm">
          오시는 길 : 서울시 양념구 치킨로 2마리 정말맛있길
        </p>
        <p className="font-bold text-sm">사업자 : Gogos</p>
      </div>
    </div>
  );
}

{
  /* 
1. Layout에서 로그인 회원 정보에 대해 어떻게 제공할 것인가?
로그인/ 로그아웃, 프로필 등 회원정보, 상태에 관한 모든건 Account버튼이 해결

Account버튼을 클릭하면 ?
users/me로 요청을 보내서, 에러면 enter로 redirect
있으면, 그 id profile로 이동.

그 외에, 로그인되기전에 어떤 권한있는 행위를 하려고 하면 enter로 redirect.
*/
}

{
  /* <Link
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
              <Link
                className="p-2 text-xl bg-indigo-200 rounded-lg border-2 border-sky-500"
                href={`/profile/${data?.profile?.id}`}
              >
                Profile
              </Link> */
}

// {data?.ok ? (
//   <div className="flex flex-col">
//     <div className="flex items-center space-x-8">
//       <p className="text-2xl">로그인 성공.</p>
//     </div>
//     <p>{data?.profile?.nickname} 님 어서오세요.</p>
//   </div>
// ) : (
//   <p> 로그인을 해주세요. </p>
// )}
