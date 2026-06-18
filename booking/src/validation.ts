import { z } from "zod";

export const bookingRequestSchema = z
  .object({
    name: z.string().trim().min(1).max(80),
    email: z.string().trim().email().optional().or(z.literal("")),
    phone: z
      .string()
      .trim()
      .regex(/^[\d+\-\s()]{6,20}$/, "Invalid phone")
      .optional()
      .or(z.literal("")),
    purpose: z.enum(["trial", "recruitment"]),
    preferredSlots: z.array(z.string()).min(1).max(5),
    note: z.string().trim().max(500).optional().or(z.literal("")),
    locale: z.enum(["zh", "en"]).default("zh"),
    clientTimezone: z.string().trim().max(64).optional().or(z.literal("")),
    website: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.website) {
      ctx.addIssue({
        code: "custom",
        message: "Spam detected",
        path: ["website"],
      });
    }

    const email = data.email?.trim();
    const phone = data.phone?.trim();
    if (!email && !phone) {
      ctx.addIssue({
        code: "custom",
        message: "Email or phone required",
        path: ["email"],
      });
    }
  });

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;
