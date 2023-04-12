import type { NextPage } from "next";
import Link from "next/link";

const Custom404: NextPage = () => {
  return (
    <div className="h-screen bg-gray-100 flex flex-col justify-center items-center space-y-8">
      <p className="text-5xl text-rose-700 shadow-lg animate-bounce">
        404 Not Found...
      </p>
      <Link className="text-2xl text-slate-700" href="/">
        홈페이지로 이동
      </Link>
    </div>
  );
};
export default Custom404;
