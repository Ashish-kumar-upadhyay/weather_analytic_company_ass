const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const UserLimit = sequelize.define(
  "UserLimit",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    daily_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      validate: {
        min: 0,
      },
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: "Admin user_id who last updated this limit",
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "user_limits",
    timestamps: true,
    underscored: true,
  }
);

module.exports = UserLimit;
