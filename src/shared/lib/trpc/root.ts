import { authRouter } from 'core/Auth'
import { unplannedMealRouter } from 'core/UnplannedMeal/server'

import { orderRouter } from 'module/Order/server'
import { plannerRouter } from 'module/Planner/server'
import { userRouter } from 'module/User/server'

import { createCallerFactory, createTRPCRouter } from './trpc'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    auth: authRouter,
    user: userRouter,
    planner: plannerRouter,
    order: orderRouter,
    unplannedMeal: unplannedMealRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
