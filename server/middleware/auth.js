const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role '${req.user.role}' is not authorized to access this route` 
      });
    }
    next();
  };
};

exports.checkPropertyAccess = async (req, res, next) => {
  try {
    const propertyId = req.params.propertyId || req.body.propertyId;
    
    if (!propertyId) {
      return res.status(400).json({ message: 'Property ID is required' });
    }

    const user = req.user;

    // Platform admin can access any property
    if (user.role === 'platform-admin') {
      return next();
    }

    // Landlord can access only their own properties
    if (user.role === 'landlord') {
      const property = await require('../models/Property').findById(propertyId);
      if (!property || property.landlordId.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to access this property' });
      }
      return next();
    }

    // Landlord admin can access only assigned properties
    if (user.role === 'landlord-admin') {
      if (!user.adminDetails.assignedProperties.includes(propertyId)) {
        return res.status(403).json({ message: 'Not authorized to access this property' });
      }
      return next();
    }

    res.status(403).json({ message: 'Not authorized to access this resource' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
