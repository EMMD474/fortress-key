// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login", // where users are redirected if not signed in
  },
});

export const config = {
  matcher: [
    "/((?!auth|api|_next/static|_next/image|favicon.ico|$).*)",
  ],
};
