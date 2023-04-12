import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
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

  return (
    <Layout seoTitle={"Enter Page"}>
      <p className="font-semibold text-xl shadow-lg text-slate-600">
        로그인하기!
      </p>
      <button onClick={() => signIn("kakao", { callbackUrl: "/api/user" })}>
        <p>카카오톡 로그인하기</p>
      </button>
      <br />
      <button onClick={() => signIn("naver", { callbackUrl: "/api/user" })}>
        <p>네이버 로그인하기</p>
      </button>
      <br />
      <button onClick={() => signIn("google", { callbackUrl: "/api/user" })}>
        <p>구글 로그인하기</p>
      </button>

      {enterData && enterData.ok ? (
        <div>
          <p>토큰을 입력하세요.</p>
          <form onSubmit={tokenSubmit(tokenValid)}>
            <input
              type="text"
              id="token"
              className="border-2 border-black p-4 text-xl"
              {...tokenRegister("token", {
                required: true,
              })}
            ></input>
            <br />
            <button className="p-3 bg-indigo-200 border-2 border-black my-4 rounded-xl">
              {enterLoading ? "Loading..." : "전송"}
            </button>
          </form>
        </div>
      ) : (
        <div>
          <p>이메일을 입력하세요.</p>
          <form onSubmit={enterSubmit(emailValid)}>
            <input
              type="text"
              id="email"
              className="border-2 border-black p-4 text-xl"
              {...enterRegister("email", {
                required: true,
              })}
            ></input>
            <br />
            <button className="p-3 bg-indigo-200 border-2 border-black my-4 rounded-xl">
              {enterLoading ? "Loading..." : "전송"}
            </button>
          </form>
        </div>
      )}
    </Layout>
  );
};

export default Enter;
