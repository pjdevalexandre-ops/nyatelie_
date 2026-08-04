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
      heroTitle: "Peças únicas em crochê, tecidas com carinho & afeto",
      heroSubtitle: "Cada ponto carrega dedicação e história. Feitas sob encomenda em São Miguel do Guamá - PA para todo o Brasil.",
      adminPassword: hashedPassword,
    },
  });

  // Atualiza produtos existentes com URLs de imagem confiáveis
  const prods = await prisma.product.findMany();
  if (prods.length > 0) {
    for (const p of prods) {
      if (p.name.includes("Sousplat")) {
        await prisma.product.update({
          where: { id: p.id },
          data: { imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80" },
        });
      } else if (p.name.includes("Bolsa")) {
        await prisma.product.update({
          where: { id: p.id },
          data: { imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80" },
        });
      } else if (p.name.includes("Manta")) {
        await prisma.product.update({
          where: { id: p.id },
          data: { imageUrl: "https://images.unsplash.com/photo-1606744888344-493238951221?auto=format&fit=crop&w=800&q=80" },
        });
      }
    }
  }

  console.log("Banco sincronizado e imagens atualizadas!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
