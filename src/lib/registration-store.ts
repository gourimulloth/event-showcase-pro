import type { RegistrationInput } from "./registration-schema";

const table = "registrations";

function getConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error("Registration storage is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY.");
  }
  return { url: url.replace(/\/$/, ""), key };
}

async function request(path: string, init?: RequestInit) {
  const { url, key } = getConfig();
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });
}

export async function saveRegistration(input: RegistrationInput) {
  const row = {
    full_name: input.fullName,
    email: input.email.toLowerCase(),
    phone: input.phone,
    is_rset_student: input.isRsetStudent === "yes",
    university_id: input.isRsetStudent === "yes" ? input.universityId : null,
    college_email: input.isRsetStudent === "yes" ? input.collegeEmail.toLowerCase() : null,
    department: input.isRsetStudent === "yes" ? input.department : null,
    semester: input.isRsetStudent === "yes" ? input.semester : null,
    institution_name: input.isRsetStudent === "no" ? input.institutionName : null,
    year_of_study: input.isRsetStudent === "no" ? input.yearOfStudy : null,
    why_attend: input.whyAttend || null,
    heard_from: input.heardFrom,
    consent: input.consent,
  };

  const response = await request(`${table}?on_conflict=email`, {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates,return=representation" },
    body: JSON.stringify(row),
  });

  if (!response.ok) {
    console.error("Registration database request failed", response.status);
    throw new Error("Could not save registration.");
  }

  const inserted = (await response.json()) as Array<{ id: string }>;
  if (inserted.length === 0) return { ok: false as const, error: "This email is already registered." };

  return {
    ok: true as const,
    message: "Your interest has been recorded.",
  };
}

export async function registrationStats() {
  // Availability only; registration counts are not published before confirmed.
  getConfig();
  return { configured: true };
}
