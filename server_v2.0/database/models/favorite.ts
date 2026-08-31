import {
    Model, DataTypes, type Sequelize,
    type InferAttributes, type InferCreationAttributes, type CreationOptional,
    type NonAttribute, type ForeignKey,
} from "sequelize";

import type { Listing } from "./listing";
import type { User } from "./user";


export class Favorite extends Model<
    InferAttributes<Favorite>,
    InferCreationAttributes<Favorite>
> {
    declare id: CreationOptional<number>;
    declare userId: ForeignKey<User["id"]>;
    declare listingId: ForeignKey<Listing["id"]>;
    declare note: CreationOptional<string | null>;
    declare addedAt: CreationOptional<Date>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare listing?: NonAttribute<Listing>;
    declare user?: NonAttribute<User>;
}

export function initFavorite(sequelize: Sequelize): void {
    Favorite.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        listingId: { type: DataTypes.INTEGER, allowNull: false },
        note: { type: DataTypes.TEXT },
        addedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'Favorite',
        tableName: 'Favorites'
    });
};