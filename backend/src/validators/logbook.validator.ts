import Joi from 'joi';
import { LogEntryType, LogStatus } from '@prisma/client';

const entryTypeValues = Object.values(LogEntryType);
const statusValues = Object.values(LogStatus);

export const createLogEntrySchema = Joi.object({
  entryType: Joi.string()
    .valid(...entryTypeValues)
    .required()
    .messages({
      'any.only': `Entry type must be one of: ${entryTypeValues.join(', ')}`,
      'any.required': 'Entry type is required',
    }),
  logDate: Joi.date()
    .max('now')
    .required()
    .messages({
      'date.max': 'Cannot backdate logs. Date must be today or earlier.',
      'any.required': 'Log date is required',
      'date.base': 'Invalid date format',
    }),
  activity: Joi.string().min(10).max(5000).required().messages({
    'string.min': 'Activity description must be at least 10 characters',
    'string.max': 'Activity description cannot exceed 5000 characters',
    'any.required': 'Activity description is required',
  }),
  skills: Joi.string().max(5000).optional().allow('').messages({
    'string.max': 'Skills cannot exceed 5000 characters',
  }),
  hoursWorked: Joi.number().positive().max(24).optional().messages({
    'number.positive': 'Hours must be positive',
    'number.max': 'Hours cannot exceed 24',
  }),
  notes: Joi.string().max(5000).optional().allow('').messages({
    'string.max': 'Notes cannot exceed 5000 characters',
  }),
});

export const updateLogEntrySchema = Joi.object({
  entryType: Joi.string()
    .valid(...entryTypeValues)
    .optional()
    .messages({
      'any.only': `Entry type must be one of: ${entryTypeValues.join(', ')}`,
    }),
  logDate: Joi.date().max('now').optional().messages({
    'date.max': 'Cannot backdate logs. Date must be today or earlier.',
    'date.base': 'Invalid date format',
  }),
  activity: Joi.string().min(10).max(5000).optional().messages({
    'string.min': 'Activity description must be at least 10 characters',
    'string.max': 'Activity description cannot exceed 5000 characters',
  }),
  skills: Joi.string().max(5000).optional().allow('').messages({
    'string.max': 'Skills cannot exceed 5000 characters',
  }),
  hoursWorked: Joi.number().positive().max(24).optional().messages({
    'number.positive': 'Hours must be positive',
    'number.max': 'Hours cannot exceed 24',
  }),
  notes: Joi.string().max(5000).optional().allow('').messages({
    'string.max': 'Notes cannot exceed 5000 characters',
  }),
});

export const reviewLogEntrySchema = Joi.object({
  status: Joi.string()
    .valid('APPROVED', 'REJECTED')
    .required()
    .messages({
      'any.only': 'Status must be APPROVED or REJECTED',
      'any.required': 'Review status is required',
    }),
  reviewNotes: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Review notes cannot exceed 2000 characters',
  }),
});