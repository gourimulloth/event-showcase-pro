import { createServerFn } from "@tanstack/react-start";
import { registrationSchema } from "./registration-schema";

export const submitRegistration = createServerFn({ method: "POST" })
  .validator((data: unknown) => registrationSchema.parse(data))
  .handler(async ({ data }) => {
    const { saveRegistration } = await import("./registration-store");
    return saveRegistration(data);
  });

export const getRegistrationStats = createServerFn({ method: "GET" }).handler(async () => {
  const { registrationStats } = await import("./registration-store");
  return registrationStats();
});
