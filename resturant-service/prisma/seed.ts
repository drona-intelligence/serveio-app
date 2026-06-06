import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SeedItem = {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  displayOrder: number;
};

type SeedCategory = {
  name: string;
  description: string;
  order: number;
  items: SeedItem[];
};

const menuSeed = {
  name: "Serveio Menu",
  description: "Fresh coffee, drinks, food, and desserts made to order.",
  categories: [
    {
      name: "Coffee & Espresso",
      description: "Hot espresso drinks and specialty coffee.",
      order: 1,
      items: [
        { name: "Espresso", description: "Rich single-shot espresso.", price: $150, imageUrl: "/espresso-coffee.jpeg", displayOrder: 1 },
        { name: "Americano", description: "Espresso with hot water.", price: $180, imageUrl: "/Americano.jpeg", displayOrder: 2 },
        { name: "Americano Double Shot", description: "Bold double-shot americano.", price: $220, imageUrl: "/AmericanoDoubleShot.jpeg", displayOrder: 3 },
        { name: "Double Shot Espresso", description: "Intense double espresso.", price: $200, imageUrl: "/DoubleShotEspresso.jpeg", displayOrder: 4 },
        { name: "Macchiato", description: "Espresso marked with steamed milk.", price: $190, imageUrl: "/Macchiato.jpeg", displayOrder: 5 },
        { name: "Cappuccino", description: "Espresso with steamed milk foam.", price: $220, imageUrl: "/Cappuccino.jpeg", displayOrder: 6 },
        { name: "Latte", description: "Smooth espresso with steamed milk.", price: $230, imageUrl: "/latte.jpeg", displayOrder: 7 },
        { name: "Latte Coffee", description: "Creamy latte with a velvety finish.", price: $230, imageUrl: "/latte-coffee.png", displayOrder: 8 },
        { name: "Mocha Frappuccino", description: "Iced blended mocha coffee.", price: $280, imageUrl: "/MochaFrappuccino.jpeg", displayOrder: 9 },
        { name: "Affogato", description: "Espresso poured over vanilla ice cream.", price: $300, imageUrl: "/Affogato.jpeg", displayOrder: 10 },
        { name: "Hot Chocolate", description: "Warm and creamy chocolate drink.", price: $250, imageUrl: "/HotChocolate.jpeg", displayOrder: 11 },
      ],
    },
    {
      name: "Tea",
      description: "Hot and iced tea selections.",
      order: 2,
      items: [
        { name: "Black Tea", description: "Classic brewed black tea.", price: $120, imageUrl: "/BlackTea.jpeg", displayOrder: 1 },
        { name: "Green Tea", description: "Light and refreshing green tea.", price: $120, imageUrl: "/GreenTea.jpeg", displayOrder: 2 },
        { name: "Lemon Tea", description: "Black tea with fresh lemon.", price: $140, imageUrl: "/LemonTea.jpeg", displayOrder: 3 },
        { name: "Hot Lemon", description: "Soothing hot lemon drink.", price: $140, imageUrl: "/HotLemon.jpeg", displayOrder: 4 },
        { name: "Iced Coffee", description: "Chilled coffee over ice.", price: $200, imageUrl: "/IcedCoffee.jpeg", displayOrder: 5 },
        { name: "Iced Mint Tea", description: "Cool mint-infused iced tea.", price: $160, imageUrl: "/IcedMintTea.jpeg", displayOrder: 6 },
        { name: "Iced Lemon Tea", description: "Refreshing iced lemon tea.", price: $160, imageUrl: "/IcedLemonTea.jpeg", displayOrder: 7 },
        { name: "Peach Iced Tea", description: "Sweet peach flavored iced tea.", price: $170, imageUrl: "/PeachIcedTea.jpeg", displayOrder: 8 },
      ],
    },
    {
      name: "Cold Drinks",
      description: "Lassi, lemonade, and fruit coolers.",
      order: 3,
      items: [
        { name: "Mango Lassi", description: "Creamy yogurt drink with mango.", price: $180, imageUrl: "/MangoLassi.jpeg", displayOrder: 1 },
        { name: "Sweet Lassi", description: "Traditional sweet yogurt lassi.", price: $160, imageUrl: "/SweetLassi.jpeg", displayOrder: 2 },
        { name: "Banana Lassi", description: "Banana blended with yogurt.", price: $170, imageUrl: "/BananaLassi.jpeg", displayOrder: 3 },
        { name: "Lemonade", description: "Freshly squeezed lemonade.", price: $150, imageUrl: "/Lemonade.jpeg", displayOrder: 4 },
        { name: "Lemon Soda", description: "Sparkling lemon soda.", price: $140, imageUrl: "/Lemonsoda.jpeg", displayOrder: 5 },
        { name: "Mango Punch", description: "Tropical mango fruit punch.", price: $180, imageUrl: "/MangoPunch.jpeg", displayOrder: 6 },
        { name: "Pineapple Orange Punch", description: "Citrus pineapple and orange blend.", price: $190, imageUrl: "/PineapleOrangePunch.jpeg", displayOrder: 7 },
        { name: "Orange Pineapple", description: "Bright orange and pineapple mix.", price: $180, imageUrl: "/OrangePineapple.jpeg", displayOrder: 8 },
        { name: "Lemony Fruit Cooler", description: "Fruity cooler with lemon zest.", price: $170, imageUrl: "/LemonyFruitColler.jpeg", displayOrder: 9 },
        { name: "Strawberry Lemon Cooler", description: "Strawberry and lemon refresher.", price: $180, imageUrl: "/StrawberryLemonCooler.jpeg", displayOrder: 10 },
      ],
    },
    {
      name: "Smoothies & Milkshakes",
      description: "Blended smoothies and creamy milkshakes.",
      order: 4,
      items: [
        { name: "Berry Smoothie", description: "Mixed berry blended smoothie.", price: $220, imageUrl: "/BerrySmoothie.jpeg", displayOrder: 1 },
        { name: "Mango Smoothie", description: "Fresh mango smoothie.", price: $220, imageUrl: "/MangoSmoothie.jpeg", displayOrder: 2 },
        { name: "Mango Banana Fruit Punch", description: "Mango and banana fruit blend.", price: $200, imageUrl: "/MangoBananaFP.jpeg", displayOrder: 3 },
        { name: "Chocolate Milkshake", description: "Rich chocolate milkshake.", price: $250, imageUrl: "/ChocolateMilkshake.jpeg", displayOrder: 4 },
        { name: "Mango Milkshake", description: "Creamy mango milkshake.", price: $250, imageUrl: "/MangoMilkshake.jpeg", displayOrder: 5 },
        { name: "Strawberry Milkshake", description: "Sweet strawberry milkshake.", price: $250, imageUrl: "/StrawberryMilkshake.jpeg", displayOrder: 6 },
        { name: "Vanilla Milkshake", description: "Classic vanilla milkshake.", price: $240, imageUrl: "/VanillaMilkshake.jpeg", displayOrder: 7 },
      ],
    },
    {
      name: "Food",
      description: "Hearty burgers, pasta, pizza, and sides.",
      order: 5,
      items: [
        { name: "Classic Burger", description: "Juicy beef burger with fresh toppings.", price: $450, imageUrl: "/burger.jpg", displayOrder: 1 },
        { name: "Margherita Pizza", description: "Cheesy pizza with tomato and basil.", price: 550, imageUrl: "/pizza.jpg", displayOrder: 2 },
        { name: "Club Sandwich", description: "Triple-layer sandwich with fillings.", price: $380, imageUrl: "/sandwich.jpg", displayOrder: 3 },
        { name: "Classic Sandwich", description: "Simple and satisfying sandwich.", price: $350, imageUrl: "/classic-sandwich.png", displayOrder: 4 },
        { name: "Cheese Pasta", description: "Creamy cheese pasta bowl.", price: $420, imageUrl: "/cheese pasta.jpg", displayOrder: 5 },
        { name: "French Fries", description: "Crispy golden french fries.", price: $280, imageUrl: "/vecteezy_ai-generated-a-plate-of-crispy-golden-french-fries-at-a_39655174.jpg", displayOrder: 6 },
      ],
    },
    {
      name: "Desserts & Bakery",
      description: "Sweet treats and fresh baked goods.",
      order: 6,
      items: [
        { name: "Chocolate Brownie", description: "Fudgy chocolate brownie.", price: $180, imageUrl: "/brownie.jpeg", displayOrder: 1 },
        { name: "Butter Croissant", description: "Flaky buttery croissant.", price: $150, imageUrl: "/croissant.jpeg", displayOrder: 2 },
        { name: "Pastry Croissant", description: "Sweet pastry-style croissant.", price: $160, imageUrl: "/pastry-croissant.jpg", displayOrder: 3 },
        { name: "Chocolate Cookie", description: "Soft baked chocolate cookie.", price: $120, imageUrl: "/Cookie.jpeg", displayOrder: 4 },
        { name: "Glazed Donut", description: "Classic glazed donut.", price: $140, imageUrl: "/Donut.jpeg", displayOrder: 5 },
        { name: "Blueberry Muffin", description: "Fresh baked blueberry muffin.", price: $160, imageUrl: "/Muffin.jpeg", displayOrder: 6 },
      ],
    },
  ] satisfies SeedCategory[],
};

async function main() {
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.menu.deleteMany();

  const menu = await prisma.menu.create({
    data: {
      name: menuSeed.name,
      description: menuSeed.description,
      status: "active",
      categories: {
        create: menuSeed.categories.map((category) => ({
          name: category.name,
          description: category.description,
          order: category.order,
          status: "active",
          menuItems: {
            create: category.items.map((item) => ({
              name: item.name,
              description: item.description,
              price: item.price,
              imageUrl: item.imageUrl,
              displayOrder: item.displayOrder,
              isAvailable: true,
            })),
          },
        })),
      },
    },
    include: {
      categories: {
        include: {
          menuItems: true,
        },
      },
    },
  });

  const itemCount = menu.categories.reduce(
    (total, category) => total + category.menuItems.length,
    0,
  );

  console.log(`Seeded menu "${menu.name}" with ${menu.categories.length} categories and ${itemCount} items.`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
