import { createTRPCRouter, createCallerFactory } from "./trpc";
import { userRouter } from "~/modules/user/api/router";
// TODO: Uncomment these imports when the modules are created
// import { familyRouter } from "~/modules/family/api/router";
// import { ingredientRouter } from "~/modules/ingredient/api/router";
// import { recipeRouter } from "~/modules/recipe/api/router";

export const appRouter = createTRPCRouter({
  user: userRouter,
  // TODO: Add these routers when the modules are created
  // family: familyRouter,
  // ingredient: ingredientRouter,
  // recipe: recipeRouter,
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
