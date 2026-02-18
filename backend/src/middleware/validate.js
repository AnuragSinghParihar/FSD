/**
 * Request validation middleware factory
 * Simple validation without external dependencies
 */
const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];

      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }

      if (value !== undefined && value !== null) {
        if (rules.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push(`${field} must be a valid email`);
        }
        if (rules.minLength && value.length < rules.minLength) {
          errors.push(`${field} must be at least ${rules.minLength} characters`);
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(`${field} must be at most ${rules.maxLength} characters`);
        }
        if (rules.type === 'number' && isNaN(value)) {
          errors.push(`${field} must be a number`);
        }
        if (rules.min !== undefined && parseFloat(value) < rules.min) {
          errors.push(`${field} must be at least ${rules.min}`);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  };
};

// Pre-built schemas
const schemas = {
  register: {
    name:     { required: true, minLength: 2, maxLength: 100 },
    email:    { required: true, type: 'email' },
    password: { required: true, minLength: 6 },
  },
  login: {
    email:    { required: true, type: 'email' },
    password: { required: true },
  },
  product: {
    name:  { required: true, minLength: 2 },
    price: { required: true, type: 'number', min: 0 },
  },
  checkout: {
    address:     { required: true, minLength: 5 },
    city:        { required: true },
    postal_code: { required: true },
  },
};

module.exports = { validate, schemas };
