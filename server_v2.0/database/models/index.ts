import process from "process";
import { Sequelize } from "sequelize";
import configJson from "../config/config.json";

import { initUser, User } from "./user";
import { initDistrict, District } from "./district";
import { initListing, Listing } from "./listing";
import { initListingPhoto, ListingPhoto } from "./listingphoto";
import { initFavorite, Favorite } from "./favorite";
import { initViewing, Viewing } from "./viewing";

const env = (process.env.NODE_ENV ?? "development") as keyof typeof configJson;
export const sequelize = new Sequelize({ ...configJson[env], dialect: "postgres" as const });

initUser(sequelize);
initDistrict(sequelize);
initListing(sequelize);
initListingPhoto(sequelize);
initFavorite(sequelize);
initViewing(sequelize);

User.hasMany(Listing, { foreignKey: "agentId", as: "listings" });
Listing.belongsTo(User, { foreignKey: "agentId", as: "agent" });

District.hasMany(Listing, { foreignKey: "districtId", as: "listings" });
Listing.belongsTo(District, { foreignKey: "districtId", as: "district" });

Listing.hasMany(ListingPhoto, { foreignKey: "listingId", as: "photos" });
ListingPhoto.belongsTo(Listing, { foreignKey: "listingId", as: "listing" });

Listing.hasMany(Viewing, { foreignKey: "listingId", as: "viewings" });
Viewing.belongsTo(Listing, { foreignKey: "listingId", as: "listing" });

User.belongsToMany(Listing, {
    through: Favorite,
    foreignKey: "userId",
    otherKey: "listingId",
    as: "favorites",
});
Listing.belongsToMany(User, {
    through: Favorite,
    foreignKey: "listingId",
    otherKey: "userId",
    as: "favoredBy",
});

Favorite.belongsTo(User, { foreignKey: "userId", as: "user" });
Favorite.belongsTo(Listing, { foreignKey: "listingId", as: "listing" });

export const db = { sequelize, Sequelize, User, District, Listing, ListingPhoto, Favorite, Viewing };

export default db;