import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@lingyun.local";
  const adminPass = process.env.SEED_ADMIN_PASSWORD ?? "admin123456";

  const passwordHash = await bcrypt.hash(adminPass, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "LingYun Admin",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  const categories = ["Feng Shui", "BaZi", "Cosmology", "Wisdom"];
  for (const name of categories) {
    await prisma.category.upsert({
      where: { slug: name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: { name, slug: name.toLowerCase().replace(/\s+/g, "-") },
    });
  }

  const tags = ["wealth", "love", "career", "health", "ritual"];
  for (const name of tags) {
    await prisma.tag.upsert({
      where: { slug: name },
      update: {},
      create: { name, slug: name },
    });
  }

  const feng = await prisma.category.findUnique({ where: { slug: "feng-shui" } });

  const samplePosts = [
    {
      title: "The Ultimate Guide to Feng Shui Interior Design",
      slug: "feng-shui-interior-design",
      excerpt:
        "Transform your home with the Bagua map, the Five Elements, and the commanding position — and invite peace, health and prosperity into your life.",
      readMinutes: 8,
      content: {
        type: "doc",
        content: [
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Begin with the Bagua Map" }] },
          { type: "paragraph", content: [{ type: "text", text: "Place the Bagua over your floor plan to discover the nine life areas. Each sector is governed by an element, a color and a direction." }] },
          { type: "paragraph", content: [{ type: "text", text: "When the energy in a sector is balanced, the corresponding area of life flourishes — health, wealth, relationships, career and creativity." }] },
        ],
      },
      contentHtml:
        "<h2>Begin with the Bagua Map</h2><p>Place the Bagua over your floor plan to discover the nine life areas. Each sector is governed by an element, a color and a direction.</p><p>When the energy in a sector is balanced, the corresponding area of life flourishes — health, wealth, relationships, career and creativity.</p>",
    },
    {
      title: "How to Read Your BaZi Chart — A Beginner's Map",
      slug: "understand-your-bazi",
      excerpt:
        "Heavenly Stems, Earthly Branches, Day Master — demystified in plain English. The first step to seeing yourself as the cosmos sees you.",
      readMinutes: 12,
      content: {
        type: "doc",
        content: [
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Your Day Master" }] },
          { type: "paragraph", content: [{ type: "text", text: "The Heavenly Stem of your day pillar is the core of your BaZi chart — the self around which all other energies orbit." }] },
        ],
      },
      contentHtml:
        "<h2>Your Day Master</h2><p>The Heavenly Stem of your day pillar is the core of your BaZi chart — the self around which all other energies orbit.</p>",
    },
    {
      title: "2026 Tai Sui — Who Clashes and How to Harmonize",
      slug: "2026-tai-sui",
      excerpt:
        "The Year of the Horse brings a powerful Tai Sui. Discover which animal signs are in clash and the rituals that neutralize misfortune.",
      readMinutes: 6,
      content: {
        type: "doc",
        content: [
          { type: "paragraph", content: [{ type: "text", text: "Each year a single Tai Sui presides over the heavens. Knowing whether your sign clashes with the year is the first step in adapting your energy." }] },
        ],
      },
      contentHtml:
        "<p>Each year a single Tai Sui presides over the heavens. Knowing whether your sign clashes with the year is the first step in adapting your energy.</p>",
    },
  ];

  for (const p of samplePosts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        status: "PUBLISHED",
        publishedAt: new Date(),
        authorId: admin.id,
        categoryId: feng?.id,
      },
    });
  }

  console.log("✓ Seed complete");
  console.log(`  Admin: ${adminEmail} / ${adminPass}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
