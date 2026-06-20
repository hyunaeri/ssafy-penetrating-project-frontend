import { NextRequest } from "next/server";

export function getBearerToken(req: NextRequest): string | null {
  const token = req.headers.get("authorization");
  if (!token?.startsWith("Bearer ")) {
    return null;
  }
  return token;
}

export function unauthorizedResponse() {
  return Response.json({ message: "Unauthorized" }, { status: 401 });
}
