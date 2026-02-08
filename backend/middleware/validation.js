const Joi = require('joi');

const schemas = {
  user: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),
  
  report: Joi.object({
    type: Joi.string().valid('waste', 'animal_abuse', 'pollution', 'other').required(),
    title: Joi.string().min(5).max(100).required(),
    description: Joi.string().min(10).max(500).required(),
    location: Joi.object({
      address: Joi.string().max(200),
      coordinates: Joi.object({
        lat: Joi.number().min(-90).max(90),
        lng: Joi.number().min(-180).max(180)
      })
    })
  }),
  
  contact: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    subject: Joi.string().min(5).max(100).required(),
    message: Joi.string().min(10).max(1000).required(),
    type: Joi.string().valid('inquiry', 'volunteer', 'feedback', 'support')
  }),
  
  event: Joi.object({
    title: Joi.string().min(5).max(100).required(),
    description: Joi.string().min(10).max(500).required(),
    date: Joi.date().min('now').required(),
    location: Joi.string().min(5).max(200).required(),
    type: Joi.string().valid('cleanup', 'awareness', 'workshop', 'adoption').required(),
    maxParticipants: Joi.number().min(1).max(1000)
  })
};

const validate = (schema) => (req, res, next) => {
  const { error } = schemas[schema].validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = { validate, schemas };