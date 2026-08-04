import { prisma } from "../src/lib/prisma";

async function main() {
  await prisma.storeSettings.upsert({
    where: { id: "default" },
    update: {
      whatsappNumber: "5591984829252",
    },
    create: {
      id: "default",
      whatsappNumber: "5591984829252",
      heroTitle: "Peças únicas em crochê, feitas com carinho & afeto",
      heroSubtitle: "Cada ponto carrega dedicação e história. Peças feitas sob encomenda para transformar seu lar ou presentear quem você ama com carinho.",
    },
  });
  console.log("Número de WhatsApp atualizado para 5591984829252!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
