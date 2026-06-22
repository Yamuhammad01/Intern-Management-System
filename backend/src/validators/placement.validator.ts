import Joi from 'joi';
import { PlacementStatus } from '@prisma/client';

const statusValues = Object.values(PlacementStatus);

export const createPlacementSchema = Joi.object({
  internId: Joi.string().uuid().required().messages({
    'string.uuid': 'Invalid intern ID',
    'any.required': 'Intern ID is required',
  }),
  organizationId: Joi.string().uuid().required().messages({
    'string.uuid': 'Invalid organization ID',
    'any.required': 'Organization ID is required',
  }),
  supervisorId: Joi.string().uuid().optional().allow(null).messages({
    'string.uuid': 'Invalid supervisor ID',
  }),
  status: Joi.string()
    .valid(...statusValues)
    .optional()
    .messages({
      'any.only': `Status must be one of: ${statusValues.join(', ')}`,
    }),
  role: Joi.string().max(200).optional().allow(''),
  department: Joi.string().max(200).optional().allow(''),
  startDate: Joi.string().isoDate().optional().allow(null, '').messages({
    'string.isoDate': 'Start date must be a valid ISO date',
  }),
  endDate: Joi.string().isoDate().optional().allow(null, '').messages({
    'string.isoDate': 'End date must be a valid ISO date',
  }),
  notes: Joi.string().max(2000).optional().allow(''),
});

export const updatePlacementSchema = Joi.object({
  status: Joi.string()
    .valid(...statusValues)
    .optional()
    .messages({
      'any.only': `Status must be one of: ${statusValues.join(', ')}`,
    }),
  role: Joi.string().max(200).optional().allow(''),
  department: Joi.string().max(200).optional().allow(''),
  startDate: Joi.string().isoDate().optional().allow(null, '').messages({
    'string.isoDate': 'Start date must be a valid ISO date',
  }),
  endDate: Joi.string().isoDate().optional().allow(null, '').messages({
    'string.isoDate': 'End date must be a valid ISO date',
  }),
  notes: Joi.string().max(2000).optional().allow(''),
});

export const assignSupervisorSchema = Joi.object({
  supervisorId: Joi.string().uuid().required().messages({
    'string.uuid': 'Invalid supervisor ID',
    'any.required': 'Supervisor ID is required',
  }),
});