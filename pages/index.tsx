import Layout from "@components/layout";
import type { NextPage } from "next";
const Home: NextPage = () => {
  return (
    <Layout seoTitle={"HomePage"}>
      <div className="relative">
        <video width="full" height="full" autoPlay loop muted>
          <source src="skyvideo2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div
          className="absolute top-[30%] transform 
          translate-x-1/4 p-4 w-2/3 h-48
        border-2 border-indigo-600 rounded-lg ring-2 ring-offset-2 ring-blue-800"
        >
          <p className="text-white font-thin text-lg brightness-150 ">
            홈페이지 입니다
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
