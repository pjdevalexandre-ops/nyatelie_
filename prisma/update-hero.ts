import { prisma } from "../src/lib/prisma";

async function main() {
  await prisma.storeSettings.update({
    where: { id: "default" },
    data: {
      heroTitle: "Peças únicas em crochê, feitas com carinho & afeto",
    },
  });
  console.log("Título do Hero atualizado para 'feitas'!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
