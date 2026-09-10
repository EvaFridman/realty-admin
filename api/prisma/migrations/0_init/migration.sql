-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('agent', 'moderator');

-- CreateEnum
CREATE TYPE "DealType" AS ENUM ('sale', 'rent');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('flat', 'house', 'room', 'commercial');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('draft', 'moderation', 'published', 'rejected', 'unpublished');

-- CreateEnum
CREATE TYPE "ViewingStatus" AS ENUM ('created', 'pending approval', 'approved', 'rejected', 'closed');

-- CreateTable
CREATE TABLE "Districts" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "role" "UserRole" NOT NULL DEFAULT 'agent',
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL DEFAULT '',
    "avatarFileName" VARCHAR(255),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listings" (
    "id" SERIAL NOT NULL,
    "agentId" INTEGER NOT NULL,
    "districtId" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "dealType" "DealType" NOT NULL,
    "propertyType" "PropertyType" NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "area" DECIMAL(6,2) NOT NULL,
    "rooms" INTEGER,
    "floor" INTEGER,
    "totalFloors" INTEGER,
    "address" TEXT NOT NULL,
    "lat" DECIMAL(9,6) NOT NULL,
    "lng" DECIMAL(9,6) NOT NULL,
    "status" "ListingStatus" NOT NULL,
    "rejectionReason" TEXT,
    "publishedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingPhotos" (
    "id" SERIAL NOT NULL,
    "listingId" INTEGER NOT NULL,
    "externalUrl" VARCHAR(255) DEFAULT '',
    "position" INTEGER,
    "isCover" BOOLEAN,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "fileName" VARCHAR(255),
    "sizeBytes" INTEGER,

    CONSTRAINT "ListingPhotos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Viewings" (
    "id" SERIAL NOT NULL,
    "listingId" INTEGER,
    "clientName" VARCHAR(255) NOT NULL,
    "clientPhone" VARCHAR(20) NOT NULL,
    "clientEmail" VARCHAR(255) NOT NULL,
    "preferredAt" TIMESTAMPTZ(6) NOT NULL,
    "comment" TEXT,
    "status" "ViewingStatus" NOT NULL,
    "notifiedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Viewings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorites" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "listingId" INTEGER NOT NULL,
    "note" TEXT,
    "addedAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Districts_slug_key" ON "Districts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "Users"("phone");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "Users"("role");

-- CreateIndex
CREATE INDEX "listings_agent_id_idx" ON "Listings"("agentId");

-- CreateIndex
CREATE INDEX "listings_district_id_idx" ON "Listings"("districtId");

-- CreateIndex
CREATE INDEX "listings_filter_idx" ON "Listings"("dealType", "propertyType", "price");

-- CreateIndex
CREATE INDEX "listings_lat_lng_idx" ON "Listings"("lat", "lng");

-- CreateIndex
CREATE INDEX "listings_published_partial_idx" ON "Listings"("status") WHERE (status = 'published');

-- CreateIndex
CREATE INDEX "listingPhotos_listingId_idx" ON "ListingPhotos"("listingId");

-- CreateIndex
CREATE INDEX "viewings_listingId_idx" ON "Viewings"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_listingId_unique_idx" ON "Favorites"("userId", "listingId");

-- AddForeignKey
ALTER TABLE "Listings" ADD CONSTRAINT "Listings_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Listings" ADD CONSTRAINT "Listings_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "Districts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ListingPhotos" ADD CONSTRAINT "ListingPhotos_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listings"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Viewings" ADD CONSTRAINT "Viewings_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listings"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listings"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

