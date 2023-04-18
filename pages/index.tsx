import Layout from "@components/layout";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import BlueNote from "../public/images/bluenote2.jpeg";
import HappyPeople from "../public/images/happypeople.jpeg";
import WorriedPeople from "../public/images/worriedpeople.jpeg";
import WorriedMan from "../public/images/worriedman.jpg";
import { TbHandClick } from "react-icons/tb";
const Home: NextPage = () => {
  return (
    <Layout seoTitle={"HomePage"}>
      <div className="bg-sky-700 bg-blend-screen from-green-500 to-yellow-200 bg-gradient-to-tr pt-16 lg:pt-24">
        <div className="max-w-[1240px] w-[95%] mx-auto grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 ">
          <div className="lg:order-1 w-full bg-yellow-200 bg-gradient-to-tr from-slate-500 to-indigo-400 lg:col-span-2 flex justify-center items-center text-white">
            <Image
              src={
                "https://imagedelivery.net/cuArFA48MvcYiHZ6Ed4L4Q/61083260-1efa-439b-b51e-a3e1d8277600/sixteenandnine"
              }
              alt="asd"
              width={1240}
              height={698}
              className=""
            />
          </div>

          <div className="p-4 lg:p-2  bg-white px-3 rounded-lg border-t-[6px] border-indigo-500 lg:col-span-2 lg:order-2 lg:flex lg:justify-around lg:items-center">
            <div className="flex flex-col justify-center items-center">
              <p className="text-xl lg:text-2xl font-bold text-indigo-500 py-4 lg:pb-4 lg:pt-1">
                <span className="text-3xl lg:text-4xl">에</span>어노트 ?
              </p>
              <p className="text-lg lg:text-xl lg:p-2 p-1">
                누구에게도 쉽게 말하기 힘든 나만의 고민.
              </p>
              <p className="text-lg lg:text-xl lg:p-2 p-1">
                머릿속에서만 맴돌았던 풀기 어려운 고민들을
              </p>
              <p className="text-lg lg:text-xl lg:p-2 p-1">
                글로 적어 정리하고, 그로 인해 새로운 시각으로
              </p>
              <p className="text-lg lg:text-xl lg:p-2 p-1">
                고민을 해결해나가도록 도움을 주는 곳입니다.
              </p>
            </div>

            <div className="flex flex-col justify-center items-center">
              <div className="max-w-[500px] lg:border-l-2 lg:border-t-0 lg:border-rose-500 border-t-2 m-4 border-rose-500 p-4">
                <p className="text-start lg:text-xl lg:text-start text-lg py-4 text-rose-500">
                  📢 에어노트는 회원님의 E-mail주소를 제외한 그 어떠한 정보도
                  제공받지 않습니다.
                </p>
                <p className="text-start lg:text-xl lg:text-start text-lg py-4 text-rose-500">
                  {" "}
                  각 회원을 식별하기 위해 닉네임만을 설정하신 후에 바로 자신의
                  고민을 적어보며 생각을 정리하실 수 있습니다.
                </p>
                <div className="mt-4">
                  <Link href="/about">
                    <span className="flex justify-center items-center hover:text-indigo-800 ease-in-out duration-300 active:translate-x-1 hover:bg-indigo-200 text-white bg-indigo-400 w-1/2 mx-auto p-4 rounded-xl ring-2 ring-offset-2 ring-indigo-400 shadow-lg">
                      <p className="text-center text-lg">자세히 알아보기</p>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:order-3 mx-auto">
            <Image
              src={
                "https://imagedelivery.net/cuArFA48MvcYiHZ6Ed4L4Q/67f57aba-0700-4c77-88ef-2f8dd0e0a200/sixteenandnine"
              }
              alt="hihi"
              width={1240}
              height={698}
              className="rounded-xl"
            />
          </div>

          <div className="p-6 px-12 rounded-lg bg-white border-l-[6px] border-indigo-500 lg:order-4 flex items-center">
            <span className="text-start">
              <p className="text-xl font-bold text-indigo-500 py-4">
                <span className="text-3xl">사</span>람이라면 !
              </p>
              <p className="p-1 text-lg">
                누구나 하나씩은 어려운 고민을 가지고 있어요.
              </p>
              <p className="p-1 text-lg">
                나만의 작은 노트에 지금 내 마음의 고민을 적어보세요.{" "}
              </p>
              <p className="p-1 text-lg">
                많은 시간 고민하고, 누구에게도 말하기 힘든 생각들이 생각보다
                쉽게 해결이 될 지도 몰라요.
              </p>
              <Link href="/note">
                <div className="flex items-center justify-around active:translate-x-1 ease-in-out duration-300 ">
                  <i className=" p-1 text-xl text-rose-500 border-b-2 border-blue-700">
                    지금 시작해보세요!
                  </i>
                  <div
                    className="bg-gray-700 rounded-full w-14 h-14 flex justify-center items-center flex-col
ring-2 ring-offset-2 ring-indigo-400 hover:bg-white group ease-in-out duration-300
hover:ring-gray-700 "
                  >
                    <p className="text-xs font-bold text-indigo-100 group-hover:text-gray-700 ease-in-out duration-300">
                      Start
                    </p>
                    <TbHandClick className="text-2xl text-indigo-100 group-hover:text-gray-700 ease-in-out duration-300" />
                  </div>
                </div>
              </Link>
            </span>
          </div>

          <div className="lg:order-5 mx-auto">
            <Image
              src={
                "https://imagedelivery.net/cuArFA48MvcYiHZ6Ed4L4Q/b865f918-97e5-4b06-18a3-73262112a300/sixteenandnine"
              }
              width={1240}
              height={698}
              alt="hihi"
              className="rounded-xl"
            />
          </div>
          <div className="lg:order-6 mx-auto pb-8">
            <Image
              src={
                "https://imagedelivery.net/cuArFA48MvcYiHZ6Ed4L4Q/2db45d44-2aab-48ac-ff86-334377786500/sixteenandnine"
              }
              alt="hihi"
              width={1240}
              height={698}
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="bg-[#222831] text-[#eeeeee] p-2 ">
          <p className="font-bold text-lg text-center">©Airnote</p>
          <p className="font-bold text-sm">
            오시는 길 : 서울시 양념구 치킨로 2마리 정말맛있길
          </p>
          <p className="font-bold text-sm">사업자 : Gogos</p>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
