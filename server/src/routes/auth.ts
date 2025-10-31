import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../database/client';
import { config } from '../config';
import { authenticate } from '../middleware/auth';
import { ValidationError, AppError } from '../utils/AppError';
import { auditLog } from '../middleware/auditLog';
import { validate } from '../middleware/validate';

const router = Router();

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Register
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { email, username, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      throw new ValidationError({
        email: existingUser.email === email ? 'Email already registered' : undefined,
        username: existingUser.username === username ? 'Username already taken' : undefined,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
        },
      });

      await tx.profile.create({
        data: {
          userId: newUser.id,
          firstName,
          lastName,
          title: 'Senior Developer', // Default title
          skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
        },
      });

      return newUser;
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.status(201).json({
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    // Log login activity
    await auditLog({
      action: 'USER_LOGIN',
      userId: user.id,
      resource: 'auth',
      details: { userAgent: req.get('User-Agent') },
    })(req, res, () => {});

    res.json({
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          profile: user.profile,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: { profile: true },
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
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    res.json({
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

// Update profile
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const { firstName, lastName, title, bio, skills, githubUrl, linkedinUrl, websiteUrl } = req.body;

    const profile = await prisma.profile.update({
      where: { userId: req.user!.userId },
      data: {
        firstName,
        lastName,
        title,
        bio,
        skills: Array.isArray(skills) ? skills : undefined,
        githubUrl,
        linkedinUrl,
        websiteUrl,
      },
    });

    res.json({
      message: 'Profile updated successfully',
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
});

export { router as authRoutes };