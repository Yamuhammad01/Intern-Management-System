import Joi from 'joi';
import { IndustrySector } from '@prisma/client';

const sectorValues = Object.values(IndustrySector);

export const createOrganizationSchema = Joi.object({
  name: Joi.string().min(2).max(200).required().messages({
    'string.min': 'Organization name must be at least 2 characters',
    'string.max': 'Organization name must not exceed 200 characters',
    'any.required': 'Organization name is required',
  }),
  address: Joi.string().max(500).optional().allow(''),
  email: Joi.string().email().optional().allow('').messages({
    'string.email': 'Please provide a valid email address',
  }),
  phone: Joi.string()
    .pattern(/^\+?[\d\s\-()]{7,20}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Please provide a valid phone number',
    }),
  website: Joi.string().uri().optional().allow('').messages({
    'string.uri': 'Website must be a valid URL',
  }),
  sector: Joi.string()
    .valid(...sectorValues)
    .optional()
    .messages({
      'any.only': `Sector must be one of: ${sectorValues.join(', ')}`,
    }),
  description: Joi.string().max(1000).optional().allow(''),
});

export const updateOrganizationSchema = Joi.object({
  name: Joi.string().min(2).max(200).optional().messages({
    'string.min': 'Organization name must be at least 2 characters',
    'string.max': 'Organization name must not exceed 200 characters',
  }),
  address: Joi.string().max(500).optional().allow(''),
  email: Joi.string().email().optional().allow('').messages({
    'string.email': 'Please provide a valid email address',
  }),
  phone: Joi.string()
    .pattern(/^\+?[\d\s\-()]{7,20}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Please provide a valid phone number',
    }),
  website: Joi.string().uri().optional().allow('').messages({
    'string.uri': 'Website must be a valid URL',
  }),
  sector: Joi.string()
    .valid(...sectorValues)
    .optional()
    .messages({
      'any.only': `Sector must be one of: ${sectorValues.join(', ')}`,
    }),
  description: Joi.string().max(1000).optional().allow(''),
  isActive: Joi.boolean().optional(),
});