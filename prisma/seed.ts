import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Limpando banco de dados para cadastro do zero...");

  try {
    await prisma.productVariation.deleteMany({});
    await prisma.product.deleteMany({});
  } catch (e) {
    console.log("Banco zerado ou tabelas vazias.");
  }

  console.log("Banco de dados resetado com sucesso!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
