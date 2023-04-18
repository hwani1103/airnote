import type { NextPage } from "next";
import Layout from "@components/layout";
import Image from "next/image";
import { useState } from "react";

const About: NextPage = () => {
  const [modal, setModal] = useState(false);

  const openModal = () => {
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
  };

  const handleModal = () => {
    console.log("asdasd");
    if (modal) setModal(false);
  };
  return (
    <Layout seoTitle={"About Page"}>
      <div onClick={handleModal} className="max-w-[1240px] w-full mx-auto">
        <div className="pt-16 lg:pt-24 max-w-[1000px] relative mx-auto">
          <p className="text-center lg:text-2xl text-slate-800 text-xl p-4 lg:pb-8">
            About Airnote
          </p>
          <div>
            <Image
              src={
                "https://imagedelivery.net/cuArFA48MvcYiHZ6Ed4L4Q/ba46843e-2085-4625-da8e-e83a3045e700/sixteenandnine"
              }
              alt=""
              width={1240}
              height={698}
              className=""
            />
            <p className="absolute top-[30%] right-[20%] bg-amber-200 p-2 rounded-full shadow-sm lg:text-xl lg:p-4 lg:right-[25%]">
              계란도 고민이..
            </p>
          </div>
          <div className="mt-4 lg:mt-8">
            <p className="text-center text-rose-700 lg:text-2xl">
              Do you have any concerns? 😥{" "}
            </p>
          </div>
        </div>
        <div className="max-w-[1240px] lg:py-8 lg:text-xl border border-gray-700 rounded-lg lg:m-8 p-4 m-4 mx-8 flex flex-col items-center justify-center space-y-4 ">
          <p>
            <span className="text-xl text-indigo-500">학교생활</span>, 취업준비,
            연애, 결혼, 직장, 부, 노후준비 등. 사람들은 남녀노소 모두 저마다의
            고민을 안고 살아가고 있습니다.
          </p>
          <p>
            {" "}
            이러한 고민이 있다는 것 자체는, 역설적으로 더 나은 인생을 바라보고
            있다는 뜻이기도 하답니다.
          </p>
          <p>
            {" "}
            하지만 때로는 어떤 고민에 대해 너무 깊게 생각하거나, 도무지 해결이
            되지 않아 큰 스트레스를 받기도 합니다.
          </p>
          <p>
            {" "}
            Airnote는 이러한 각자의 고민을 해결하는 하나의 Solution을 제공하고자
            기획된 웹사이트입니다.
          </p>
        </div>
        <div className="max-w-[1240px] lg:p-12 lg:text-xl border border-gray-700 rounded-lg lg:m-8 p-4 m-4 mx-8 flex flex-col items-center justify-center space-y-4 ">
          <p>
            <span className="text-xl lg:text-3xl text-indigo-500">
              어떤 Solution
            </span>
            을 제공하나요?
          </p>
          <p>
            {" "}
            <span className="text-2xl text-red-500 font-bold">🖍</span> 자유롭게
            고민을 Note해요!{" "}
          </p>
          <p>
            악의적인 내용이 없다면, 얼마든지 자유롭게 나의 고민을 적을 수
            있어요. 그 과정에서 생각이 정리되고, 의외의 해결방법이 떠오를지도
            모릅니다.
          </p>
          <p>
            {" "}
            <span className="text-xl text-red-500 font-bold">👍</span> 진심어린
            답글 및 응원을 받아요!
          </p>
          <p>
            {" "}
            나와 비슷한 연령, 성별, 직업을 가진 다른 회원들이 남겨주는 진심어린
            답글과 함께, 비슷한 상황이 아니더라도 내가 생각하지 못했던 새로운
            해결책을 다른 회원들로부터 받을 수 있습니다.
          </p>
          <p>
            {" "}
            <span className="text-xl text-red-500 font-bold">😎</span> 익명으로
            편안하게 고민을 나눠요!
          </p>
          <p>
            {" "}
            Airnote가 회원에게 제공받는 정보는 오직 Email주소 뿐이며, Email주소
            또한 암호화하여 저장됩니다. 사소할지라도 남들에게는 말하고 싶지
            않았던 고민들을 Airnote에서 쉽고 편하게 공유해보세요.
          </p>

          <div
            className="bg-gray-700 p-2 flex justify-center items-center flex-col
ring-2 ring-offset-2 ring-indigo-400 hover:bg-white group ease-in-out duration-300
hover:ring-gray-700 cursor-pointer rounded-lg active:translate-x-1"
          >
            <p
              onClick={openModal}
              className="text-lg font-bold text-indigo-100 group-hover:text-gray-700 ease-in-out duration-300 "
            >
              Airnote의 회원정책
            </p>
          </div>
        </div>
      </div>

      {modal ? (
        <div
          onClick={(e) => {
            setModal(false);
          }}
          className="fixed top-0 ease-in-out duration-300 bottom-0 left-0 right-0 h-screen bg-black/80 flex justify-center items-center z-20"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="relative ease-in-out duration-300 w-[90%] h-[80%] bg-white p-8 overflow-auto"
          >
            <p className="text-center text-lg lg:text-2xl text-slate-700 mt-4">
              Airnote 회원정책
            </p>
            <ul className="list-disc space-y-4 m-4 lg:text-xl">
              <li>회원 가입이 없는 서비스</li>
              <p className="text-xs lg:text-sm">
                최초 로그인 시, 입력하신 Email 주소로 랜덤한 Token값이 전송되면,
                이를 확인하신 후 복사하여 입력하면 로그인에 성공합니다. 이 때
                회원의 Email주소가 암호화된 채 Airnote에 저장되고, 다음
                로그인부터는 저장된 정보에 의해 서비스됩니다.
              </p>
              <p className="text-xs lg:text-sm">
                또는, 카카오, 네이버, 구글 계정으로 더 간편한 로그인도
                지원합니다. 이 때에도 마찬가지로 Email정보만 수집하며,
                암호화하여 저장됩니다.
              </p>
              <p className="text-xs lg:text-sm">
                최초 로그인시, 자동으로 랜덤 닉네임이 생성됩니다. 프로필에서
                설정할 수 있는 정보는 닉네임, 나이, 성별, 직업 뿐이며 자동으로
                생성되는 랜덤 닉네임을 제외한 모든 정보는 선택적 입력사항입니다.
                <p>
                  또한 나이는 정확하게 입력하되, 서비스상 표기는 OO대 로
                  표기됩니다.
                </p>
                <p className="p-2">ex. 34살 입력 = 30대 로 표기</p>
              </p>
              <p className="text-xs lg:text-sm">
                로그인 정보는 일정 시간동안 유지되며, 브라우저의 쿠키가 삭제되지
                않는다면, 브라우저를 종료해도 로그인 상태가 유지됩니다.
              </p>

              <li>회원간의 답글 작성</li>
              <p className="text-xs lg:text-sm">
                프로필에서 기본적인 설정을 하셨다면, 나와 비슷한 나이대, 성별,
                직업을 가진 회원의 고민이 우선적으로 검색됩니다. 따라서, 비슷한
                상황에 처한 다른 회원들간의 공감 형성이 용이하며 진심어린 답글과
                응원을 받을 수 있습니다.
              </p>
              <p className="text-xs lg:text-sm">
                내가 적은 Note에 대한 답글이 생성되면, 이 답글에 대한 또다른
                답글 작성은 불가능합니다. 진심 어린 답글이 도움되었다면 별점으로
                고마움을 표시하거나, 악성 답글의 경우 신고하기 버튼을 눌러 해당
                회원의 활동 제재를 건의할 수 있습니다.
              </p>
              <p className="text-xs lg:text-sm">
                이러한 구조로 인해 일반적인 커뮤니티와는 다른 서비스를 제공하며,
                회원간에 진심어린 답글과 응원을 주고받아 혼자 앓고있던 고민들을
                해결하는 데 도움을 받을 수 있습니다.
              </p>
              <li>응원해요 버튼</li>
              <p className="text-xs lg:text-sm">
                응원해요 버튼은 답글 작성 유무와 상관없이 누를 수 있으며, 다른
                회원이 고민 작성자에게 위로와 공감을 주는 의미로 Note당 한 번
                클릭하여 응원 수를 올릴 수 있습니다. Note 작성자는 어떤 회원이
                내 고민에 응원해요 버튼을 눌렀는 지 알 수 있으며, 얼마나 많은
                회원이 나를 응원하고 있는지를 확인함으로 더 많은 위로를 얻을 수
                있습니다.
              </p>
              <li>악의적 이용에 관하여</li>
              <p className="text-xs lg:text-sm">
                Airnote는 2023-04 기준 처음으로 시작하는 초기 단계이며, 전문적인
                기업체에서 운영하는 것이 아닌 1인 운영 웹사이트입니다. 따라서,
                악의적인 요청이나 활동 시 다소 엄격한 제재(강제 탈퇴처리 후
                재가입 불가)가 있을 수 있습니다.
              </p>
              <li>버그신고 및 건의</li>
              <p className="text-xs lg:text-sm">
                서비스 이용 중 버그를 발견하셨거나, 건의사항이 있으시다면
                언제든지 편하게 이메일을 보내주시면 감사드리겠습니다.
                <p className="p-4"> Email : hwanine7@naver.com </p>
              </p>
            </ul>
            <p className="text-center text-lg text-slate-700">감사합니다</p>
            <button
              onClick={closeModal}
              className="fixed top-24 right-12 lg:right-24 lg:p-3 lg:text-sm
          p-2 bg-rose-500 rounded-xl text-black text-sm border-rose-200 border-2 
          hover:bg-rose-800 hover:text-white active:translate-x-1 ease-in duration-300
          "
              type="button"
            >
              닫기
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </Layout>
  );
};

export default About;
