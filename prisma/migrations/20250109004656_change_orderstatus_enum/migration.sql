/*
  Warnings:

  - The values [CONFIRMED,CANCELLED] on the enum `Order_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Order` MODIFY `status` ENUM('PENDING', 'COOKING', 'ON_DELIVERY', 'COMPLETED') NOT NULL;
