import Joi from 'joi';

export const createEvaluationSchema = Joi.object({
  placementId: Joi.string().uuid().required().messages({
    'string.uuid': 'Invalid placement ID',
    'any.required': 'Placement ID is required',
  }),
  internId: Joi.string().uuid().required().messages({
    'string.uuid': 'Invalid intern ID',
    'any.required': 'Intern ID is required',
  }),
  attendance: Joi.number().min(1).max(10).optional().messages({
    'number.min': 'Score must be between 1 and 10',
    'number.max': 'Score must be between 1 and 10',
  }),
  technicalSkills: Joi.number().min(1).max(10).optional().messages({
    'number.min': 'Score must be between 1 and 10',
    'number.max': 'Score must be between 1 and 10',
  }),
  communication: Joi.number().min(1).max(10).optional().messages({
    'number.min': 'Score must be between 1 and 10',
    'number.max': 'Score must be between 1 and 10',
  }),
  teamwork: Joi.number().min(1).max(10).optional().messages({
    'number.min': 'Score must be between 1 and 10',
    'number.max': 'Score must be between 1 and 10',
  }),
  initiative: Joi.number().min(1).max(10).optional().messages({
    'number.min': 'Score must be between 1 and 10',
    'number.max': 'Score must be between 1 and 10',
  }),
  problemSolving: Joi.number().min(1).max(10).optional().messages({
    'number.min': 'Score must be between 1 and 10',
    'number.max': 'Score must be between 1 and 10',
  }),
  professionalConduct: Joi.number().min(1).max(10).optional().messages({
    'number.min': 'Score must be between 1 and 10',
    'number.max': 'Score must be between 1 and 10',
  }),
  strengths: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Strengths cannot exceed 2000 characters',
  }),
  improvements: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Improvements cannot exceed 2000 characters',
  }),
  comments: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Comments cannot exceed 2000 characters',
  }),
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REVIEWED').optional().messages({
    'any.only': 'Status must be one of: PENDING, IN_PROGRESS, COMPLETED, REVIEWED',
  }),
});

export const updateEvaluationSchema = Joi.object({
  attendance: Joi.number().min(1).max(10).optional().messages({
    'number.min': 'Score must be between 1 and 10',
    'number.max': 'Score must be between 1 and 10',
  }),
  technicalSkills: Joi.number().min(1).max(10).optional().messages({
    'number.min': 'Score must be between 1 and 10',
    'number.max': 'Score must be between 1 and 10',
  }),
  communication: Joi.number().min(1).max(10).optional().messages({
    'number.min': 'Score must be between 1 and 10',
    'number.max': 'Score must be between 1 and 10',
  }),
  teamwork: Joi.number().min(1).max(10).optional().messages({
    'number.min': 'Score must be between 1 and 10',
    'number.max': 'Score must be between 1 and 10',
  }),
  initiative: Joi.number().min(1).max(10).optional().messages({
    'number.min': 'Score must be between 1 and 10',
    'number.max': 'Score must be between 1 and 10',
  }),
  problemSolving: Joi.number().min(1).max(10).optional().messages({
    'number.min': 'Score must be between 1 and 10',
    'number.max': 'Score must be between 1 and 10',
  }),
  professionalConduct: Joi.number().min(1).max(10).optional().messages({
    'number.min': 'Score must be between 1 and 10',
    'number.max': 'Score must be between 1 and 10',
  }),
  strengths: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Strengths cannot exceed 2000 characters',
  }),
  improvements: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Improvements cannot exceed 2000 characters',
  }),
  comments: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Comments cannot exceed 2000 characters',
  }),
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REVIEWED').optional().messages({
    'any.only': 'Status must be one of: PENDING, IN_PROGRESS, COMPLETED, REVIEWED',
  }),
});

export const evaluationQuerySchema = Joi.object({
  page: Joi.number().integer().positive().optional(),
  limit: Joi.number().integer().positive().optional(),
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REVIEWED').optional(),
  internId: Joi.string().uuid().optional(),
  placementId: Joi.string().uuid().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
});