import z, { ZodType } from "zod";

export const freeRoundCampaignSchema = z.object({
  campaignId: z.string(),
  roundsTotal: z.number().int().positive(),
  roundsLeft: z.number().int().nonnegative(),
  validFrom: z.string(),
  validTo: z.string(),
  bet: z.number().positive(),
  totalWin: z.number().nonnegative(),
  isComplete: z.boolean(),
});

export const spinResultSchema = z.object({
  win: z.number().nonnegative(),
});

export const roundSchema = z.object({
  roundId: z.string(),
  bet: z.number().positive(),
  balance: z.number().nonnegative(),
  totalWin: z.number().nonnegative(),
  nextGameMode: z.number().int().positive().optional(),
  endedUtc: z.string().nullable(),
  spinResult: spinResultSchema,
});

export const gameSettingsSchema = z.object({
  allowedBets: z.array(z.number().nonnegative()),
  availableAutoSpinCounts: z.array(z.number().nonnegative()),
});

export const sessionBaseSchema = z.object({
  securityHash: z.string(),
  currency: z.string().nullable(),
  startGameMode: z.number().int().positive().optional(),
  isDemo: z.boolean(),
  freeRoundCampaign: freeRoundCampaignSchema.optional().nullable(),
  round: roundSchema,
  gameSettings: gameSettingsSchema,
});

export const serverErrorMessageSchema = z.object({
  errorId: z.number(),
  errorMessage: z.string().nullable(),
});

export type CustomResponseType<T extends ZodType<any, any, any>> = z.infer<T>;
