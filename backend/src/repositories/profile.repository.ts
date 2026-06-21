import { InternProfile } from '@prisma/client';
import prisma from '../config/database';
import { IProfileRepository } from './interfaces/IProfileRepository';

export class ProfileRepository implements IProfileRepository {
  async findByUserId(userId: string): Promise<InternProfile | null> {
    return prisma.internProfile.findUnique({ where: { userId } });
  }

  async findByMatricNumber(matricNumber: string): Promise<InternProfile | null> {
    return prisma.internProfile.findUnique({ where: { matricNumber } });
  }

  async upsert(
    userId: string,
    data: Partial<Omit<InternProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>,
  ): Promise<InternProfile> {
    return prisma.internProfile.upsert({
      where: { userId },
      update: { ...data },
      create: { userId, ...data },
    });
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<InternProfile> {
    return prisma.internProfile.upsert({
      where: { userId },
      update: { avatarUrl },
      create: { userId, avatarUrl },
    });
  }

  async delete(userId: string): Promise<void> {
    await prisma.internProfile.delete({ where: { userId } });
  }
}
