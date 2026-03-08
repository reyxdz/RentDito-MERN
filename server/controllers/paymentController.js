const Payment = require('../models/Payment');
const Lease = require('../models/Lease');
const User = require('../models/User');

exports.getAllPayments = async (req, res) => {
  try {
    const { role, _id } = req.user;
    let query = {};

    if (role === 'tenant') {
      query.tenantId = _id;
    } else if (role === 'landlord') {
      query.landlordId = _id;
    } else if (role === 'landlord-admin') {
      // Get payments for properties managed by this admin
      query.propertyId = { $in: req.user.adminDetails.assignedProperties };
    }

    const payments = await Payment.find(query)
      .populate('tenantId', 'fullName email')
      .populate('leaseId', 'startDate endDate')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const { leaseId, amount, paymentMethod, notes } = req.body;

    if (!leaseId || !amount) {
      return res.status(400).json({ message: 'Lease ID and amount are required' });
    }

    const lease = await Lease.findById(leaseId);
    if (!lease) {
      return res.status(404).json({ message: 'Lease not found' });
    }

    // Calculate due date (monthly)
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 1);
    dueDate.setDate(1);

    const payment = await Payment.create({
      tenantId: lease.tenantId,
      leaseId,
      propertyId: lease.propertyId,
      landlordId: lease.landlordId,
      amount,
      dueDate,
      paymentMethod: paymentMethod || 'pending',
      status: 'pending',
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id)
      .populate('tenantId', 'fullName email phone')
      .populate('leaseId')
      .populate('propertyId', 'name');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentMethod, transactionId, notes } = req.body;

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (status) {
      payment.status = status;
      if (status === 'paid') {
        payment.paidDate = new Date();
      }
    }
    if (paymentMethod) payment.paymentMethod = paymentMethod;
    if (transactionId) payment.transactionId = transactionId;
    if (notes) payment.notes = notes;

    await payment.save();

    res.json({
      success: true,
      message: 'Payment updated successfully',
      data: payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    await Payment.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPaymentStats = async (req, res) => {
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

    const totalPayments = await Payment.countDocuments(query);
    const paidPayments = await Payment.countDocuments({ ...query, status: 'paid' });
    const pendingPayments = await Payment.countDocuments({ ...query, status: 'pending' });
    const overduePayments = await Payment.countDocuments({ ...query, status: 'overdue' });

    const totalRevenue = await Payment.aggregate([
      { $match: { ...query, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const pendingRevenue = await Payment.aggregate([
      { $match: { ...query, status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalPayments,
        paidPayments,
        pendingPayments,
        overduePayments,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingRevenue: pendingRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.recordPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod, transactionId, receiptUrl } = req.body;

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = 'paid';
    payment.paidDate = new Date();
    payment.paymentMethod = paymentMethod;
    payment.transactionId = transactionId;
    payment.receiptUrl = receiptUrl;

    await payment.save();

    res.json({
      success: true,
      message: 'Payment recorded successfully',
      data: payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOverduePayments = async (req, res) => {
  try {
    const { role, _id } = req.user;
    let query = {
      status: { $in: ['pending', 'overdue'] },
      dueDate: { $lt: new Date() }
    };

    if (role === 'tenant') {
      query.tenantId = _id;
    } else if (role === 'landlord') {
      query.landlordId = _id;
    } else if (role === 'landlord-admin') {
      query.propertyId = { $in: req.user.adminDetails.assignedProperties };
    }

    const overduePayments = await Payment.find(query)
      .populate('tenantId', 'fullName email')
      .populate('leaseId', 'rentAmount')
      .sort({ dueDate: 1 })
      .lean();

    res.json({
      success: true,
      count: overduePayments.length,
      data: overduePayments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
