import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getRegistrationStats, submitRegistration } from "@/lib/register.fn";
import {
  DEPARTMENTS,
  EVENT_BLURB,
  HEARD_FROM,
  SEMESTERS,
  YEARS_OF_STUDY,
  registrationSchema,
  type RegistrationInput,
} from "@/lib/registration-schema";

const fieldClass =
  "h-12 rounded-none border-border bg-background/60 text-sm shadow-none focus-visible:ring-primary";

export function RegistrationForm() {
  const [isRsetStudent, setIsRsetStudent] = useState<"yes" | "no" | "">("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [heardFrom, setHeardFrom] = useState("");
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [storageReady, setStorageReady] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getRegistrationStats()
      .then((stats) => setStorageReady(stats.configured))
      .catch(() => setStorageReady(false));
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      fullName: String(form.get("fullName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      isRsetStudent,
      universityId: String(form.get("universityId") ?? ""),
      collegeEmail: String(form.get("collegeEmail") ?? ""),
      department,
      semester,
      institutionName: String(form.get("institutionName") ?? ""),
      yearOfStudy,
      whyAttend: String(form.get("whyAttend") ?? ""),
      heardFrom,
      consent: consent ? true : false,
    };

    const parsed = registrationSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Check the highlighted fields.");
      return;
    }

    setErrors({});
    setPending(true);
    try {
      const result = await submitRegistration({ data: parsed.data as RegistrationInput });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setDone(true);
      toast.success(result.message);
    } catch {
      toast.error("Could not save your registration. Try again in a moment.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="border border-primary/40 bg-card p-8 sm:p-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Interest recorded</p>
        <h3 className="mt-3 font-display text-3xl font-bold">Thanks for your interest.</h3>
        <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
          This prototype doesn&apos;t send email confirmations. Follow the public TEDxRSET channels for confirmed event information.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="border border-border bg-card/80 p-6 sm:p-10" noValidate>
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Register</p>
      <h3 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Register your interest.</h3>
      <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{EVENT_BLURB}</p>
      {storageReady === false && (
        <p role="status" className="mt-4 border border-border bg-background/60 p-4 text-sm leading-6 text-muted-foreground">
          Registration is in prototype mode. Persistent storage has not been configured, so this form is not accepting submissions yet.
        </p>
      )}

      <fieldset disabled={storageReady !== true || pending} className="mt-8 space-y-8 disabled:opacity-60">
        <section className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" error={errors.fullName}>
            <Input name="fullName" autoComplete="name" className={fieldClass} placeholder="Your name" />
          </Field>
          <Field label="Email address" error={errors.email}>
            <Input name="email" type="email" autoComplete="email" className={fieldClass} placeholder="you@email.com" />
          </Field>
          <Field label="Phone number" error={errors.phone} hint="10 digits, for event updates only">
            <Input name="phone" inputMode="numeric" maxLength={10} className={fieldClass} placeholder="9876543210" />
          </Field>
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-[0.14em]">Are you a student of RSET?</Label>
            <RadioGroup
              value={isRsetStudent}
              onValueChange={(value) => setIsRsetStudent(value as "yes" | "no")}
              className="grid grid-cols-2 gap-3"
            >
              <Choice value="yes" label="Yes" />
              <Choice value="no" label="No" />
            </RadioGroup>
            {errors.isRsetStudent && <p className="text-xs text-primary">{errors.isRsetStudent}</p>}
          </div>
        </section>

        {isRsetStudent === "yes" && (
          <section className="grid gap-5 border-t border-border pt-8 sm:grid-cols-2">
            <p className="sm:col-span-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              RSET details
            </p>
            <Field label="University ID / Roll number" error={errors.universityId}>
              <Input name="universityId" className={fieldClass} />
            </Field>
            <Field label="College email" error={errors.collegeEmail} hint="Must include rajagiritech.edu.in">
              <Input name="collegeEmail" type="email" className={fieldClass} placeholder="name@rajagiritech.edu.in" />
            </Field>
            <Field label="Department" error={errors.department}>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className={fieldClass}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Year or semester" error={errors.semester}>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger className={fieldClass}>
                  <SelectValue placeholder="S1 to S8" />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTERS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </section>
        )}

        {isRsetStudent === "no" && (
          <section className="grid gap-5 border-t border-border pt-8 sm:grid-cols-2">
            <p className="sm:col-span-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Visiting campus
            </p>
            <Field label="College / institution name" error={errors.institutionName}>
              <Input name="institutionName" className={fieldClass} />
            </Field>
            <Field label="Year of study" error={errors.yearOfStudy}>
              <Select value={yearOfStudy} onValueChange={setYearOfStudy}>
                <SelectTrigger className={fieldClass}>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS_OF_STUDY.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </section>
        )}

        <section className="grid gap-5 border-t border-border pt-8">
          <Field label="Why do you want to attend? (optional)" error={errors.whyAttend}>
            <Textarea name="whyAttend" rows={4} className="rounded-none border-border shadow-none" placeholder="A sentence is enough." />
          </Field>
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-[0.14em]">How did you hear about the event?</Label>
            <RadioGroup value={heardFrom} onValueChange={setHeardFrom} className="grid gap-3 sm:grid-cols-2">
              {HEARD_FROM.map((item) => (
                <Choice key={item.value} value={item.value} label={item.label} />
              ))}
            </RadioGroup>
            {errors.heardFrom && <p className="text-xs text-primary">{errors.heardFrom}</p>}
          </div>
          <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
            <Checkbox
              checked={consent}
              onCheckedChange={(value) => setConsent(value === true)}
              className="mt-1 rounded-none"
            />
            <span>
              I agree to receive event updates and understand that my details will be used only for TEDxRSET.
            </span>
          </label>
          {errors.consent && <p className="text-xs text-primary">{errors.consent}</p>}
        </section>

        <Button
          type="submit"
          disabled={storageReady !== true || pending || !isRsetStudent}
          className="h-12 rounded-none px-8 text-xs font-bold uppercase tracking-[0.16em] shadow-none"
        >
          {pending ? "Saving…" : "Register"}
        </Button>
      </fieldset>
    </form>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-bold uppercase tracking-[0.14em]">{label}</span>
      {children}
      {hint && !error && <span className="block text-xs text-muted-foreground">{hint}</span>}
      {error && <span className="block text-xs text-primary">{error}</span>}
    </label>
  );
}

function Choice({ value, label }: { value: string; label: string }) {
  return (
    <label className="flex h-12 cursor-pointer items-center gap-3 border border-border bg-background/40 px-4 has-[[data-state=checked]]:border-primary">
      <RadioGroupItem value={value} />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}
