// this function on every request to do should implement in middleware
export const authConfig = {
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = auth?.user;
      const inOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");
      if (inOnDashboard) {
        if (isLoggedIn) return true;
        // if not logedIn redirect to unauthenticated page(login)
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", request.nextUrl));
      }
      // if user not in dashboard can stay wherever they are
      return true;
    },
  },
};
