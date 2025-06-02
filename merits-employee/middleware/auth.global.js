export default defineNuxtRouteMiddleware((to) => {
  const publicPaths = ["/auth/login", "/auth/register"];

  const isPublicPath =
    publicPaths.includes(to.path) || to.path.startsWith("/verify/");

  useNuxtApp().$pb.authStore.isValid;

  if (useNuxtApp().$pb.authStore.isValid && to.path === "/auth/login") {
    return navigateTo("/");
  }

  if (!useNuxtApp().$pb.authStore.isValid && !isPublicPath) {
    return navigateTo("/auth/login");
  }
});
