import { PrismaClient, Prisma, Feedback } from '@prisma/client';
import prisma from '../../config/database';

export interface IFeedbackRepository {
  findById(id: string): Promise<Feedback | null>;
  findByInternId(internId: string, params: { skip?: number; take?: number; type?: string }): Promise<{ feedbacks: Feedback[]; total: number }>;
  findBySupervisorId(supervisorId: string, params: { skip?: number; take?: number }): Promise<{ feedbacks: Feedback[]; total: number }>;
  findByLogEntryId(logEntryId: string): Promise<Feedback[]>;
  create(data: Prisma.FeedbackCreateInput): Promise<Feedback>;
  update(id: string, data: Prisma.FeedbackUpdateInput): Promise<Feedback>;
  delete(id: string): Promise<void>;
}

export class FeedbackRepository implements IFeedbackRepository {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async findById(id: string): Promise<Feedback | null> {
    return this.prisma.feedback.findUnique({
      where: { id },
      include: {
        supervisor: { select: { id: true, firstName: true, lastName: true } },
        intern: { select: { id: true, firstName: true, lastName: true, email: true } },
        logEntry: { select: { id: true, logDate: true, activity: true } },
      },
    });
  }

  async findByInternId(
    internId: string,
    params: { skip?: number; take?: number; type?: string },
  ): Promise<{ feedbacks: Feedback[]; total: number }> {
    const { skip = 0, take = 10, type } = params;
    const where: Prisma.FeedbackWhereInput = { internId };
    if (type) where.type = type as any;

    const [feedbacks, total] = await Promise.all([
      this.prisma.feedback.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          supervisor: { select: { id: true, firstName: true, lastName: true } },
          logEntry: { select: { id: true, logDate: true, activity: true } },
        },
      }),
      this.prisma.feedback.count({ where }),
    ]);

    return { feedbacks, total };
  }

  async findBySupervisorId(
    supervisorId: string,
    params: { skip?: number; take?: number },
  ): Promise<{ feedbacks: Feedback[]; total: number }> {
    const { skip = 0, take = 10 } = params;

    const [feedbacks, total] = await Promise.all([
      this.prisma.feedback.findMany({
        where: { supervisorId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          intern: { select: { id: true, firstName: true, lastName: true, email: true } },
          logEntry: { select: { id: true, logDate: true, activity: true } },
        },
      }),
      this.prisma.feedback.count({ where: { supervisorId } }),
    ]);

    return { feedbacks, total };
  }

  async findByLogEntryId(logEntryId: string): Promise<Feedback[]> {
    return this.prisma.feedback.findMany({
      where: { logEntryId },
      orderBy: { createdAt: 'desc' },
      include: {
        supervisor: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async create(data: Prisma.FeedbackCreateInput): Promise<Feedback> {
    return this.prisma.feedback.create({
      data,
      include: {
        supervisor: { select: { id: true, firstName: true, lastName: true } },
        intern: { select: { id: true, firstName: true, lastName: true, email: true } },
        logEntry: { select: { id: true, logDate: true, activity: true } },
      },
    });
  }

  async update(id: string, data: Prisma.FeedbackUpdateInput): Promise<Feedback> {
    return this.prisma.feedback.update({
      where: { id },
      data,
      include: {
        supervisor: { select: { id: true, firstName: true, lastName: true } },
        intern: { select: { id: true, firstName: true, lastName: true, email: true } },
        logEntry: { select: { id: true, logDate: true, activity: true } },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.feedback.delete({ where: { id } });
  }
}