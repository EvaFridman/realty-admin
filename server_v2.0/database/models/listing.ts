import {
    Model, DataTypes, type Sequelize,
    type InferAttributes, type InferCreationAttributes, type CreationOptional,
    type NonAttribute, type ForeignKey, type HasManyGetAssociationsMixin,
} from "sequelize";

import type { User } from "./user";
import type { District } from "./district";
import type { ListingPhoto } from "./listingphoto";

export type ListingStatus = "draft" | "moderation" | "published" | "rejected" | "unpublished";

export type ListingDealType = "sale" | "rent";

export type ListingPropertyType = "flat" | "house" | "room" | "commercial";

export class Listing extends Model<
    InferAttributes<Listing>,
    InferCreationAttributes<Listing>
> {
    declare id: CreationOptional<number>;
    declare agentId: ForeignKey<User["id"]>;
    declare districtId: ForeignKey<District["id"]>;

    declare title: string;
    declare description: string | null;
    declare dealType: ListingDealType;
    declare propertyType: ListingPropertyType;
    declare price: string | number;
    declare area: string | number;
    declare rooms: number | null;
    declare floor: number | null;
    declare totalFloors: number | null;
    declare address: string;
    declare lat: string | number;
    declare lng: string | number;
    declare status: ListingStatus;
    declare rejectionReason: string | null;
    declare publishedAt: Date | null;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare photos?: NonAttribute<ListingPhoto[]>;
    declare agent?: NonAttribute<User>;
    declare district?: NonAttribute<District>;

    declare getPhotos: HasManyGetAssociationsMixin<ListingPhoto>;
}

export function initListing(sequelize: Sequelize): void {
    Listing.init(
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            agentId: { type: DataTypes.INTEGER, allowNull: false },
            districtId: { type: DataTypes.INTEGER, allowNull: false },
            title: { type: DataTypes.STRING, allowNull: false },
            description: { type: DataTypes.TEXT, allowNull: true },
            dealType: { type: DataTypes.ENUM("sale", "rent"), allowNull: false },
            propertyType: {
                type: DataTypes.ENUM("flat", "house", "room", "commercial"),
                allowNull: false,
            },
            price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
            area: { type: DataTypes.DECIMAL(6, 2), allowNull: false },
            rooms: { type: DataTypes.INTEGER, allowNull: true },
            floor: { type: DataTypes.INTEGER, allowNull: true },
            totalFloors: { type: DataTypes.INTEGER, allowNull: true },
            address: { type: DataTypes.TEXT, allowNull: false },
            lat: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
            lng: { type: DataTypes.DECIMAL(9, 6), allowNull: false },
            status: {
                type: DataTypes.ENUM("draft", "moderation", "published", "rejected", "unpublished"),
                allowNull: false,
            },
            rejectionReason: { type: DataTypes.TEXT, allowNull: true },
            publishedAt: { type: DataTypes.DATE, allowNull: true },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        { sequelize, modelName: "Listing" }
    );
}