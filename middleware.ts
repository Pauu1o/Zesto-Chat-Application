import { withAuth } from "next-auth/middleware";
export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: ["/users/:path*", "/conversations/:path*"],
};

// Personal Note: This is where the system implements authentication control for specific routes based on user authentication status.
