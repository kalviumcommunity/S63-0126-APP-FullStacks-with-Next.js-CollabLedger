import { ZodError } from 'zod';

export type ValidationErrorItem = {
  field: string;
  message: string;
};

export function formatZodError(error: ZodError): ValidationErrorItem[] {
  return error.errors.map((issue) => ({
    field: issue.path.join('.') || 'body',
    message: issue.message,
  }));
}

export function validationErrorResponse(error: ZodError) {
  return Response.json(
    {
      success: false,
      message: 'Validation Error',
      errors: formatZodError(error),
    },
    { status: 400 }
  );
}

export function internalServerErrorResponse() {
  return Response.json(
    {
      success: false,
      message: 'Internal Server Error',
      errors: [],
    },
    { status: 500 }
  );
}
