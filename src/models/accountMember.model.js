const { DataTypes } = require("sequelize");
const sequelize = require("../models/connection");
const paginate = require("../models/plugins/paginate.plugin");

const AccountMember = sequelize.define(
  "AccountMember",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    account_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "accounts", // matches tableName in Account model
        key: "account_id",
      },
      onDelete: "CASCADE",
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users", // matches model name in User definition
        key: "id",
      },
      onDelete: "CASCADE",
    },

    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "account_members",
    timestamps: true,
  }
);

// Associations (optional but useful for Sequelize include queries)
AccountMember.associate = (models) => {
  AccountMember.belongsTo(models.Account, { foreignKey: "account_id" });
  AccountMember.belongsTo(models.User, { foreignKey: "user_id" });
};
paginate(AccountMember);
module.exports = AccountMember;
