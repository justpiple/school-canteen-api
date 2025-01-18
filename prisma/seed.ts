import { PrismaClient, Role, MenuType, OrderStatus } from "@prisma/client";
import { faker } from "@faker-js/faker/locale/id_ID";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();
const SALT_ROUNDS = 11;

cloudinary.config({
  secure: true,
});

async function uploadToCloudinary(
  imageUrl: string,
  folder: string,
): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: folder,
      resource_type: "image",
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });
    console.log(`Uploaded image to Cloudinary: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return imageUrl;
  }
}

const foodItems = [
  {
    name: "Nasi Goreng Spesial",
    description: "Nasi goreng dengan telur, ayam, dan sayuran segar",
    price: 15000,
    type: MenuType.FOOD,
  },
  {
    name: "Mie Goreng Jawa",
    description: "Mie goreng dengan bumbu Jawa autentik",
    price: 13000,
    type: MenuType.FOOD,
  },
  {
    name: "Ayam Geprek",
    description: "Ayam geprek dengan sambal level 1-5",
    price: 18000,
    type: MenuType.FOOD,
  },
  {
    name: "Gado-gado",
    description: "Sayuran segar dengan bumbu kacang",
    price: 12000,
    type: MenuType.FOOD,
  },
  {
    name: "Soto Ayam",
    description: "Soto ayam kuah bening dengan ayam suwir dan telur",
    price: 14000,
    type: MenuType.FOOD,
  },
  {
    name: "Nasi Uduk",
    description: "Nasi uduk komplit dengan ayam goreng dan tempe orek",
    price: 16000,
    type: MenuType.FOOD,
  },
  {
    name: "Bakso Malang",
    description: "Bakso dengan pentol besar, pangsit, dan mie kuning",
    price: 15000,
    type: MenuType.FOOD,
  },
  {
    name: "Mie Ayam",
    description: "Mie ayam dengan topping ayam cincang dan pangsit",
    price: 13000,
    type: MenuType.FOOD,
  },
];

const drinkItems = [
  {
    name: "Es Teh Manis",
    description: "Teh manis dingin segar",
    price: 3000,
    type: MenuType.DRINK,
  },
  {
    name: "Es Jeruk",
    description: "Jeruk peras segar dengan es",
    price: 4000,
    type: MenuType.DRINK,
  },
  {
    name: "Jus Alpukat",
    description: "Jus alpukat segar dengan susu",
    price: 8000,
    type: MenuType.DRINK,
  },
  {
    name: "Es Kopi Susu",
    description: "Kopi susu dengan gula aren dan es batu",
    price: 8000,
    type: MenuType.DRINK,
  },
  {
    name: "Jus Mangga",
    description: "Jus mangga segar dengan potongan mangga",
    price: 7000,
    type: MenuType.DRINK,
  },
  {
    name: "Es Campur",
    description: "Es campur dengan berbagai macam topping",
    price: 10000,
    type: MenuType.DRINK,
  },
];

const standNames = [
  "Warung Berkah",
  "Kantin Sejahtera",
  "Warung Bu Siti",
  "Dapur Mama",
  "Kedai Barokah",
];

async function main() {
  console.log("Starting database seeding...");

  console.log("Clearing existing data...");
  await prisma.$transaction([
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.discount.deleteMany(),
    prisma.menu.deleteMany(),
    prisma.stand.deleteMany(),
    prisma.student.deleteMany(),
    prisma.user.deleteMany(),
  ]);
  console.log("Existing data cleared.");

  console.log("Creating superadmin user...");
  const superadminPassword = await bcrypt.hash("superadmin123", SALT_ROUNDS);
  await prisma.user.create({
    data: {
      username: "superadmin",
      password: superadminPassword,
      role: Role.SUPERADMIN,
    },
  });
  console.log("Superadmin user created.");

  console.log("Creating student users...");
  const studentCount = 20;
  const studentUsers = [];
  const studentDetails = [];

  for (let i = 0; i < studentCount; i++) {
    const name = faker.person.fullName();
    const username = faker.internet
      .username({ firstName: name.split(" ")[0] })
      .toLowerCase();
    const password = await bcrypt.hash("student123", SALT_ROUNDS);
    const avatarUrl = faker.image.avatar();
    const cloudinaryUrl = await uploadToCloudinary(
      avatarUrl,
      "student-avatars",
    );

    studentUsers.push({
      username,
      password,
      role: Role.STUDENT,
    });

    studentDetails.push({
      name,
      address: faker.location.streetAddress(true),
      phone: faker.phone.number({ style: "international" }),
      photo: cloudinaryUrl,
    });
  }

  await prisma.user.createMany({ data: studentUsers });
  const dbStudentUsers = await prisma.user.findMany({
    where: { role: Role.STUDENT },
  });

  await prisma.student.createMany({
    data: studentDetails.map((student, index) => ({
      ...student,
      userId: dbStudentUsers[index].id,
    })),
  });
  console.log("Student users created.");

  console.log("Creating stands and their menus...");
  for (const standName of standNames) {
    const name = faker.person.fullName();
    const username = faker.internet
      .username({ firstName: name.split(" ")[0] })
      .toLowerCase();
    const password = await bcrypt.hash("standadmin123", SALT_ROUNDS);
    const standNumber = faker.number.int({ max: 200 });

    await prisma.user.create({
      data: {
        username,
        password,
        role: Role.ADMIN_STAND,
        stand: {
          create: {
            id: standNumber,
            standName,
            ownerName: name,
            phone: faker.phone.number({ style: "international" }),
            createdAt: faker.date.past({ years: 1 }),
            updatedAt: faker.date.recent(),
          },
        },
      },
    });

    const menuItems = [];
    for (const item of [...foodItems, ...drinkItems]) {
      if (Math.random() > 0.3) {
        const imageUrl =
          item.type === MenuType.FOOD
            ? "https://res.cloudinary.com/projectsben/image/upload/v1737195791/rskdhxsjau7abd2ee6ng.jpg"
            : "https://res.cloudinary.com/projectsben/image/upload/v1737195818/gqno6qlewtaqvdr4hkzy.jpg";

        menuItems.push({
          ...item,
          photo: imageUrl,
          standId: standNumber,
          createdAt: faker.date.past({ years: 1 }),
          updatedAt: faker.date.recent(),
        });
      }
    }

    await prisma.menu.createMany({ data: menuItems });

    const createdMenus = await prisma.menu.findMany({
      where: { standId: standNumber },
    });

    const discountCount = faker.number.int({ min: 1, max: 4 });

    for (let i = 0; i < discountCount; i++) {
      const startDate = faker.date.recent({ days: 30 });
      const endDate = new Date(startDate);
      endDate.setDate(
        endDate.getDate() + faker.number.int({ min: 7, max: 60 }),
      );

      await prisma.discount.create({
        data: {
          standId: standNumber,
          name: faker.helpers.arrayElement([
            "Flash Sale",
            "Happy Hour",
            "Weekday Special",
            "Student Discount",
            "New Menu Promo",
            "Lunch Break Deal",
            "Happy Break",
          ]),
          percentage: faker.number.int({ min: 5, max: 40 }),
          startDate,
          endDate,
          menus: {
            connect: faker.helpers
              .arrayElements(
                createdMenus,
                faker.number.int({ min: 1, max: createdMenus.length }),
              )
              .map((menu) => ({ id: menu.id })),
          },
        },
      });
    }

    console.log(`Stand "${standName}" created with menus and discounts.`);
  }

  console.log("Creating orders...");
  const students = await prisma.user.findMany({
    where: { role: Role.STUDENT },
    include: { student: true },
  });

  const stands = await prisma.stand.findMany({
    include: { menus: true },
  });

  const orderCount = 600;
  const orders = [];
  const orderItems = [];

  for (let i = 0; i < orderCount; i++) {
    const student = faker.helpers.arrayElement(students);
    const stand = faker.helpers.arrayElement(stands);
    const orderDate = faker.date.recent({ days: 360 });

    orders.push({
      id: i + 1,
      userId: student.id,
      standId: stand.id,
      status: faker.helpers.arrayElement(Object.values(OrderStatus)),
      createdAt: orderDate,
      updatedAt: orderDate,
    });

    const itemCount = faker.number.int({ min: 1, max: 4 });
    const selectedMenus = faker.helpers.arrayElements(stand.menus, itemCount);

    selectedMenus.forEach((menu) => {
      const quantity = faker.number.int({ min: 1, max: 4 });
      orderItems.push({
        orderId: i + 1,
        menuId: menu.id,
        menuName: menu.name,
        quantity,
        price: menu.price * quantity,
      });
    });
  }

  await prisma.order.createMany({ data: orders });
  await prisma.orderItem.createMany({ data: orderItems });
  console.log("Orders created.");

  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
