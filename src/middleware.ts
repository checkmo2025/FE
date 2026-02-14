// Next.js 미들웨어를 사용하여 인증 상태에 따른 라우트 접근 제어를 구현합니다.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 보호된 경로 (로그인 필요)
const protectedRoutes:string[] = []; // ["/mypage"] - 개발 중 접근 허용을 위해 임시 주석 처리
// 인증된 사용자가 접근할 수 없는 경로 (로그인 불필요)
const authRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // 1. 비로그인 사용자가 보호된 경로에 접근 시
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/"; // 또는 로그인 모달을 띄우기 위한 쿼리 파라미터 추가
      return NextResponse.redirect(url);
    }
  }

  // 2. 로그인 사용자가 인증 경로(로그인 등)에 접근 시
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (svg, png, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
