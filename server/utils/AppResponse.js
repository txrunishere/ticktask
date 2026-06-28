/**
 * payload: {
 *  message: string;
 *  success: boolean;
 *  data?: any
 * }
 */

export const AppResponse = (res, statusCode, payload) => {
  return res.status(statusCode).json(payload);
};
