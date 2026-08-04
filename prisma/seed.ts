import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.storeSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      whatsappNumber: "5591999999999",
      heroTitle: "Peças únicas em crochê, feitas com carinho & afeto",
      heroSubtitle: "Cada ponto carrega dedicação e história. Feitas sob encomenda em São Miguel do Guamá - PA para todo o Brasil.",
      adminPassword: hashedPassword,
    },
  });

  const prods = await prisma.product.findMany();
  if (prods.length > 0) {
    for (const p of prods) {
      if (p.name.includes("Sousplat")) {
        await prisma.product.update({
          where: { id: p.id },
          data: { imageUrl: "https://images.unsplash.com/photo-1617056637375-7f41a87e594d?auto=format&fit=crop&w=800&q=80" },
        });
      } else if (p.name.includes("Bolsa")) {
        await prisma.product.update({
          where: { id: p.id },
          data: { imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80" },
        });
      } else if (p.name.includes("Manta")) {
        await prisma.product.update({
          where: { id: p.id },
          data: { imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80" },
        });
      }
    }
  }

  console.log("Seed de imagens corrigido!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
