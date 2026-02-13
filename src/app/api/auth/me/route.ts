import { NextRequest } from "next/server";
import { verifyApiRequest } from "@/lib/apiAuth";
import { sendSuccess } from "@/lib/responseHandler";

export async function GET(req: NextRequest) {
  // Verify authentication
  const authResult = verifyApiRequest(req);

  if (!authResult.success) {
    return authResult.error;
  }

  // Return current user info from the JWT token
  const userInfo = {
    id: authResult.userId,
    email: authResult.userEmail,
    role: authResult.userRole,
  };

  return sendSuccess(userInfo, "User info retrieved successfully", 200);
}
