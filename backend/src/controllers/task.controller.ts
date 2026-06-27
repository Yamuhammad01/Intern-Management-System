import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { asyncHandler } from '../middleware/asyncHandler.middleware';
import { ApiResponse } from '../utils/ApiResponse';

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  public getTaskStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const role = req.user!.role as string;

    let result;
    if (role === 'INTERN') {
      result = await this.taskService.getInternTaskStats(userId);
    } else if (role === 'SUPERVISOR') {
      result = await this.taskService.getSupervisorTaskStats(userId);
    } else {
      // ADMIN, SUPER_ADMIN
      result = await this.taskService.getAdminTaskStats();
    }

    res.status(200).json(ApiResponse.success(result, 'Task stats retrieved successfully'));
  });
}