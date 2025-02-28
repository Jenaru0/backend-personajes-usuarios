/*
  Warnings:

  - The primary key for the `Personaje` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `flag` on the `Personaje` table. All the data in the column will be lost.
  - You are about to alter the column `nombre` on the `Personaje` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - Added the required column `userId` to the `Personaje` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'REGULAR');

-- AlterTable
ALTER TABLE "Personaje" DROP CONSTRAINT "Personaje_pkey",
DROP COLUMN "flag",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(100),
ADD CONSTRAINT "Personaje_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Personaje_id_seq";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "correo" TEXT NOT NULL,
    "contraseña" TEXT NOT NULL,
    "rol" "Role" NOT NULL DEFAULT 'REGULAR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_correo_key" ON "User"("correo");

-- AddForeignKey
ALTER TABLE "Personaje" ADD CONSTRAINT "Personaje_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
