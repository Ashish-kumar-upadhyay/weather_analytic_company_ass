const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ApiHit = sequelize.define(
  "ApiHit",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    endpoint: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Which weather endpoint was called (current, forecast, search)",
    },
    hit_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "api_hits",
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ["user_id", "hit_at"],
        name: "idx_user_hit_time",
      },
      {
        fields: ["hit_at"],
        name: "idx_hit_time",
      },
    ],
  }
);

module.exports = ApiHit;
