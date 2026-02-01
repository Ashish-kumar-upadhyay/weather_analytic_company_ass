const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const AppConfig = sequelize.define(
  "AppConfig",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Config key name",
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Config value (stored as string, parsed by app)",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Human-readable description of this setting",
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "app_config",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['key'],
        name: 'app_config_key_unique'
      }
    ]
  }
);

module.exports = AppConfig;
