import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import originParticles from "@/assets/origin-particles.jpg";
import { RegistrationForm } from "@/components/registration-form";
import { SparkMaze } from "@/components/spark-maze";
import { Button } from "@/components/ui/button";
import { PROTOTYPE_SPEAKERS, REVEAL_STORAGE_KEY } from "@/lib/speakers";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TEDxRSET — Ideas Worth Spreading" },
      { name: "description", content: "TEDxRSET — an independently organized TED event at Rajagiri School of Engineering & Technology, Kochi. Ideas worth spreading." },
      { property: "og:title", content: "TEDxRSET" },
      { property: "og:description", content: "An independently organized TED event at RSET, Kochi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navigation = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Speakers", href: "#speakers" },
  { label: "Play", href: "#play" },
  { label: "Event info", href: "#schedule" },
  { label: "Register", href: "#tickets" },
];

function Wordmark({ small = false }: { small?: boolean }) {
  return (
    <span className={`font-display font-bold tracking-normal leading-none ${small ? "text-xl sm:text-2xl" : "text-3xl"}`} aria-label="TEDxRSET">
      <span className="text-primary">TEDx</span>RSET
    </span>
  );
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(0);

  useEffect(() => {
    const stored = Number(sessionStorage.getItem(REVEAL_STORAGE_KEY) ?? "0");
    if (Number.isFinite(stored)) setUnlocked(stored);
  }, []);

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <div className="noise-overlay" aria-hidden />
      <header className="absolute left-0 right-0 top-0 z-30 border-b border-foreground/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">
          <a href="#home" className="inline-flex flex-col gap-1" aria-label="TEDxRSET home" onClick={() => setMenuOpen(false)}>
            <Wordmark small />
            <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Rajagiri · TEDx</span>
          </a>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/75 transition-colors hover:text-primary">
                {item.label}
              </a>
            ))}
          </nav>
          <Button asChild variant="outline" className="hidden h-10 rounded-none border-foreground/40 bg-transparent px-5 text-xs font-bold uppercase tracking-[0.12em] shadow-none hover:border-primary hover:bg-primary hover:text-primary-foreground lg:inline-flex">
            <a href="#tickets">Register <ArrowUpRight /></a>
          </Button>
          <Button variant="ghost" size="icon" className="relative z-50 text-foreground hover:bg-accent lg:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {menuOpen && (
          <nav className="flex flex-col gap-1 border-t border-border bg-background px-6 py-5 lg:hidden" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="py-3 text-sm font-semibold uppercase tracking-[0.14em]">
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <section id="home" className="relative flex min-h-[640px] h-[min(86svh,820px)] items-center justify-center overflow-hidden bg-background pt-20 lg:min-h-[720px] lg:h-[min(94svh,940px)]">
        <img src={originParticles} width={1600} height={1008} alt="" className="hero-image pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-80" fetchPriority="high" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/45 via-transparent to-background" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50" />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 text-center sm:px-10">
          <div className="reveal-up mb-7 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.28em] text-foreground/85">
            <span className="h-px w-8 bg-primary" />TEDxRSET<span className="h-px w-8 bg-primary" />
          </div>
          <h1 className="reveal-up reveal-delay font-display text-[clamp(3rem,10vw,9rem)] font-bold leading-[0.92] tracking-normal drop-shadow-2xl">
            TEDx<span className="text-primary">RSET</span>
          </h1>
          <p className="reveal-up reveal-delay-2 mt-6 max-w-xl font-display text-lg font-medium text-foreground sm:text-2xl">Ideas Worth Spreading.</p>
          <p className="reveal-up reveal-delay-2 mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/70">An independently organized TEDx event</p>
          <div className="reveal-up reveal-delay-2 mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="h-12 rounded-none px-7 text-xs font-bold uppercase tracking-[0.16em] shadow-none hover:bg-primary/85">
              <a href="#tickets">Register now <ArrowDownRight /></a>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-none border-foreground/30 bg-transparent px-7 text-xs font-bold uppercase tracking-[0.16em] shadow-none hover:border-primary hover:bg-primary hover:text-primary-foreground">
              <a href="#play">Play to reveal</a>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-8 left-6 right-6 z-10 flex items-end justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/55 sm:left-10 sm:right-10 lg:left-12 lg:right-12">
          <span>Rajagiri School of Engineering &amp; Technology</span>
          <a href="#about" aria-label="Scroll to about" className="flex items-center gap-3 text-foreground transition-colors hover:text-primary">
            <span className="hidden sm:inline">Scroll to discover</span>
            <ArrowDown className="pulse-line h-4 w-4" />
          </a>
        </div>
      </section>

      <section id="about" className="scroll-mt-0 border-t border-border bg-background py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-12">
          <div>
            <div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-primary"><span className="h-px w-8 bg-primary" /> 01 / About</div>
            <h2 className="max-w-sm font-display text-5xl font-bold leading-[1.06] sm:text-6xl">Where ideas <span className="text-primary">begin.</span></h2>
          </div>
          <div className="flex flex-col justify-center">
            <p className="max-w-2xl font-display text-2xl font-medium leading-snug sm:text-3xl">TEDx events bring a community together around ideas worth spreading.</p>
            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground">A community gathering around ideas worth spreading. Event details will be shared through the public TEDxRSET channels when confirmed.</p>
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-10">
              {[
                { value: "TED", label: "Ideas worth spreading" },
                { value: "RSET", label: "Community" },
                { value: "Live", label: "Ideas" },
              ].map((stat) => (
                <div key={stat.label}>
                  <span className="font-display text-4xl font-bold text-primary sm:text-5xl">{stat.value}</span>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="speakers" className="scroll-mt-0 bg-[var(--surface-light)] py-24 text-[var(--ink-dark)] sm:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="mb-16 flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
            <div>
              <div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-primary"><span className="h-px w-8 bg-primary" /> 02 / Speakers</div>
              <h2 className="font-display text-5xl font-bold leading-[1.06] sm:text-6xl">Voices on the <span className="text-primary">stage.</span></h2>
            </div>
            <p className="max-w-xs text-sm leading-7 opacity-65">Prototype cards only — no names, photos, or bios. Play the maze to unlock each slot.</p>
          </div>
          <div className="grid gap-px bg-[var(--ink-dark)]/15 sm:grid-cols-2 lg:grid-cols-3">
            {PROTOTYPE_SPEAKERS.map((speaker, index) => {
              const open = index < unlocked;
              return (
                <article key={speaker.id} className="speaker-card bg-[var(--surface-light)] p-8">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-bold text-primary">{speaker.code} / 06</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] opacity-50">{open ? "Unlocked" : "Locked"}</span>
                  </div>
                  <div className={`mt-10 transition duration-500 ${open ? "blur-0" : "select-none blur-sm"}`}>
                    <h3 className="font-display text-3xl font-bold leading-tight">{open ? speaker.title : "??????"}</h3>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">{speaker.role}</p>
                    <p className="mt-5 max-w-xs text-sm leading-7 opacity-65">{open ? speaker.blurb : "Collect sparks in the maze to reveal this speaker slot."}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="play" className="scroll-mt-0 border-t border-border bg-background py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
          <div>
            <div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-primary"><span className="h-px w-8 bg-primary" /> 03 / Game</div>
            <h2 className="max-w-md font-display text-5xl font-bold leading-[1.06] sm:text-6xl">Chase the <span className="text-primary">spark.</span></h2>
            <p className="mt-6 max-w-sm text-sm leading-7 text-muted-foreground">
              A tiny maze built for this prototype. Eat the red sparks, dodge the hunter, grab the white pellets to turn the tables. Each spark you collect unlocks a speaker card above. No personal details — just placeholders.
            </p>
          </div>
          <SparkMaze onUnlock={setUnlocked} />
        </div>
      </section>

      <section id="schedule" className="scroll-mt-0 border-t border-border bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-primary"><span className="h-px w-8 bg-primary" /> 04 / Schedule</div>
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <h2 className="max-w-xl font-display text-5xl font-bold leading-[1.06] sm:text-6xl">A stage for <span className="text-primary">every idea.</span></h2>
            <p className="max-w-sm text-sm leading-7 text-muted-foreground">Event timing and program details have not been announced. Check the public TEDxRSET channels for confirmed updates.</p>
          </div>
          <div className="mt-12 border border-border bg-card/60 p-8 sm:p-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Details to come</span>
            <h3 className="mt-4 font-display text-2xl font-bold leading-tight">The program is being prepared.</h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">Date, venue, schedule, and speaker announcements will appear here after they are confirmed.</p>
          </div>
        </div>
      </section>

      <section id="tickets" className="scroll-mt-0 relative overflow-hidden bg-[var(--surface-raised)] py-24 sm:py-32">
        <div className="absolute right-0 top-0 h-full w-px bg-primary/30" />
        <div className="mx-auto grid max-w-7xl gap-14 px-6 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:px-12">
          <div>
            <div className="mb-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-primary"><span className="h-px w-8 bg-primary" /> 05 / Tickets</div>
            <h2 className="max-w-xl font-display text-5xl font-bold leading-[1.04] sm:text-6xl">Be there at the <span className="text-primary">beginning.</span></h2>
            <p className="mt-7 max-w-md text-base leading-8 text-muted-foreground">
              Share your interest using the form. Final registration details will be announced once the event information is confirmed.
            </p>
          </div>
          <RegistrationForm />
        </div>
      </section>

      <footer className="border-t border-border bg-background py-9">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-6 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:px-12">
          <div>
            <Wordmark small />
            <p className="mt-3 max-w-sm text-xs leading-6 text-muted-foreground">TEDx is a program of locally organized events. Event details are subject to official confirmation.</p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <a href="#home" className="hover:text-primary">Back to top ↑</a>
            <a href="#play" className="inline-flex items-center gap-1 hover:text-primary">Play game <ArrowRight className="h-3 w-3" /></a>
          </div>
        </div>
      </footer>
    </main>
  );
}
