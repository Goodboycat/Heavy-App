import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/client';

interface AuditLogParams {
  action: string;
  userId?: string;
  resource?: string;
  details?: any;
}

export const auditLog = (params: AuditLogParams) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.auditLog.create({
        data: {
          action: params.action,
          userId: params.userId || req.user?.userId,
          resource: params.resource,
          details: params.details,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
        },
      });
    } catch (error) {
      // Don't break the request if audit logging fails
      console.error('Audit log failed:', error);
    }
    next();
  };
};