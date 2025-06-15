const { Destination} = require('../models');

// Create a destination
const createDestination = async (data, userId) => {
  return Destination.create({
    ...data,
    created_by: userId,
    updated_by: userId,
  });
};

// Paginated list of destinations for a given account
const paginatedDestinations = async (filter, options) => {
  const destinations = await Destination.paginate(filter, options);
  return destinations;
};

// Get single destination by ID
const getDestinationById = async (destinationId) => {
  return Destination.findByPk(destinationId);
};

// Update a destination
const updateDestination = async (destinationId, updateData) => {
  const destination = await Destination.findByPk(destinationId);
  if (!destination) {
    return null;
  }

  // Only update fields if they are provided
  if (updateData.url !== undefined) destination.url = updateData.url;
  if (updateData.httpMethod !== undefined) destination.httpMethod = updateData.httpMethod;
  if (updateData.headers !== undefined) destination.headers = updateData.headers;

  await destination.save();
  return destination;
};

// Delete a destination
const deleteDestination = async (destinationId) => {
  const destination = await Destination.findByPk(destinationId);
  if (!destination) {
    return null;
  }

  await destination.destroy();
  return destination;
};



module.exports = {
  createDestination,
  paginatedDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination
};
