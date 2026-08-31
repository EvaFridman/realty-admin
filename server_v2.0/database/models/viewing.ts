import {
    Model, DataTypes, type Sequelize,
    type InferAttributes, type InferCreationAttributes, type CreationOptional,
    type NonAttribute, type ForeignKey
} from "sequelize";

import type { Listing } from "./listing";

export type ViewingStatus = 'created' | 'pending approval' | 'approved' | 'rejected' | 'closed';

export class Viewing extends Model<
    InferAttributes<Viewing>,
    InferCreationAttributes<Viewing>
> {
    declare id: CreationOptional<number>;
    declare listingId: ForeignKey<Listing["id"]>;

    declare clientName: string;
    declare clientPhone: string;
    declare clientEmail: string;
    declare preferredAt: Date;
    declare comment: CreationOptional<string | null>;
    declare status: ViewingStatus;
    declare notifiedAt: CreationOptional<Date | null>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare listing?: NonAttribute<Listing>;
}

export function initViewing(sequelize: Sequelize): void {
  Viewing.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    listingId: { type: DataTypes.INTEGER, allowNull: false },
    clientName: { type: DataTypes.STRING, allowNull: false, validate: { len: [2, 50] } },
    clientPhone: { type: DataTypes.STRING(20), allowNull: false, validate: { is: /^\+[1-9]\d{1,14}$/ } },
    clientEmail: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
    preferredAt: { type: DataTypes.DATE, allowNull: false },
    comment: { type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('created', 'pending approval', 'approved', 'rejected', 'closed'), allowNull: false },
    notifiedAt: { type: DataTypes.DATE },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Viewing',
  });
};