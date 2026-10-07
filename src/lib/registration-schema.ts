import { z } from "zod";

export const DEPARTMENTS = [
  "CSE",
  "CSE (AI)",
  "IT",
  "ECE",
  "EEE",
  "ME",
  "Civil",
  "AEI",
  "RAI",
  "Other",
] as const;

export const SEMESTERS = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"] as const;

export const YEARS_OF_STUDY = [
  "1st year",
  "2nd year",
  "3rd year",
  "4th year",
  "Postgraduate",
  "Other",
] as const;

export const HEARD_FROM = [
  { value: "instagram", label: "Instagram" },
  { value: "friends", label: "Friends" },
  { value: "posters", label: "Posters" },
  { value: "other", label: "Other" },
] as const;

const requiredText = (label: string, max = 120) =>
  z.string().trim().min(2, `${label} is required`).max(max, `${label} is too long`);

const sharedFields = {
  fullName: requiredText("Full name", 80),
  email: z.string().trim().email("Enter a valid email address").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Enter a 10-digit phone number"),
  whyAttend: z.string().trim().max(800, "Keep this under 800 characters").optional().or(z.literal("")),
  heardFrom: z.enum(["instagram", "friends", "posters", "other"], {
    required_error: "Tell us how you heard about the event",
  }),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required to register" }),
  }),
};

export const registrationSchema = z.discriminatedUnion("isRsetStudent", [
  z.object({
    ...sharedFields,
    isRsetStudent: z.literal("yes"),
    universityId: requiredText("University ID / roll number", 40),
    collegeEmail: z
      .string()
      .trim()
      .email("Enter a valid college email")
      .refine((value) => value.toLowerCase().endsWith("@rajagiritech.edu.in"), {
        message: "Use your @rajagiritech.edu.in email",
      }),
    department: z.enum(DEPARTMENTS, { required_error: "Select a department" }),
    semester: z.enum(SEMESTERS, { required_error: "Select your semester" }),
  }),
  z.object({
    ...sharedFields,
    isRsetStudent: z.literal("no"),
    institutionName: requiredText("College / institution name", 140),
    yearOfStudy: z.enum(YEARS_OF_STUDY, { required_error: "Select your year of study" }),
  }),
]);

export type RegistrationInput = z.infer<typeof registrationSchema>;

export const EVENT_BLURB = "Event details will be shared once confirmed.";
