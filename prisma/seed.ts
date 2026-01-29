// prisma/seed.ts
const { PrismaClient, ProjectStatus, TaskStatus } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  const user = await prisma.user.upsert({
    where: { email: 'ngo@example.com' },
    update: {},
    create: {
      email: 'ngo@example.com',
      name: 'Alpha NGO',
    },
  })

  // Use upsert for the project as well to make the seed idempotent
  const project = await prisma.project.upsert({
    where: { id: 'water-for-all-project-id' }, // We can use a fixed ID for the seed
    update: {},
    create: {
      id: 'water-for-all-project-id',
      title: 'Water for All',
      description: 'Building sustainable water wells in remote villages.',
      status: ProjectStatus.IN_PROGRESS,
      ownerId: user.id,
    },
  })

  // Delete existing tasks for this project to avoid duplicates on re-run
  await prisma.task.deleteMany({
    where: { projectId: project.id },
  })

  await prisma.task.createMany({
    data: [
      {
        title: 'Geological Survey',
        description: 'Identify the best location for the well.',
        status: TaskStatus.DONE,
        projectId: project.id,
      },
      {
        title: 'Drilling Equipment Procurement',
        description: 'Purchase or rent drilling rigs.',
        status: TaskStatus.IN_PROGRESS,
        projectId: project.id,
      },
    ],
  })

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
