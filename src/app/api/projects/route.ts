import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSuccess, sendError } from '@/lib/responseHandler';
import { ERROR_CODES } from '@/lib/errorCodes';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return sendError(
        'Invalid pagination parameters. Page and limit must be positive, limit must not exceed 100.',
        ERROR_CODES.INVALID_PAGINATION,
        400
      );
    }

    const skip = (page - 1) * limit;

    // Get total count
    const total = await prisma.project.count();

    // Get projects with pagination
    const projects = await prisma.project.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return sendSuccess(
      {
        projects,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      'Projects retrieved successfully',
      200
    );
  } catch (error) {
    console.error('Get projects error:', error);
    return sendError(
      'Failed to retrieve projects',
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, ownerId } = body;

    // Validate required fields
    if (!title || typeof title !== 'string') {
      return sendError(
        'Title is required and must be a string',
        ERROR_CODES.INVALID_INPUT,
        400
      );
    }

    if (!description || typeof description !== 'string') {
      return sendError(
        'Description is required and must be a string',
        ERROR_CODES.INVALID_INPUT,
        400
      );
    }

    if (!ownerId || typeof ownerId !== 'string') {
      return sendError(
        'OwnerId is required and must be a string',
        ERROR_CODES.INVALID_INPUT,
        400
      );
    }

    // Check if owner exists
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      return sendError(
        'Owner not found',
        ERROR_CODES.USER_NOT_FOUND,
        404
      );
    }

    // Create project
    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        ownerId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return sendSuccess(
      newProject,
      'Project created successfully',
      201
    );
  } catch (error) {
    console.error('Create project error:', error);
    return sendError(
      'Failed to create project',
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
}
