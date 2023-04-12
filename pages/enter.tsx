import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@components/layout";
import { signIn, signOut, useSession } from "next-auth/react";

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
  } = useForm<EnterForm>();
  const { register: tokenRegister, handleSubmit: tokenSubmit } =
    useForm<TokenForm>();

  const emailValid = (email: EnterForm) => {
    if (enterLoading) return;
    enterMutate(email);
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
    setInputState(!inputState);
  };

  return (
    <Layout seoTitle={"Enter Page"}>
      <div className="relative top-0 max-w-[1240px] mx-auto">
        <video autoPlay loop muted>
          <source src="skyvideo3.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-0 left-0 w-full flex flex-col items-center justify-center">
          <p className="text-white text-xl mt-4 font-bold lg:text-3xl">
            {" "}
            Airnote Login{" "}
          </p>
          <div className="w-[90%] mx-auto border border-white rounded-xl m-2 p-4 flex items-start justify-center flex-col">
            {enterData && enterData.ok ? (
              <div className="space-y-1 w-full">
                <div onClick={handleInput} className="mb-2">
                  <p className="text-white lg:text-center lg:text-xl lg:p-2 lg:my-2 ">
                    이메일로 토큰이 전송되었습니다.
                  </p>
                  <p className="text-white lg:text-center lg:text-xl lg:p-2 lg:my-2 ">
                    확인 후 토큰을 입력해주세요.
                  </p>
                </div>

                <form
                  onSubmit={tokenSubmit(tokenValid)}
                  className="flex flex-col items-center"
                >
                  {inputState ? (
                    <input
                      type="text"
                      id="token"
                      className="lg:p-4 lg:text-lg border w-full lg:w-[70%] border-white p-2 rounded-lg   appearance-none focus:border-indigo-700 focus:border-2 ease-in duration-300"
                      {...tokenRegister("token", {
                        required: true,
                      })}
                    ></input>
                  ) : (
                    <input
                      type="text"
                      id="token"
                      className="lg:p-4 lg:text-lg border w-1 border-white p-2 rounded-lg appearance-none focus:border-indigo-700 focus:border-2 ease-in duration-300"
                      {...tokenRegister("token", {
                        required: true,
                      })}
                    ></input>
                  )}

                  <br />
                  <button className="border hover:border-indigo-500 hover:ring-1 hover:ring-offset-1 hover:ring-indigo-400 text-lg border-white text-white p-1 mt-2 w-full lg:w-[70%] rounded-lg">
                    {tokenLoading ? "Loading..." : "전송"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-1 w-full mx-auto">
                <div onClick={handleInput} className="cursor-pointer">
                  {inputState ? (
                    <p className="text-white lg:text-center ease-in duration-300 lg:-translate-y-4 -translate-y-2 lg:text-xl lg:p-2 lg:my-2">
                      이메일을 입력해주세요.
                    </p>
                  ) : (
                    <p className="text-white lg:text-center ease-in duration-300 lg:text-xl lg:p-2 lg:my-2">
                      로그인을 진행해주세요.{" "}
                      <span className="text-xs text-red-300">Click!!</span>
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
                        className="lg:p-4 lg:text-lg border w-full lg:w-[70%] border-white p-2 rounded-lg   appearance-none focus:border-indigo-700 focus:border-2 ease-in duration-300"
                        {...enterRegister("email", {
                          required: true,
                        })}
                      ></input>
                      <br />
                      <button className="border hover:border-indigo-500 hover:ring-1 hover:ring-offset-1 hover:ring-indigo-400 text-lg border-white text-white p-1 mt-2 w-full lg:w-[70%]  rounded-lg ease-in duration-750">
                        {enterLoading ? "Loading..." : "전송"}
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

      <div className="h-96"></div>
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
