import { Op, type WhereOptions } from 'sequelize';
import type { ListingFilters } from './parseListingFilters';

export function buildListingFilter(filters: ListingFilters): WhereOptions {
    const where: WhereOptions = {};

    if (filters.dealType) where.dealType = filters.dealType;
    if (filters.propertyType) where.propertyType = filters.propertyType;
    if (filters.districtId) where.districtId = filters.districtId;
    if (filters.status) where.status = filters.status;
    if (filters.rooms) where.rooms = { [Op.in]: filters.rooms };

    if (filters.priceMin != null || filters.priceMax != null) {
        where.price = {};
        if (filters.priceMin != null) where.price[Op.gte] = filters.priceMin;
        if (filters.priceMax != null) where.price[Op.lte] = filters.priceMax;
    }

    if (filters.areaMin != null || filters.areaMax != null) {
        where.area = {};
        if (filters.areaMin != null) where.area[Op.gte] = filters.areaMin;
        if (filters.areaMax != null) where.area[Op.lte] = filters.areaMax;
    }

    if (filters.search) {
        const searchCondition: WhereOptions = {
            [Op.or]: [
                { title: { [Op.iLike]: `%${filters.search}%` } },
                { address: { [Op.iLike]: `%${filters.search}%` } },
            ],
        };
    
        Object.assign(where, searchCondition);
    }

    if (filters.latMin != null && filters.latMax != null) {
        where.lat = { [Op.between]: [filters.latMin, filters.latMax] };
    }

    if (filters.lngMin != null && filters.lngMax != null) {
        where.lng = { [Op.between]: [filters.lngMin, filters.lngMax] };
    }

    return where;
}