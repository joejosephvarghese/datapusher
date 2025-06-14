const { Destination } = require('../models');


const createDestination = async (data, userId) => {
  return Destination.create({
    ...data,
    created_by: userId,
    updated_by: userId
  });
};

module.exports={
    createDestination
}
