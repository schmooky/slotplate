import { serverErrorMessageSchema, sessionBaseSchema } from "./baseSchemas.js";
import { ServerErrorMessage } from "./error.js";

export const isSessionBase = <T>(obj: unknown): obj is T => {
  const validationResult = sessionBaseSchema.safeParse(obj);
  return validationResult.success;
};

export const isServerErrorMessage = (
  obj: unknown
): obj is ServerErrorMessage => {
  return serverErrorMessageSchema.safeParse(obj).success;
};
