import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { familyRouter } from "~/server/api/routers/family";
import { ingredientRouter } from "~/server/api/routers/ingredient";
import { recipeRouter } from "~/server/api/routers/recipe";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  family: familyRouter,
  ingredient: ingredientRouter,
  recipe: recipeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
