const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../models/connection");
const paginate = require("../models/plugins/paginate.plugin");

// Define the Destination model
const Destination = sequelize.define(
  "Destination",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    account_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "accounts", // Make sure this matches your tableName in Account
        key: "account_id",
      },
      onDelete: "CASCADE",
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    httpMethod: {
      type: DataTypes.ENUM({
        values: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        name: "destination_http_method_enum", // Unique and safe name
      }),
      allowNull: false,
      defaultValue: "POST",
    },

    headers: {
      type: DataTypes.JSONB, // PostgreSQL optimized; use DataTypes.JSON for other DBs
      allowNull: false,
      defaultValue: {},
      validate: {
        isObject(value) {
          if (typeof value !== "object" || Array.isArray(value)) {
            throw new Error("Headers must be a JSON object");
          }
        },
      },
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "SET NULL",
    },
  },
  {
    tableName: "destinations",
    timestamps: true,
    hooks: {
      beforeValidate: (destination) => {
        if (destination.isNewRecord && !destination.updated_by) {
          destination.updated_by = destination.created_by;
        }
      },
      beforeUpdate: (destination) => {
        if (destination.changed() && destination._updatedBy) {
          destination.updated_by = destination._updatedBy;
        }
      },
    },
  }
);

// Associations
Destination.belongsTo(sequelize.models.Account, {
  foreignKey: "account_id",
  as: "account",
});

Destination.belongsTo(sequelize.models.User, {
  as: "creator",
  foreignKey: "created_by",
  constraints: false,
});

Destination.belongsTo(sequelize.models.User, {
  as: "updater",
  foreignKey: "updated_by",
  constraints: false,
});

// Add pagination plugin
paginate(Destination);

// Sync model
sequelize
  .sync({ force: false })
  .then(() => console.log("✅ Destination model synced with database"))
  .catch((error) =>
    console.error("❌ Error syncing Destination model:", error)
  );

module.exports = Destination;
