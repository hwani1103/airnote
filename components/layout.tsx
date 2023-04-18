import { User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import type { LoginUser } from "@libs/client/utils";
import { signOut } from "next-auth/react";
import Head from "next/head";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import Image from "next/image";

interface LayoutProps {
  children: React.ReactNode;
  seoTitle: string;
}

export default function Layout({ children, seoTitle }: LayoutProps) {
  const router = useRouter();

  const [nav, setNav] = useState(false);
  const [color, setColor] = useState("transparent");
  const [textColor, setTextColor] = useState("#222831");
  const handleNav = () => {
    setNav(!nav);
  };

  useEffect(() => {
    const changeColor = () => {
      if (window.scrollY >= 50) {
        setColor("#222831");
        setTextColor("white");
      } else {
        setColor("transparent");
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
  const aboutClick = async () => {
    if (router.pathname == "/about") {
      setNav(!nav);
    } else {
      await router.push("/about");
      setNav(!nav);
    }
  };
  const notesClick = async () => {
    if (router.pathname == "/note") {
      setNav(!nav);
    } else {
      await router.push("/note");
      setNav(!nav);
    }
  };

  const confirmUser = async () => {
    if (
      (router.pathname == "/enter" && nav) ||
      router.pathname == "/profile/[id]"
    ) {
      setNav(!nav);
    }
    const response = await fetch("/api/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const loginUser: LoginUser = await response.json();
    if ((loginUser && !loginUser.ok) || loginUser.profile == null) {
      router.push("/enter");
    } else {
      router.push(`/profile/${loginUser.profile.id}`);
    }
  };

  return (
    <div className="relative">
      <Head>
        <title>{seoTitle} | Airnote</title>
      </Head>
      <div className="">
        {/* {isLoading ? (
          <div>Loading...</div>
        ) : ( */}
        <div
          style={{ backgroundColor: `${color}` }}
          className="fixed left-0 top-0 w-full z-10 ease-in duration-200"
        >
          <div className="max-w-[1240px] m-auto flex justify-between items-center text-white px-4 py-1">
            <Link href="/">
              <Image
                style={{ color: `${textColor}` }}
                src={
                  "https://imagedelivery.net/cuArFA48MvcYiHZ6Ed4L4Q/2443a15c-0131-4ae0-f023-d5d6b3165500/sixteenandnine"
                }
                alt=""
                width={124}
                height={69}
                className="rounded-xl 
                font-bold text-2xl hover:translate-x-1 ease-in-out duration-300"
              ></Image>
            </Link>
            <ul className="hidden lg:flex">
              <li className="p-4 ">
                <Link href="/">
                  <p
                    className="ease-in-out duration-300 hover:ring p-1 hover:ring-green-500 hover:rounded-lg
                    active:translate-x-2 "
                    style={{ color: `${textColor}` }}
                  >
                    Home
                  </p>
                </Link>
              </li>
              <li className="p-4">
                <Link href="/about">
                  <p
                    className="ease-in-out duration-300 hover:ring p-1 hover:ring-green-500 hover:rounded-lg
                    active:translate-x-2"
                    style={{ color: `${textColor}` }}
                  >
                    About
                  </p>
                </Link>
              </li>
              <li className="p-4">
                <Link href="/note">
                  <p
                    className="ease-in-out duration-300 hover:ring p-1 hover:ring-green-500 hover:rounded-lg
                    active:translate-x-2"
                    style={{ color: `${textColor}` }}
                  >
                    Notes
                  </p>
                </Link>
              </li>
              <li className="p-4">
                <p
                  className="ease-in-out duration-300 hover:ring p-1 hover:ring-green-500 hover:rounded-lg
                    active:translate-x-2 cursor-pointer"
                  onClick={confirmUser}
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
                  <button onClick={aboutClick}>
                    <p>About</p>
                  </button>
                </li>
                <li className="p-4 text-4xl hover:text-gray-500">
                  <button onClick={notesClick}>
                    <p>Notes</p>
                  </button>
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
    </div>
  );
}
