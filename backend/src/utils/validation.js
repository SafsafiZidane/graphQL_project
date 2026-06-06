const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('ADMIN', 'OPERATOR').default('OPERATOR'),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const vehicleSchema = Joi.object({
  license_plate: Joi.string().trim().required(),
  type: Joi.string().trim().required(),
  model: Joi.string().trim().required(),
});

const trafficZoneSchema = Joi.object({
  name: Joi.string().trim().required(),
  region: Joi.string().trim().required(),
});

const incidentSchema = Joi.object({
  type: Joi.string().valid('Accident', 'Travaux', 'Route fermée', 'Embouteillage').required(),
  location: Joi.string().trim().required(),
  description: Joi.string().max(500).allow('', null),
});

const notificationSchema = Joi.object({
  recipient: Joi.string().trim().required(),
  message: Joi.string().trim().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  vehicleSchema,
  trafficZoneSchema,
  incidentSchema,
  notificationSchema,
};
