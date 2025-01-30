import { Prisma } from "@prisma/client";
import { join } from "path";

type OrderWithDetails = Prisma.OrderGetPayload<{
  include: {
    items: { include: { menu: { select: { name: true } } } };
    user: { select: { student: { select: { name: true } } } };
    stand: { select: { standName: true } };
  };
}>;

export function generateHeader(doc: PDFKit.PDFDocument): void {
  doc
    .image(join(process.cwd(), "src/static/logo.png"), 50, 40, {
      width: 50,
    })
    .fillColor("#444444")
    .fontSize(20)
    .text("School Canteen", 110, 50)
    .fontSize(12)
    .text("Struk Pembelian", 110, 75)
    .moveDown()
    .strokeColor("#444444")
    .lineWidth(1)
    .moveTo(50, 120)
    .lineTo(550, 120)
    .stroke();
}

export function generateOrderDetails(
  doc: PDFKit.PDFDocument,
  order: OrderWithDetails,
): void {
  const orderDate = new Date(order.createdAt).toLocaleString("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const details = [
    ["No. Pesanan", `: ${order.id}`],
    ["Tanggal", `: ${orderDate}`],
    ["Siswa", `: ${order.user.student.name}`],
    ["Stand", `: ${order.stand.standName}`],
  ];

  doc.moveDown(1).font("Helvetica").fontSize(10).fillColor("#000000");

  details.forEach(([key, value], idx) => {
    doc
      .text(key, 50, 130 + idx * 15, { width: 100 })
      .text(value, 150, 130 + idx * 15);
  });

  doc
    .moveDown()
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, 200)
    .lineTo(550, 200)
    .stroke();
}

export function generateItemsTable(
  doc: PDFKit.PDFDocument,
  order: OrderWithDetails,
): void {
  const tableTop = 220;

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Item", 50, tableTop)
    .text("Qty", 200, tableTop, { width: 90, align: "right" })
    .text("Harga", 300, tableTop, { width: 90, align: "right" })
    .text("Total", 400, tableTop, { width: 90, align: "right" });

  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, tableTop + 15)
    .lineTo(550, tableTop + 15)
    .stroke();

  let total = 0;
  order.items.forEach((item, idx) => {
    const position = tableTop + 30 + idx * 20;
    const itemTotal = item.price;
    total += itemTotal;

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(item.menuName, 50, position)
      .text(item.quantity.toString(), 200, position, {
        width: 90,
        align: "right",
      })
      .text(formatCurrency(itemTotal / item.quantity), 300, position, {
        width: 90,
        align: "right",
      })
      .text(formatCurrency(itemTotal), 400, position, {
        width: 90,
        align: "right",
      });
  });

  const totalPosition = tableTop + 30 + order.items.length * 20;
  doc
    .font("Helvetica-Bold")
    .text("Total Pembayaran", 300, totalPosition, { width: 90, align: "right" })
    .text(formatCurrency(total), 400, totalPosition, {
      width: 90,
      align: "right",
    });
}

export function generateFooter(doc: PDFKit.PDFDocument): void {
  doc
    .fontSize(10)
    .text("Terima kasih telah berbelanja di Kantin Sekolah.", 50, doc.y + 30, {
      align: "center",
      width: 500,
    })
    .moveDown(0.3)
    .text("Simpan struk ini sebagai bukti pembelian.", {
      align: "center",
      width: 500,
    });
}

function formatCurrency(value: number): string {
  return "Rp " + value.toLocaleString("id-ID", { minimumFractionDigits: 2 });
}
