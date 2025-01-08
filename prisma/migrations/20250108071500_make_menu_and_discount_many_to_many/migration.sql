/*
  Warnings:

  - You are about to drop the column `discountId` on the `Menu` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Menu` DROP FOREIGN KEY `Menu_discountId_fkey`;

-- DropIndex
DROP INDEX `Menu_discountId_fkey` ON `Menu`;

-- AlterTable
ALTER TABLE `Menu` DROP COLUMN `discountId`;

-- CreateTable
CREATE TABLE `_DiscountToMenu` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DiscountToMenu_AB_unique`(`A`, `B`),
    INDEX `_DiscountToMenu_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_DiscountToMenu` ADD CONSTRAINT `_DiscountToMenu_A_fkey` FOREIGN KEY (`A`) REFERENCES `Discount`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiscountToMenu` ADD CONSTRAINT `_DiscountToMenu_B_fkey` FOREIGN KEY (`B`) REFERENCES `Menu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
