import { InternProfile } from '@prisma/client';

export interface IProfileRepository {
  findByUserId(userId: string): Promise<InternProfile | null>;
  findByMatricNumber(matricNumber: string): Promise<InternProfile | null>;
  upsert(userId: string, data: Partial<Omit<InternProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<InternProfile>;
  updateAvatar(userId: string, avatarUrl: string): Promise<InternProfile>;
  delete(userId: string): Promise<void>;
}
