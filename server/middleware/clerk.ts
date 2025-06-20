import { clerkMiddleware } from "@clerk/nuxt/server";

export default clerkMiddleware((event) => {
	const { userId } = event.context.auth();
	const isProtectedRoute = event.path.startsWith("/app");

	if (!userId && isProtectedRoute) {
		return sendRedirect(event, "/sign-in", 401);
	}
});
