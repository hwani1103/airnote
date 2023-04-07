import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import useUser from "@libs/client/useUser";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "@components/layout";
import useSWR from "swr";
import type { UserData } from "@components/layout";

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

  const {
    register: enterRegister,
    handleSubmit: enterSubmit,
    reset,
  } = useForm<EnterForm>();
  const { register: tokenRegister, handleSubmit: tokenSubmit } =
    useForm<TokenForm>();

  const [enterMutate, { loading: enterLoading, data: enterData }] =
    useMutation<mutateResult>("/api/users/enter");
  const [tokenMutate, { loading: tokenLoading, data: tokenData }] =
    useMutation<mutateResult>("/api/users/confirm");

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
  }, [tokenData, router]);

  // if (data && data.ok) {
  //   router.push("/");
  // } 테스트하다가 이상없으면 삭제. 이거 왜적었는지 모르겠네?;--,

  return (
    <Layout>
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
