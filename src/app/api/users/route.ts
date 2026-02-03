import { CreateUserSchema, UpdateUserSchema } from '../../../lib/schemas/user';
import {
  internalServerErrorResponse,
  validationErrorResponse,
} from '../../../lib/schemas/validation';

export const runtime = 'nodejs';

function invalidJsonResponse() {
  return Response.json(
    {
      success: false,
      message: 'Validation Error',
      errors: [{ field: 'body', message: 'Invalid JSON payload' }],
    },
    { status: 400 }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = CreateUserSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse(result.error);
    }

    return Response.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return invalidJsonResponse();
    }
    return internalServerErrorResponse();
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const result = UpdateUserSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse(result.error);
    }

    return Response.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return invalidJsonResponse();
    }
    return internalServerErrorResponse();
  }
}
