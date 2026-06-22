import Joi from 'joi';
import { FeedbackType } from '@prisma/client';

const feedbackTypeValues = Object.values(FeedbackType);

export const reviewLogSchema = Joi.object({
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

export const createFeedbackSchema = Joi.object({
  internId: Joi.string().uuid().required().messages({
    'string.uuid': 'Invalid intern ID',
    'any.required': 'Intern ID is required',
  }),
  logEntryId: Joi.string().uuid().optional().allow(null).messages({
    'string.uuid': 'Invalid log entry ID',
  }),
  type: Joi.string()
    .valid(...feedbackTypeValues)
    .required()
    .messages({
      'any.only': `Type must be one of: ${feedbackTypeValues.join(', ')}`,
      'any.required': 'Feedback type is required',
    }),
  rating: Joi.number().integer().min(1).max(5).optional().messages({
    'number.min': 'Rating must be between 1 and 5',
    'number.max': 'Rating must be between 1 and 5',
  }),
  content: Joi.string().min(10).max(5000).required().messages({
    'string.min': 'Feedback content must be at least 10 characters',
    'string.max': 'Feedback content cannot exceed 5000 characters',
    'any.required': 'Feedback content is required',
  }),
  strengths: Joi.string().max(3000).optional().allow('').messages({
    'string.max': 'Strengths cannot exceed 3000 characters',
  }),
  improvements: Joi.string().max(3000).optional().allow('').messages({
    'string.max': 'Improvements cannot exceed 3000 characters',
  }),
  isPrivate: Joi.boolean().optional(),
});

export const updateFeedbackSchema = Joi.object({
  type: Joi.string()
    .valid(...feedbackTypeValues)
    .optional()
    .messages({
      'any.only': `Type must be one of: ${feedbackTypeValues.join(', ')}`,
    }),
  rating: Joi.number().integer().min(1).max(5).optional().messages({
    'number.min': 'Rating must be between 1 and 5',
    'number.max': 'Rating must be between 1 and 5',
  }),
  content: Joi.string().min(10).max(5000).optional().messages({
    'string.min': 'Feedback content must be at least 10 characters',
    'string.max': 'Feedback content cannot exceed 5000 characters',
  }),
  strengths: Joi.string().max(3000).optional().allow('').messages({
    'string.max': 'Strengths cannot exceed 3000 characters',
  }),
  improvements: Joi.string().max(3000).optional().allow('').messages({
    'string.max': 'Improvements cannot exceed 3000 characters',
  }),
  isPrivate: Joi.boolean().optional(),
});