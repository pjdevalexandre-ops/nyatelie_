import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Limpando banco de dados para cadastro do zero...");

  await prisma.productVariation.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.review.deleteMany({});

  console.log("Banco de dados resetado com sucesso! Nenhuma peça cadastrada.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
