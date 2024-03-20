
/**
 * An array of routes that are accessible to the public
 * These routes do not requie the authentication
 * 
 */

export const publicRoutes:string[] = [
  "/"
];


/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to dashboard 
 */

export const authRoutes:string[] = [
  "/signin"
]

/**
 * The prefix for API authentication routes
 *  that start with this prefix are used for API
 * authentication purposes
 * 
 * 
 */

export const apiAuthPrefix:string = "/api/auth"

/**
 * The default redirect path after logging in
 * 
 */

export const DEFAULT_LOGIN_REDIRECT:string = "/dashboard";

/**
 * This route is only accessbile to superadmins
 */
export const CREATE_ADMIN_ROUTE:string = "/dashboard/createadmin";
