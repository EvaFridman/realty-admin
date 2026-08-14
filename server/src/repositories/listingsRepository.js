const { Listing, User, District, ListingPhoto } = require('../../database/models');
const buildListingWhere = require('../services/pure/buildListingWhere');
const { Op } = require('sequelize');

const LISTING_INCLUDES = [
  { model: User, as: 'agent', attributes: ['id', 'name', 'email', 'phone'] },
  { model: District, as: 'district' },
  { model: ListingPhoto, as: 'photos' },
];

async function findAndCountListings(filters) {
  const { page, limit, sortBy, sortOrder } = filters;

  return Listing.findAndCountAll({
    where: buildListingWhere(filters),
    include: LISTING_INCLUDES,
    order: [[sortBy, sortOrder]],
    limit,
    offset: (page - 1) * limit,
    distinct: true,
  });
}

async function findListingById(id) {
  return Listing.findByPk(id, { include: LISTING_INCLUDES });
}

async function findListingsByIds(ids) {
  return Listing.findAll({
    where: { id: { [Op.in]: ids } },
    include: LISTING_INCLUDES,
  });
}

async function createListing(data) {
  return Listing.create({ ...data, status: 'draft' });
}

async function updateListing(id, data) {
  await Listing.update(data, { where: { id } });
  return findListingById(id);
}

async function updateListingStatus(id, status, rejectionReason = null) {
  const patch = { status, rejectionReason };
  if (status === 'published') patch.publishedAt = new Date();
  await Listing.update(patch, { where: { id } });
  return findListingById(id);
}

async function deleteListing(id) {
  return Listing.destroy({ where: { id } });
}

module.exports = { findAndCountListings, findListingById, findListingsByIds, createListing, updateListing, updateListingStatus, deleteListing };