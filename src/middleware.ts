import { NextRequest, NextResponse } from "next/server";

//? Middleware to check authentication
export function middleware(request: NextRequest, response: NextResponse) {
  //* Get token from cookies
  const token = request.cookies.get("token")?.value;

  //* If token exists, user is authenticated and doesnot need to login or signup
  if (
    token &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/signup")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  //* If token doesnot exist, user is not authenticated and should login or signup first
  if (!token && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  //* Allow requests to proceed if they meet the conditions
  return NextResponse.next();
}

//? Paths where middleware should be applied
export const config = {
  matcher: ["/", "/login", "/signup"],
};
