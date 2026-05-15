/*
  Warnings:

  - You are about to drop the column `code` on the `product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[prefix]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `prefix` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Product_code_key` ON `product`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `code`,
    ADD COLUMN `prefix` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Product_prefix_key` ON `Product`(`prefix`);
