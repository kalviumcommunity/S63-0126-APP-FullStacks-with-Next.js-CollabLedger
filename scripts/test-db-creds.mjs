import { PrismaClient } from '@prisma/client'

const url = "postgresql://user:password@localhost:5432/collabledger?schema=public";
console.log("Testing connection with:", url);

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: url
        }
    }
})

async function main() {
  try {
    const users = await prisma.user.findMany({ take: 1 });
    console.log("SUCCESS: Connected with old credentials!");
    console.log("Users found:", users);
  } catch (e) {
      console.log("FAILED with old credentials.");
      console.error(e.message);
  }
}

main();
