import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Iniciando seed completo de categorias e depoimentos...");

  await prisma.product.deleteMany({});

  await prisma.product.create({
    data: {
      name: "Sousplat Rendado Algodão",
      description: "Jogo americano em crochê com acabamento rendado delicado. Perfeito para compor mesas postas elegantes e aconchegantes.",
      imageUrl: "https://images.unsplash.com/photo-1606744888344-49423b3f2d0d?w=800&auto=format&fit=crop&q=80",
      category: "Mesa Posta",
      position: 1,
      variations: {
        create: [
          { size: "35 cm (Unidade)", price: 45.00 },
          { size: "Jogo c/ 4 Unidades", price: 170.00 },
          { size: "Jogo c/ 6 Unidades", price: 240.00 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Bolsa Tote de Crochê Natural",
      description: "Bolsa espaçosa e resistente tecida à mão em fio de algodão natural. Acompanha forro interno macio e alças reforçadas.",
      imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
      category: "Bolsas & Acessórios",
      position: 2,
      variations: {
        create: [
          { size: "Tamanho M (30x35cm)", price: 120.00 },
          { size: "Tamanho G (38x42cm)", price: 155.00 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Caminho de Mesa Floral Encanto",
      description: "Trilho de mesa trabalhado com detalhes de flores e folhagens em alto relevo. Um toque artesanal inesquecível para sua sala de jantar.",
      imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80",
      category: "Decoração",
      position: 3,
      variations: {
        create: [
          { size: "1,20 metros", price: 135.00 },
          { size: "1,60 metros", price: 180.00 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Cesto Organizador Boho",
      description: "Cesto decorativo estruturado em crochê durável. Ideal para organizar mantas, brinquedos ou utilizar como cachepô de plantas.",
      imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80",
      category: "Decoração",
      position: 4,
      variations: {
        create: [
          { size: "Pequeno (20cm)", price: 65.00 },
          { size: "Médio (30cm)", price: 95.00 },
        ],
      },
    },
  });

  console.log("Seed de categorias finalizado com sucesso!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
