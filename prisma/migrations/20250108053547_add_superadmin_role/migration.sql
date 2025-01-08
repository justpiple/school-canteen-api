-- DropForeignKey
ALTER TABLE `Stand` DROP FOREIGN KEY `Stand_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `Student` DROP FOREIGN KEY `Student_userId_fkey`;

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('STUDENT', 'ADMIN_STAND', 'SUPERADMIN') NOT NULL;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stand` ADD CONSTRAINT `Stand_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
