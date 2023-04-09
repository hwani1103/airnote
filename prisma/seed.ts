import { PrismaClient } from "@prisma/client";
//더미데이터 쉽게 만들기.
//명령어는 npx prisma db seed

const client = new PrismaClient();

async function main() {
  [...Array.from(Array(500).keys())].forEach(async (item) => {
    await client.note.create({
      data: {
        title: `${item}번째 title`,
        content: `${item}번째 content`,
        user: {
          connect: {
            id: 5,
          },
        },
      },
    });
    console.log(`${item}/500`);
  });
}

main()
  .catch((e) => console.log(e))
  .finally(() => client.$disconnect());