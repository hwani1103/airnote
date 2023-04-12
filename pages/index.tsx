import Layout from "@components/layout";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import BlueNote from "../public/images/bluenote2.jpeg";
import HappyPeople from "../public/images/happypeople.jpeg";
import WorriedPeople from "../public/images/worriedpeople.jpeg";
const Home: NextPage = () => {
  return (
    <Layout seoTitle={"HomePage"}>
      <div className="max-w-[1240px] w-[95%] mx-auto grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 ">
        <div className="p-4 px-3 border-2 rounded-lg border-t-[16px] border-indigo-500 lg:col-span-2 lg:order-1 lg:flex lg:justify-around lg:items-center">
          <div className="flex flex-col justify-center items-center">
            <p className="text-xl font-bold text-indigo-500 py-4">
              <span className="text-3xl">에</span>어노트 ?
            </p>
            <p className="text-lg p-1">
              누구에게도 쉽게 말하기 힘든 나만의 고민.
            </p>
            <p className="text-lg p-1">
              머릿속에서만 맴돌았던 풀기 어려운 고민들을
            </p>
            <p className="text-lg p-1">
              글로 적어 정리하고, 그로 인해 새로운 시각으로
            </p>
            <p className="text-lg p-1">
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
                각 회원을 식별하기 위해 닉네임만을 설정하신 후에 여러분의 고민을
                즉시 적어보며 정리하실 수 있습니다.
              </p>
              <div className="mt-4">
                <Link href="/">
                  <span className="flex justify-center items-center text-white bg-indigo-400 w-1/2 mx-auto p-4 rounded-xl ring-2 ring-offset-2 ring-indigo-400 shadow-lg">
                    <p className="text-center text-lg">자세히 알아보기</p>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:order-3 mx-auto">
          <Image src={WorriedPeople} alt="hihi" />
        </div>

        <div className="p-6 px-12 border-2 rounded-lg border-r-[16px] border-indigo-500 lg:order-3 flex items-center">
          <span className="text-start">
            <p className="text-xl font-bold text-indigo-500 py-4">
              <span className="text-3xl">사</span>람이라면 !
            </p>
            <p className="p-1 text-lg">
              누구나 하나씩은 어려운 고민을 가지고 있지요.
            </p>
            <p className="p-1 text-lg">
              나만의 작은 노트에 지금 내 마음의 고민을 적어보세요.{" "}
            </p>
            <p className="p-1 text-lg">
              많은 시간 고민하고, 누구에게도 말하기 힘든 생각들이 생각보다 쉽게
              해결이 될 지도 몰라요.
            </p>
            <Link href="/">
              <i className=" p-1 text-xl text-rose-500 border-b-2 border-blue-700">
                지금 시작해보세요!
              </i>
            </Link>
          </span>
        </div>

        <div className="lg:order-4 lg:col-span-2 mx-auto ">
          <Image src={BlueNote} width={500} alt="hihi" className="" />
        </div>
        <div className="lg:order-4 lg:col-span-2 mx-auto ">
          <Image src={HappyPeople} alt="hihi" className="" />
        </div>
      </div>
    </Layout>
  );
};

export default Home;
