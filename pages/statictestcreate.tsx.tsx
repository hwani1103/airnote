import { Note, User } from "@prisma/client";
import type { NextPage } from "next";
import useSWR from "swr";
import client from "@libs/server/client";
import Link from "next/link";

const Home: NextPage = () => {
  const createNote = async () => {
    await fetch("/api/statictestcreate", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <div>
      <Link href="/statictest">statictest</Link>
      <br></br>
      <button className="p-4 m-8 bg-red-200" onClick={createNote}>
        Note를 만들어보자
      </button>
    </div>
  );
};

export default Home;
