const { Sequelize, DataTypes } = require('sequelize');
const crypto = require('crypto');
const sequelize = require('../models/connection');
const paginate = require('../models/plugins/paginate.plugin');

// Define the Account model
const Account = sequelize.define('Account', {
  account_id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
account_name: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true, // <-- Add this line
  validate: {
    notEmpty: true,
    len: [2, 100]
  }
},

  app_secret_token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: () => crypto.randomBytes(16).toString('hex')
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'suspended', 'deleted']]
    }
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  updated_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  tableName: 'accounts',
  timestamps: true,
  paranoid: true,
  hooks: {
    beforeValidate: (account) => {
      if (account.isNewRecord && !account.updated_by) {
        account.updated_by = account.created_by;
      }
    },
    beforeUpdate: (account) => {
      if (account.changed() && account._updatedBy) {
        account.updated_by = account._updatedBy;
      }
    }
    // Removed the faulty `beforeCreate` hook
  },
  defaultScope: {
    attributes: { exclude: ['app_secret_token'] }
  },
  scopes: {
    withSecret: {
      attributes: {} // Include all
    }
  }
});

// Associations
Account.belongsTo(sequelize.models.User, {
  as: 'creator',
  foreignKey: 'created_by',
  constraints: false
});

Account.belongsTo(sequelize.models.User, {
  as: 'updater',
  foreignKey: 'updated_by',
  constraints: false
});

// Instance method to regenerate the token
Account.prototype.regenerateSecretToken = function () {
  this.app_secret_token = crypto.randomBytes(16).toString('hex');
  return this.save();
};

// Add pagination plugin
paginate(Account);

// Sync model
sequelize.sync({ force: false })
  .then(() => console.log('✅ Account model synced with database'))
  .catch(error => console.error('❌ Error syncing Account model:', error));

module.exports = Account;
