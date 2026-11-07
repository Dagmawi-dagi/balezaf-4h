import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Balezaf database...')

  // 1. Admin User
  const adminEmail = 'admin@balezaf.et'
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  let adminUser = existingAdmin
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin@123456', 10)
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        fullName: 'Balezaf Head Administrator',
        passwordHash,
        role: 'ADMIN',
      },
    })
    console.log(`✅ Created default admin user: ${adminEmail} (password: Admin@123456)`)
  } else {
    console.log(`ℹ️ Admin user already exists: ${adminEmail}`)
  }

  // 2. Default Blog Posts
  const initialBlogs = [
    {
      title: 'The botanicals that make our gin unmistakably Ethiopian',
      slug: 'the-botanicals-that-make-our-gin-unmistakably-ethiopian',
      category: 'MAKING BALEZAF',
      excerpt: 'From bright citrus to fragrant herbs, explore the local ingredients that shape our signature profile.',
      content: `At Balezaf, every drop of our signature gin is infused with hand-selected botanicals harvested from the fertile highlands of Ethiopia. We blend traditional distillation techniques with native korarima, wild juniper berries, and sun-ripened citrus peels to create a clean, aromatic profile that is distinctly ours.\n\nOur distillers carefully control every temperature threshold to extract the delicate essential oils without scorching the fragrant herbs, yielding a crisp, balanced spirit suited for neat sipping or elevated cocktails.`,
      imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/balezaf_blog_bg_green-VvU1YVwjlyPHJV2gYJlczTbYJ6iLwp.png',
      isPublished: true,
      authorId: adminUser?.id,
    },
    {
      title: 'A better highball starts with patience',
      slug: 'a-better-highball-starts-with-patience',
      category: 'SERVE NOTES',
      excerpt: 'A simple ritual for a fresh, balanced serve that lets every note in the bottle breathe.',
      content: `The secret of an exceptional highball is temperature balance and pure effervescence. Fill a highball glass to the brim with clear, dense ice blocks. Pour 50ml of chilled Balezaf Gin or Vodka, gently roll the liquid over the ice, and top slowly with artisanal tonic water or soda.\n\nGarnish with a fresh twist of Ethiopian lime or sprig of rosemary. Never over-stir—allow the carbonation to marry the botanicals naturally.`,
      imageUrl: '',
      isPublished: true,
      authorId: adminUser?.id,
    },
    {
      title: 'Inside the new generation of Addis hospitality',
      slug: 'inside-the-new-generation-of-addis-hospitality',
      category: 'PEOPLE & PLACE',
      excerpt: 'The bartenders, chefs, and hosts building a more generous drinks culture in Ethiopia.',
      content: `Addis Ababa is undergoing a vibrant gastronomic renaissance. Across cocktail lounges, boutique hotels, and cultural hubs, visionary beverage directors are celebrating local ingredients and homegrown spirits.\n\nWe spent an afternoon with the creative leaders shaping modern gatherings, discovering how Balezaf spirits anchor signature drinks that respect tradition while embracing contemporary mixology.`,
      imageUrl: '',
      isPublished: true,
      authorId: adminUser?.id,
    },
  ]

  for (const blog of initialBlogs) {
    await prisma.blogPost.upsert({
      where: { slug: blog.slug },
      update: {},
      create: blog,
    })
  }
  console.log(`✅ Seeded ${initialBlogs.length} initial blog posts.`)

  // 3. Default Job Vacancies
  const initialJobs = [
    {
      title: 'Brand & Partnerships Manager',
      team: 'Growth · Addis Ababa',
      type: 'Full-time',
      location: 'Addis Ababa',
      description: 'Lead brand collaborations with top hospitality venues, cultural festivals, and creative partners across Ethiopia.',
      requirements: '3+ years experience in brand activation or luxury hospitality; outstanding storytelling, presentation, and negotiation skills.',
      status: 'OPEN' as const,
    },
    {
      title: 'Production Quality Lead',
      team: 'Distillery · Addis Ababa',
      type: 'Full-time',
      location: 'Addis Ababa',
      description: 'Ensure international spirits quality standards across botanical extraction, distillation, purity testing, and bottling.',
      requirements: 'Degree in Chemical Engineering, Food Science, or related field; hands-on distillery or beverage manufacturing experience.',
      status: 'OPEN' as const,
    },
    {
      title: 'Trade Marketing Associate',
      team: 'Commercial · Addis Ababa',
      type: 'Full-time',
      location: 'Addis Ababa',
      description: 'Work alongside regional distribution partners and venues to grow visibility, product displays, and staff tastings.',
      requirements: 'Experience in FMCG or beverage distribution; energetic communicator with strong project organization skills.',
      status: 'OPEN' as const,
    },
  ]

  for (const job of initialJobs) {
    const existing = await prisma.vacancy.findFirst({
      where: { title: job.title },
    })
    if (!existing) {
      const createdJob = await prisma.vacancy.create({ data: job })

      // Seed a sample application for the first job
      if (job.title === 'Brand & Partnerships Manager') {
        await prisma.vacancyApplication.create({
          data: {
            vacancyId: createdJob.id,
            fullName: 'Abebe Tadesse',
            email: 'abebe.tadesse@example.com',
            phone: '+251 91 123 4567',
            coverLetter: 'I have 4 years of luxury hospitality management in Bole and would love to champion Balezaf across Addis venues.',
            resumeUrl: 'https://example.com/resumes/abebe-tadesse-cv.pdf',
            status: 'REVIEWING',
          },
        })
      }
    }
  }
  console.log(`✅ Seeded default job vacancies and sample application.`)

  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
