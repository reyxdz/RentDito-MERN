const MaintenanceRequest = require('../models/MaintenanceRequest');
const Property = require('../models/Property');

exports.getAllRequests = async (req, res) => {
  try {
    const { role, _id } = req.user;
    let query = {};

    if (role === 'tenant') {
      query.tenantId = _id;
    } else if (role === 'landlord') {
      query.landlordId = _id;
    } else if (role === 'landlord-admin') {
      query.propertyId = { $in: req.user.adminDetails.assignedProperties };
    }

    const requests = await MaintenanceRequest.find(query)
      .populate('tenantId', 'fullName email phone')
      .populate('assignedTo', 'fullName email')
      .populate('roomId', 'roomNumber')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRequest = async (req, res) => {
  try {
    const { propertyId, roomId, description, category, priority, images } = req.body;

    if (!propertyId || !roomId || !description || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Get landlordId from property
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const request = await MaintenanceRequest.create({
      tenantId: req.user._id,
      propertyId,
      roomId,
      landlordId: property.landlordId,
      description,
      category,
      priority: priority || 'medium',
      images: images || [],
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Maintenance request created successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await MaintenanceRequest.findById(id)
      .populate('tenantId', 'fullName email phone')
      .populate('assignedTo', 'fullName email')
      .populate('propertyId', 'name')
      .populate('roomId', 'roomNumber');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, startDate, completionDate, estimatedCost, actualCost, notes } = req.body;

    const request = await MaintenanceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (status) request.status = status;
    if (assignedTo) request.assignedTo = assignedTo;
    if (startDate) request.startDate = startDate;
    if (completionDate) request.completionDate = completionDate;
    if (estimatedCost) request.estimatedCost = estimatedCost;
    if (actualCost) request.actualCost = actualCost;
    if (notes) request.notes = notes;

    await request.save();

    res.json({
      success: true,
      message: 'Request updated successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId } = req.body;

    if (!adminId) {
      return res.status(400).json({ message: 'Admin ID is required' });
    }

    const request = await MaintenanceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.assignedTo = adminId;
    request.status = 'in-progress';
    request.startDate = new Date();

    await request.save();

    res.json({
      success: true,
      message: 'Request assigned successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { actualCost, notes } = req.body;

    const request = await MaintenanceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'completed';
    request.completionDate = new Date();
    if (actualCost) request.actualCost = actualCost;
    if (notes) request.notes = notes;

    await request.save();

    res.json({
      success: true,
      message: 'Request completed successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await MaintenanceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    await MaintenanceRequest.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRequestStats = async (req, res) => {
  try {
    const { role, _id } = req.user;
    let query = {};

    if (role === 'tenant') {
      query.tenantId = _id;
    } else if (role === 'landlord') {
      query.landlordId = _id;
    } else if (role === 'landlord-admin') {
      query.propertyId = { $in: req.user.adminDetails.assignedProperties };
    }

    const pendingRequests = await MaintenanceRequest.countDocuments({ ...query, status: 'pending' });
    const inProgressRequests = await MaintenanceRequest.countDocuments({ ...query, status: 'in-progress' });
    const completedRequests = await MaintenanceRequest.countDocuments({ ...query, status: 'completed' });

    const totalCost = await MaintenanceRequest.aggregate([
      { $match: { ...query, actualCost: { $exists: true } } },
      { $group: { _id: null, total: { $sum: '$actualCost' } } }
    ]);

    const costByCategory = await MaintenanceRequest.aggregate([
      { $match: { ...query } },
      { $group: { _id: '$category', count: { $sum: 1 }, totalCost: { $sum: { $ifNull: ['$actualCost', 0] } } } }
    ]);

    res.json({
      success: true,
      data: {
        pendingRequests,
        inProgressRequests,
        completedRequests,
        totalCost: totalCost[0]?.total || 0,
        costByCategory
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
