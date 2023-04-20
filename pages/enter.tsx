import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@components/layout";
import { signIn, signOut, useSession } from "next-auth/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Image from "next/image";

interface EnterForm {
  email: string;
}

interface TokenForm {
  token: string;
}

interface mutateResult {
  ok: boolean;
}

const Enter: NextPage = () => {
  const router = useRouter();

  const [enterMutate, { loading: enterLoading, data: enterData }] =
    useMutation<mutateResult>("/api/users/enter");
  const [tokenMutate, { loading: tokenLoading, data: tokenData }] =
    useMutation<mutateResult>("/api/users/confirm");

  const {
    register: enterRegister,
    handleSubmit: enterSubmit,
    reset,
    watch,
  } = useForm<EnterForm>();
  const { register: tokenRegister, handleSubmit: tokenSubmit } =
    useForm<TokenForm>();

  const [email, setEmail] = useState("");

  const emailValid = (email: EnterForm) => {
    if (enterLoading) return;
    enterMutate(email);
    setEmail(watch().email.split("@")[1]);
  };
  useEffect(() => {
    reset();
  }, [enterData]);

  const tokenValid = (token: TokenForm) => {
    if (tokenLoading) return;
    tokenMutate(token);
  };
  useEffect(() => {
    if (tokenData && tokenData.ok) {
      router.push("/");
    }
  }, [tokenData]);

  //UI로직
  const [inputState, setInputState] = useState(false);
  const handleInput = () => {
    document.getElementById("email")?.focus();
    setWidth("90%");
    setInputState(!inputState);
  };

  const [isSigningIn, setIsSigningIn] = useState(false);

  const [width, setWidth] = useState("30%");
  return (
    <Layout seoTitle={"Enter Page"}>
      <div className="pt-16 lg:pt-24" />
      <div className="relative top-0 max-w-[1240px] mx-auto">
        <video autoPlay loop muted>
          <source src="skyvideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="lg:pt-16 absolute top-0 left-0 w-full flex flex-col items-center justify-center ">
          <p className="text-white text-xl mt-4 font-bold lg:text-3xl">
            {" "}
            Airnote Login{" "}
          </p>

          <div
            className={`w-[${width}] ease-in-out duration-300 mx-auto border-2 border-slate-700 opacity-95 backdrop-blur-sm rounded-xl m-2 p-4 flex items-start justify-center flex-col
          
          `}
          >
            {enterData && enterData.ok ? (
              <div className="space-y-1 w-full z-20">
                <div onClick={handleInput} className="mb-2">
                  <p className="text-black lg:text-center lg:text-xl lg:p-2 lg:my-2 ">
                    <span className="p-1 border-b-2 text-lg border-orange-400 m-1">
                      {email}
                    </span>{" "}
                    계정으로 인증 토큰 발송.
                  </p>
                  <p className="text-black lg:text-center lg:text-xl lg:p-2 lg:my-2 my-1">
                    확인 후 토큰을 입력해주세요.
                  </p>
                </div>

                <form
                  onSubmit={tokenSubmit(tokenValid)}
                  className="flex flex-col items-center"
                >
                  <input
                    type="text"
                    id="token"
                    className="lg:p-4 lg:text-lg border w-full lg:w-[70%] border-white p-2 rounded-lg appearance-none text-slate-800 px-4 focus:border-indigo-700 focus:border-2 ease-in duration-300"
                    {...tokenRegister("token", {
                      required: true,
                    })}
                  ></input>

                  <br />
                  <button className="border-2 hover:border-slate-500 hover:ring-1 hover:ring-offset-1 hover:ring-slate-900 text-lg border-slate-700 text-slate-700 bg-sky-100 p-1 mt-2 w-full lg:w-[70%]  rounded-lg ease-in duration-750">
                    {tokenLoading ? (
                      <div className="flex justify-center items-center">
                        <AiOutlineLoading3Quarters className="animate-spin mx-2 text-indigo-700 ring-1 ring-white rounded-full border-none " />
                      </div>
                    ) : (
                      "인증"
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-1 w-full mx-auto z-20">
                <div onClick={handleInput} className="cursor-pointer">
                  {inputState ? (
                    <p className="text-black lg:text-center ease-in-out duration-200 lg:-translate-y-4 -translate-y-2 lg:text-xl lg:p-2 lg:my-2">
                      이메일을 입력해주세요.
                    </p>
                  ) : (
                    <p className="text-black lg:text-center ease-in-out duration-300 lg:text-xl lg:p-2 lg:my-2">
                      로그인을 진행해주세요.{" "}
                      <span className="text-sm font-bold text-black animate-bounce inline-block">
                        Click!!
                      </span>
                    </p>
                  )}
                </div>
                <form onSubmit={enterSubmit(emailValid)}>
                  {inputState ? (
                    <div className="lg:flex lg:flex-col lg:items-center">
                      <input
                        type="email"
                        id="email"
                        placeholder="airnote@gmail.com"
                        className="lg:p-4 lg:text-lg border w-full lg:w-[70%] text-slate-800 border-white p-2 px-4 rounded-lg appearance-none font-bold focus:border-indigo-700 focus:border-2 ease-in duration-300"
                        {...enterRegister("email", {
                          required: true,
                        })}
                      ></input>
                      <br />
                      <button className="border-2 hover:border-slate-500 hover:ring-1 hover:ring-offset-1 hover:ring-slate-900 text-lg border-slate-700 text-slate-700 bg-sky-100 p-1 mt-2 w-full lg:w-[70%]  rounded-lg ease-in duration-750">
                        {enterLoading ? (
                          <div className="flex justify-center items-center">
                            <AiOutlineLoading3Quarters className="animate-spin mx-2 text-indigo-700 ring-1 ring-white rounded-full border-none " />
                          </div>
                        ) : (
                          "전송"
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="lg:flex lg:flex-col lg:items-center">
                      <input
                        type="email"
                        id="email"
                        className="lg:p-4 lg:text-lg border w-1 border-white p-2 rounded-lg appearance-none focus:border-indigo-700 focus:border-2 ease-in duration-300"
                        {...enterRegister("email", {
                          required: true,
                        })}
                      ></input>
                      <br />
                      <button className="border hidden hover:border-indigo-500 hover:ring-1 hover:ring-offset-1 hover:ring-indigo-400 text-lg border-white text-white p-1 mt-2 w-full lg:w-[70%] rounded-lg ease-in duration-300">
                        {enterLoading ? "Loading..." : "전송"}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="flex flex-col justify-center items-center p-8 space-y-6 border-slate-700 mt-16 relative w-full
      lg:absolute lg:bottom-16 lg:p-0 lg:border-none xl:bottom-32
      "
      >
        <p
          className="text-slate-600 font-medium lg:text-black
        "
        >
          또는 SNS 계정으로 로그인하기
        </p>
        <div
          className="flex justify-center items-center p-4 space-x-8 
        lg:bg-white lg:rounded-3xl"
        >
          <button
            disabled={isSigningIn}
            onClick={async () => {
              setIsSigningIn(true);
              await signIn("kakao", { callbackUrl: "/api/user" }).finally(
                () => isSigningIn
              );
            }}
          >
            <div className="hover:scale-105 active:translate-x-1 flex flex-col justify-center items-center space-y-2">
              <Image
                src={
                  "https://imagedelivery.net/cuArFA48MvcYiHZ6Ed4L4Q/791bad1e-6215-43ab-0695-14aea5ccc300/oauthlogo"
                }
                alt=""
                width={120 / 2.4}
                height={120 / 2.4}
                className="rounded-full"
                style={{ opacity: isSigningIn ? 0.5 : 1 }}
              />
              <p style={{ opacity: isSigningIn ? 0.5 : 1 }} className="text-xs">
                카카오 로그인
              </p>
            </div>
          </button>
          <button
            disabled={isSigningIn}
            onClick={async () => {
              setIsSigningIn(true);
              await signIn("naver", { callbackUrl: "/api/user" }).finally(
                () => isSigningIn
              );
            }}
          >
            <div className="hover:scale-105 active:translate-x-1 flex flex-col justify-center items-center space-y-2">
              <Image
                src={
                  "https://imagedelivery.net/cuArFA48MvcYiHZ6Ed4L4Q/bb9ab683-8f2d-4fec-2db5-c6b26cc2a600/oauthlogo"
                }
                alt=""
                width={120 / 2.4}
                height={120 / 2.4}
                className="rounded-full"
                style={{ opacity: isSigningIn ? 0.5 : 1 }}
              />
              <p style={{ opacity: isSigningIn ? 0.5 : 1 }} className="text-xs">
                네이버 로그인
              </p>
            </div>
          </button>
          <button
            disabled={isSigningIn}
            onClick={async () => {
              setIsSigningIn(true);
              await signIn("google", { callbackUrl: "/api/user" }).finally(
                () => isSigningIn
              );
            }}
          >
            <div className="hover:scale-105 active:translate-x-1 flex flex-col justify-center items-center space-y-2">
              <Image
                src={
                  "https://imagedelivery.net/cuArFA48MvcYiHZ6Ed4L4Q/41d93c5b-b33d-4810-1dd4-da7bd89f3c00/oauthlogo"
                }
                alt=""
                width={120 / 2.4}
                height={120 / 2.4}
                className="rounded-full p-1"
                style={{ opacity: isSigningIn ? 0.5 : 1 }}
              />
              <p style={{ opacity: isSigningIn ? 0.5 : 1 }} className="text-xs">
                구글 로그인
              </p>
            </div>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Enter;

// <p className="font-semibold text-xl shadow-lg text-slate-600">
//         로그인하기!
//       </p>
//       <button onClick={() => signIn("kakao", { callbackUrl: "/api/user" })}>
//         <p>카카오톡 로그인하기</p>
//       </button>
//       <br />
//       <button onClick={() => signIn("naver", { callbackUrl: "/api/user" })}>
//         <p>네이버 로그인하기</p>
//       </button>
//       <br />
//       <button onClick={() => signIn("google", { callbackUrl: "/api/user" })}>
//         <p>구글 로그인하기</p>
//       </button>

//       {enterData && enterData.ok ? (
//         <div>
//           <p>토큰을 입력하세요.</p>
//           <form onSubmit={tokenSubmit(tokenValid)}>
//             <input
//               type="text"
//               id="token"
//               className="border-2 border-black p-4 text-xl"
//               {...tokenRegister("token", {
//                 required: true,
//               })}
//             ></input>
//             <br />
//             <button className="p-3 bg-indigo-200 border-2 border-black my-4 rounded-xl">
//               {enterLoading ? "Loading..." : "전송"}
//             </button>
//           </form>
//         </div>
//       ) : (
//         <div>
//           <p>이메일을 입력하세요.</p>
//           <form onSubmit={enterSubmit(emailValid)}>
//             <input
//               type="text"
//               id="email"
//               className="border-2 border-black p-4 text-xl"
//               {...enterRegister("email", {
//                 required: true,
//               })}
//             ></input>
//             <br />
//             <button className="p-3 bg-indigo-200 border-2 border-black my-4 rounded-xl">
//               {enterLoading ? "Loading..." : "전송"}
//             </button>
//           </form>
//         </div>
//       )}
