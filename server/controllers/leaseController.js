const Lease = require('../models/Lease');
const Room = require('../models/Room');

exports.getLeasesByRoom = async (req, res) => {
  try {
    const { roomId } = req.query;

    if (!roomId) {
      return res.status(400).json({ message: 'Room ID is required' });
    }

    const leases = await Lease.find({ roomId })
      .populate('tenantId', 'fullName email phone avatar')
      .populate('propertyId', 'name')
      .populate('landlordId', 'fullName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: leases
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLeaseById = async (req, res) => {
  try {
    const { id } = req.params;

    const lease = await Lease.findById(id)
      .populate('tenantId', 'fullName email phone avatar')
      .populate('roomId', 'roomNumber')
      .populate('propertyId', 'name address city')
      .populate('landlordId', 'fullName');

    if (!lease) {
      return res.status(404).json({ message: 'Lease not found' });
    }

    res.json({
      success: true,
      data: lease
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createLease = async (req, res) => {
  try {
    const { tenantId, roomId, propertyId, landlordId, startDate, endDate, rentAmount, depositAmount, terms, documentUrl } = req.body;

    if (!tenantId || !roomId || !propertyId || !landlordId || !startDate || !endDate || !rentAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Create lease
    const lease = await Lease.create({
      tenantId,
      roomId,
      propertyId,
      landlordId,
      startDate,
      endDate,
      rentAmount,
      depositAmount,
      terms,
      documentUrl,
      status: 'pending'
    });

    const populatedLease = await Lease.findById(lease._id)
      .populate('tenantId', 'fullName email phone')
      .populate('propertyId', 'name');

    res.status(201).json({
      success: true,
      message: 'Lease created successfully',
      data: populatedLease
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLeaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const lease = await Lease.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    )
      .populate('tenantId', 'fullName email')
      .populate('propertyId', 'name');

    if (!lease) {
      return res.status(404).json({ message: 'Lease not found' });
    }

    res.json({
      success: true,
      message: 'Lease updated successfully',
      data: lease
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteLease = async (req, res) => {
  try {
    const { id } = req.params;

    const lease = await Lease.findByIdAndDelete(id);

    if (!lease) {
      return res.status(404).json({ message: 'Lease not found' });
    }

    res.json({
      success: true,
      message: 'Lease deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
