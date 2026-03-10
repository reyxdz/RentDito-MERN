const Room = require('../models/Room');
const Property = require('../models/Property');

exports.getRoomsByProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Verify property exists and user has access
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const rooms = await Room.find({ propertyId })
      .populate('currentTenant', 'fullName email phone')
      .lean();

    res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { propertyId, roomNumber, type, occupancyType, capacity, monthlyPrice, description, amenities, utilities, images } = req.body;

    if (!propertyId || !roomNumber || monthlyPrice === undefined || monthlyPrice === null || !occupancyType) {
      return res.status(400).json({ message: 'Property ID, room number, price, and occupancy type are required' });
    }

    // Verify property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if room already exists in property
    const existingRoom = await Room.findOne({ propertyId, roomNumber });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room number already exists in this property' });
    }

    const room = await Room.create({
      propertyId,
      roomNumber,
      type: type || 'single',
      occupancyType,
      capacity: capacity || 1,
      monthlyPrice,
      description,
      images: images || [],
      amenities: amenities || [],
      utilities: utilities || false,
      isAvailable: true,
      status: 'available'
    });

    // Update property total rooms count
    property.totalRooms = await Room.countDocuments({ propertyId });
    await property.save();

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id)
      .populate('currentTenant', 'fullName email phone')
      .populate('propertyId', 'name address city');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, capacity, monthlyPrice, description, amenities, status } = req.body;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Update fields
    if (type) room.type = type;
    if (capacity) room.capacity = capacity;
    if (monthlyPrice) room.monthlyPrice = monthlyPrice;
    if (description) room.description = description;
    if (amenities) room.amenities = amenities;
    if (status) {
      room.status = status;
      room.isAvailable = status === 'available';
    }

    await room.save();

    res.json({
      success: true,
      message: 'Room updated successfully',
      data: room
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const propertyId = room.propertyId;

    // Delete room
    await Room.findByIdAndDelete(id);

    // Update property total rooms count
    const property = await Property.findById(propertyId);
    if (property) {
      property.totalRooms = await Room.countDocuments({ propertyId });
      property.occupiedRooms = await Room.countDocuments({ propertyId, status: 'occupied' });
      await property.save();
    }

    res.json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchAvailableRooms = async (req, res) => {
  try {
    const { city, type, minPrice, maxPrice, amenities } = req.query;

    let query = { isAvailable: true, status: 'available' };

    // Add filters
    if (city) {
      const properties = await Property.find({ city });
      query.propertyId = { $in: properties.map(p => p._id) };
    }

    if (type) query.type = type;

    if (minPrice || maxPrice) {
      query.monthlyPrice = {};
      if (minPrice) query.monthlyPrice.$gte = parseInt(minPrice);
      if (maxPrice) query.monthlyPrice.$lte = parseInt(maxPrice);
    }

    if (amenities) {
      const amenityArray = typeof amenities === 'string' ? amenities.split(',') : amenities;
      query.amenities = { $in: amenityArray };
    }

    const rooms = await Room.find(query)
      .populate('propertyId', 'name address city contact')
      .lean();

    res.json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.body;

    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID is required' });
    }

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.currentTenant = tenantId;
    room.status = 'occupied';
    room.isAvailable = false;
    await room.save();

    // Update property occupied count
    const property = await Property.findById(room.propertyId);
    if (property) {
      property.occupiedRooms = await Room.countDocuments({ propertyId: room.propertyId, status: 'occupied' });
      await property.save();
    }

    res.json({
      success: true,
      message: 'Tenant assigned successfully',
      data: room
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unassignTenant = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.currentTenant = null;
    room.status = 'available';
    room.isAvailable = true;
    await room.save();

    // Update property occupied count
    const property = await Property.findById(room.propertyId);
    if (property) {
      property.occupiedRooms = await Room.countDocuments({ propertyId: room.propertyId, status: 'occupied' });
      await property.save();
    }

    res.json({
      success: true,
      message: 'Tenant unassigned successfully',
      data: room
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
