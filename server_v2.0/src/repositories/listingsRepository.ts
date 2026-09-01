import { Op } from "sequelize";
import type { ListingStatus, Listing } from "../../database/models/listing";
import { db } from "../../database/models";
import { buildListingFilter } from "../utils/buildListingFilter";
import type { ListingFilters } from "../utils/parseListingFilters";
import type { CreateListingBody, UpdateListingBody } from "../schemas/listingsSchema";

const LISTING_INCLUDES = [
  { model: db.User, as: 'agent', attributes: ['id', 'name', 'email', 'phone'] },
  { model: db.District, as: 'district' },
  { model: db.ListingPhoto, as: 'photos' },
];

export async function findAndCountListings(filters: ListingFilters): Promise<{ rows: Listing[]; count: number }> {
  const { page, limit, sortBy, sortOrder } = filters;

  return db.Listing.findAndCountAll({
    where: buildListingFilter(filters),
    include: LISTING_INCLUDES,
    order: [[sortBy, sortOrder]],
    limit,
    offset: (page - 1) * limit,
    distinct: true,
  });
}

export async function findListingById(id: number): Promise<Listing | null> {
  return db.Listing.findByPk(id, { include: LISTING_INCLUDES });
}

export async function findListingsByIds(ids: number[]): Promise<Listing[]> {
  return db.Listing.findAll({
    where: { id: { [Op.in]: ids } },
    include: LISTING_INCLUDES,
  });
}

export async function createListing(data: CreateListingBody): Promise<Listing> {
  return db.Listing.create({ ...data, status: 'draft' });
}

export async function updateListing(id: number, data: UpdateListingBody): Promise<Listing | null> {
  await db.Listing.update(data, { where: { id } });
  return findListingById(id);
}

export async function updateListingStatus(id: number, status: ListingStatus, rejectionReason: string | null = null): Promise<Listing | null> {
  const patch: { status: ListingStatus; rejectionReason: string | null; publishedAt?: Date } = { status, rejectionReason };

  if (status === "published") patch.publishedAt = new Date();

  await db.Listing.update(patch, { where: { id } });

  return findListingById(id);
}

export async function deleteListing(id: number): Promise<number> {
  return db.Listing.destroy({ where: { id } });
}