import Joi from 'joi';

export const upsertProfileSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).optional().messages({
    'string.min': 'Full name must be at least 2 characters',
    'string.max': 'Full name must not exceed 100 characters',
  }),
  phone: Joi.string()
    .pattern(/^\+?[\d\s\-()]{7,20}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Please provide a valid phone number',
    }),
  department: Joi.string().max(100).optional().allow(''),
  program: Joi.string().max(150).optional().allow(''),
  matricNumber: Joi.string().max(50).optional().allow('').messages({
    'string.max': 'Matric number must not exceed 50 characters',
  }),
  faculty: Joi.string().max(100).optional().allow(''),
  institution: Joi.string().max(150).optional().allow(''),
  startDate: Joi.string().isoDate().optional().allow(null, '').messages({
    'string.isoDate': 'Start date must be a valid ISO date',
  }),
  endDate: Joi.string().isoDate().optional().allow(null, '').messages({
    'string.isoDate': 'End date must be a valid ISO date',
  }),
  supervisorName: Joi.string().max(100).optional().allow(''),
  organizationName: Joi.string().max(150).optional().allow(''),
});

export const updateContactSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^\+?[\d\s\-()]{7,20}$/)
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number',
      'any.required': 'Phone number is required',
    }),
});

export const uploadAvatarSchema = Joi.object({
  avatar: Joi.string()
    .pattern(/^data:image\/(jpeg|jpg|png|gif|webp);base64,/)
    .required()
    .max(5 * 1024 * 1024) // 5MB max as base64 string length
    .messages({
      'string.pattern.base': 'Avatar must be a valid base64-encoded image (JPEG, PNG, GIF, or WebP)',
      'any.required': 'Avatar image is required',
      'string.max': 'Avatar image must not exceed 5MB',
    }),
});
