const Property = require('../models/Property');
const Room = require('../models/Room');

exports.getAllProperties = async (req, res) => {
  try {
    const { role, _id } = req.user;
    let query = {};

    // Filter by role
    if (role === 'landlord') {
      query.landlordId = _id;
    } else if (role === 'landlord-admin') {
      query._id = { $in: req.user.adminDetails.assignedProperties };
    }

    const properties = await Property.find(query)
      .populate('managedBy', 'fullName email')
      .lean();

    res.json({
      success: true,
      data: properties
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProperty = async (req, res) => {
  try {
    const { name, description, address, city, state, postalCode, country, contact, amenities } = req.body;

    if (!name || !address || !city) {
      return res.status(400).json({ message: 'Name, address, and city are required' });
    }

    const property = await Property.create({
      landlordId: req.user._id,
      name,
      description,
      address,
      city,
      state,
      postalCode,
      country,
      contact,
      amenities: amenities || []
    });

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id).populate('managedBy', 'fullName email');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check access
    if (req.user.role === 'landlord' && property.landlordId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this property' });
    }

    if (req.user.role === 'landlord-admin' && !req.user.adminDetails.assignedProperties.includes(id)) {
      return res.status(403).json({ message: 'Not authorized to access this property' });
    }

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, address, city, state, amenities, contact } = req.body;

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check authorization
    if (req.user.role === 'landlord' && property.landlordId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    // Update fields
    if (name) property.name = name;
    if (description) property.description = description;
    if (address) property.address = address;
    if (city) property.city = city;
    if (state) property.state = state;
    if (amenities) property.amenities = amenities;
    if (contact) property.contact = contact;

    await property.save();

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: property
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check authorization
    if (req.user.role === 'landlord' && property.landlordId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    // Delete associated rooms
    await Room.deleteMany({ propertyId: id });

    // Delete property
    await Property.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPropertyStats = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const totalRooms = await Room.countDocuments({ propertyId: id });
    const occupiedRooms = await Room.countDocuments({ propertyId: id, status: 'occupied' });
    const totalRevenue = await Room.aggregate([
      { $match: { propertyId: property._id, status: 'occupied' } },
      { $group: { _id: null, total: { $sum: '$monthlyPrice' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalRooms,
        occupiedRooms,
        vacantRooms: totalRooms - occupiedRooms,
        monthlyRevenue: totalRevenue[0]?.total || 0,
        occupancyRate: totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
