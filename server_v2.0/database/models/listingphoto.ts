import {
    Model, DataTypes, type Sequelize,
    type InferAttributes, type InferCreationAttributes, type CreationOptional,
    type NonAttribute, type ForeignKey,
} from "sequelize";

import type { Listing } from "./listing";

export class ListingPhoto extends Model<
    InferAttributes<ListingPhoto>,
    InferCreationAttributes<ListingPhoto>
> {
    declare id: CreationOptional<number>;
    declare listingId: ForeignKey<Listing["id"]>;
    
    declare externalUrl: string | null;
    declare position: CreationOptional<number | null>;
    declare isCover: CreationOptional<boolean | null>;
    declare fileName: string | null;
    declare sizeBytes: number | null;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare listing?: NonAttribute<Listing>;
}

export function initListingPhoto(sequelize: Sequelize): void {
    ListingPhoto.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        listingId: { type: DataTypes.INTEGER, allowNull: false },
        externalUrl: { type: DataTypes.STRING, allowNull: true },
        position: { type: DataTypes.INTEGER },
        isCover: { type: DataTypes.BOOLEAN },
        fileName: { type: DataTypes.STRING, allowNull: true },
        sizeBytes: { type: DataTypes.INTEGER, allowNull: true },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'ListingPhoto',
        tableName: 'ListingPhotos',
        validate: {
            hasExactlyOneSource() {
                const hasExternal = !!this.externalUrl;
                const hasFile = !!this.fileName;
                if ((hasExternal && hasFile) || (!hasExternal && !hasFile)) {
                    throw new Error('Exactly one of two fields must be filled in: either ExternalURL or fileName');
                }
            }
        }
    });
}