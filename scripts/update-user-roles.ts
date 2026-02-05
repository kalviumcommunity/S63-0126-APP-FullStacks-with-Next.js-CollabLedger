import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateUserRoles() {
  try {
    console.log("Updating existing users with default USER role...");

    // Update all users without a role to USER
    const result = await prisma.user.updateMany({
      where: {
        role: {
          equals: undefined,
        },
      },
      data: {
        role: "USER",
      },
    });

    console.log(`✓ Updated ${result.count} users to USER role`);

    // List all users with their roles
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    console.log("\n📋 Current Users:");
    console.table(allUsers);

    console.log("\n✅ User roles updated successfully!");
  } catch (error) {
    console.error("Error updating user roles:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserRoles();
