import Layout from "@components/layout";
import type { NextPage } from "next";
import useSWR from "swr";
import { LoginUser } from "@libs/client/utils";
interface Notification {
  ok: boolean;
  count: number;
}

const Home: NextPage = () => {
  const { data: loginUser } = useSWR<LoginUser>(`/api/users/me`);

  return (
    <Layout>
      <div>
        <p>홈페이지</p>
      </div>
    </Layout>
  );
};
export default Home;
