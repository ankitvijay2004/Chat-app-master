/*
  Warnings:

  - You are about to drop the column `friendId` on the `Friend` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Friend` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user1Id,user2Id]` on the table `Friend` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user1Id` to the `Friend` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user2Id` to the `Friend` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_friendId_fkey";

-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_userId_fkey";

-- DropIndex
DROP INDEX "Friend_userId_friendId_key";

-- AlterTable
ALTER TABLE "Friend" DROP COLUMN "friendId",
DROP COLUMN "userId",
ADD COLUMN     "user1Id" INTEGER NOT NULL,
ADD COLUMN     "user2Id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Friend_user1Id_user2Id_key" ON "Friend"("user1Id", "user2Id");

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
