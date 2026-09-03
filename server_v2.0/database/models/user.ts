import {
    Model, DataTypes, type Sequelize,
    type InferAttributes, type InferCreationAttributes, type CreationOptional,
    type NonAttribute, type HasManyGetAssociationsMixin,
} from "sequelize";

import type { Listing } from "./listing";

export type UserRole = 'agent' | 'moderator';

export const USER_ROLES = {
    AGENT: 'agent',
    MODERATOR: 'moderator',
} as const;

export type AuthUser = {
    id: number;
    role: UserRole;
};

export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare email: string;
    declare phone: string | null;
    declare role: CreationOptional<UserRole>;
    declare passwordHash: CreationOptional<string>;
    declare avatarFileName: string | null;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare listings?: NonAttribute<Listing[]>;
    declare favorites?: NonAttribute<Listing[]>;

    declare getListings: HasManyGetAssociationsMixin<Listing>;
}

export function initUser(sequelize: Sequelize): void {
    User.init(
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            name: { type: DataTypes.STRING, allowNull: false, validate: { len: [2, 50] } },
            email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
            phone: { type: DataTypes.STRING(20), unique: true, validate: { is: /^\+[1-9]\d{1,14}$/ } },
            role: { type: DataTypes.ENUM('agent', 'moderator'), allowNull: false, defaultValue: 'agent' },
            passwordHash: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
            avatarFileName: { type: DataTypes.STRING, allowNull: true },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "User",
            defaultScope: { attributes: { exclude: ['passwordHash'] } },
        }
    );
}