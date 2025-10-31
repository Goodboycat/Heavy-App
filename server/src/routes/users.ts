import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../database/client';
import { authenticate, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { NotFoundError } from '../utils/AppError';

const router = Router();

// Get all users (Admin only)
router.get('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          createdAt: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    res.json({
      data: { users },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    res.json({
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

// Update user role (Admin only)
router.patch('/:id/role', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), validate(z.object({
  body: z.object({
    role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']),
  }),
})), async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role: req.body.role },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });

    res.json({
      message: 'User role updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

export { router as userRoutes };