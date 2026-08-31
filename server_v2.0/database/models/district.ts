import {
    Model, DataTypes, type Sequelize,
    type InferAttributes, type InferCreationAttributes, type CreationOptional,
    type NonAttribute,
} from "sequelize";

import type { Listing } from "./listing";

export class District extends Model<
    InferAttributes<District>,
    InferCreationAttributes<District>
> {
    declare id: CreationOptional<number>;
    declare title: string;
    declare slug: string;
    declare city: string;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare listings?: NonAttribute<Listing[]>;
}

export function initDistrict(sequelize: Sequelize): void {
    District.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.STRING, allowNull: false },
        slug: { type: DataTypes.STRING, allowNull: false, unique: true },
        city: { type: DataTypes.STRING, allowNull: false },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'District',
    });
}