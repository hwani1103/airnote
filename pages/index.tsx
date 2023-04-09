import Layout from "@components/layout";
import type { NextPage } from "next";
import useSWR from "swr";

interface Notification {
  ok: boolean;
  count: number;
}

const Home: NextPage = () => {
  const { data } = useSWR(`/api/users/notification`);
  return (
    <Layout>
      <div>
        <p>{data?.count}개의 알림이 있습니다.</p>
        <p>홈페이지</p>
      </div>
    </Layout>
  );
};
export default Home;
