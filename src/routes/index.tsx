import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import originParticles from "@/assets/origin-particles.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TEDxRSET — Ideas Worth Spreading" },
      { name: "description", content: "Explore TEDxRSET, a space for ideas, conversations, and perspectives worth sharing at Rajagiri School of Engineering & Technology." },
      { property: "og:title", content: "TEDxRSET — Ideas Worth Spreading" },
      { property: "og:description", content: "A place for ideas, conversations, and perspectives worth sharing at Rajagiri School of Engineering & Technology." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navigation = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Connect", href: "#connect" },
];

function Wordmark({ small = false }: { small?: boolean }) {
  return <span className={`font-display font-bold tracking-normal leading-none ${small ? "text-xl sm:text-2xl" : "text-3xl"}`} aria-label="TEDxRSET"><span className="text-primary">TEDx</span>RSET</span>;
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main className="overflow-hidden bg-background text-foreground">
      <header className="absolute left-0 right-0 top-0 z-30 border-b border-foreground/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">
          <a href="#home" className="inline-flex flex-col gap-1" aria-label="TEDxRSET home" onClick={() => setMenuOpen(false)}>
            <Wordmark small />
            <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Ideas worth spreading</span>
          </a>
          <nav className="hidden items-center gap-9 lg:flex" aria-label="Main navigation">
            {navigation.map(item => <a key={item.href} href={item.href} className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/75 transition-colors hover:text-primary">{item.label}</a>)}
          </nav>
          <Button asChild variant="outline" className="hidden h-10 rounded-none border-foreground/40 bg-transparent px-5 text-xs font-bold uppercase tracking-[0.12em] shadow-none hover:border-primary hover:bg-primary hover:text-primary-foreground lg:inline-flex">
            <a href="https://tedxrset.com/" target="_blank" rel="noopener noreferrer">Visit official site <ArrowUpRight /></a>
          </Button>
          <Button variant="ghost" size="icon" className="relative z-50 text-foreground hover:bg-accent lg:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
        </div>
        {menuOpen && <nav className="flex flex-col gap-1 border-t border-border bg-background px-6 py-5 lg:hidden" aria-label="Mobile navigation">{navigation.map(item => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="py-3 text-sm font-semibold uppercase tracking-[0.14em]">{item.label}</a>)}<a href="https://tedxrset.com/" target="_blank" rel="noopener noreferrer" className="py-3 text-sm font-semibold uppercase tracking-[0.14em] text-primary">Visit official site ↗</a></nav>}
      </header>

      <section id="home" className="relative flex min-h-[600px] h-[min(78svh,760px)] items-center justify-center overflow-hidden bg-background pt-20 lg:min-h-[690px] lg:h-[min(88svh,900px)]">
        <img src={originParticles} width={1600} height={1008} alt="Red and white points of light radiating from a central spark" className="hero-image pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-80" fetchPriority="high" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/45 via-transparent to-background" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50" />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 text-center sm:px-10">
          <div className="reveal-up mb-7 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.28em] text-foreground/85"><span className="h-px w-8 bg-primary" />A space for extraordinary ideas<span className="h-px w-8 bg-primary" /></div>
          <h1 className="reveal-up reveal-delay font-display text-[clamp(3.9rem,11vw,10rem)] font-bold leading-[0.95] tracking-normal drop-shadow-2xl"><span className="text-primary">TEDx</span>RSET</h1>
          <p className="reveal-up reveal-delay-2 mt-6 max-w-xl font-display text-lg font-medium text-foreground sm:text-2xl">Ideas worth spreading.</p>
          <Button asChild className="reveal-up reveal-delay-2 mt-11 h-12 rounded-none px-7 text-xs font-bold uppercase tracking-[0.16em] shadow-none hover:bg-primary/85"><a href="#about">Explore the experience <ArrowDownRight /></a></Button>
        </div>
        <div className="absolute bottom-8 left-6 right-6 z-10 flex items-end justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/55 sm:left-10 sm:right-10 lg:left-12 lg:right-12">
          <span>Rajagiri School of Engineering &amp; Technology</span>
          <a href="#about" aria-label="Scroll to about" className="flex items-center gap-3 text-foreground transition-colors hover:text-primary"><span className="hidden sm:inline">Scroll to discover</span><ArrowDown className="pulse-line h-4 w-4" /></a>
        </div>
      </section>

      <section id="about" className="scroll-mt-0 border-t border-border bg-background py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-12">
          <div><div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-primary"><span className="h-px w-8 bg-primary" /> 01 / About</div><h2 className="max-w-sm font-display text-5xl font-bold leading-[1.06] sm:text-6xl">Where ideas <span className="text-primary">begin.</span></h2></div>
          <div className="flex flex-col justify-center"><p className="max-w-2xl font-display text-2xl font-medium leading-snug sm:text-3xl">A single idea can change the way we see the world.</p><p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground">TEDxRSET brings the spirit of ideas worth spreading to the Rajagiri community. It is a place to encounter fresh perspectives, question what we know, and leave with something new to think about.</p><a href="#experience" className="mt-10 inline-flex w-fit items-center gap-3 border-b border-primary pb-2 text-xs font-bold uppercase tracking-[0.15em] transition-colors hover:text-primary">Discover more <ArrowDownRight className="h-4 w-4" /></a></div>
        </div>
      </section>

      <section id="experience" className="scroll-mt-0 bg-[var(--surface-light)] py-24 text-[var(--ink-dark)] sm:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="mb-16 flex flex-col justify-between gap-7 sm:flex-row sm:items-end"><div><div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-primary"><span className="h-px w-8 bg-primary" /> 02 / The experience</div><h2 className="font-display text-5xl font-bold leading-[1.06] sm:text-6xl">More than a <span className="text-primary">stage.</span></h2></div><p className="max-w-xs text-sm leading-7 opacity-65">An invitation to listen differently, think boldly, and connect through ideas.</p></div>
          <div className="grid border-t border-[var(--ink-dark)]/20 md:grid-cols-3">
            {[
              { number: "01", title: "New perspectives", text: "Step beyond the familiar and see the world through a different lens." },
              { number: "02", title: "Meaningful conversations", text: "Ideas become more powerful when they are shared and challenged." },
              { number: "03", title: "Lasting inspiration", text: "Take a thought with you. Let it become the beginning of something else." },
            ].map((item) => <div key={item.number} className="group border-b border-[var(--ink-dark)]/20 px-0 py-10 md:border-b-0 md:border-r md:px-8 md:last:border-r-0 md:first:pl-0 md:last:pr-0"><div className="flex items-center justify-between"><span className="font-display text-xs font-bold text-primary">{item.number} / 03</span><ArrowUpRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div><h3 className="mt-16 max-w-[12ch] font-display text-3xl font-bold leading-tight">{item.title}</h3><p className="mt-5 max-w-xs text-sm leading-7 opacity-65">{item.text}</p></div>)}
          </div>
        </div>
      </section>

      <section id="connect" className="scroll-mt-0 relative overflow-hidden bg-background py-24 sm:py-32">
        <div className="absolute right-0 top-0 h-full w-px bg-primary/30" />
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12"><div className="mb-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-primary"><span className="h-px w-8 bg-primary" /> 03 / Stay connected</div><div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end"><div><h2 className="max-w-3xl font-display text-5xl font-bold leading-[1.04] sm:text-7xl lg:text-8xl">The next idea<br />starts <span className="text-primary">here.</span></h2><p className="mt-7 max-w-md text-base leading-8 text-muted-foreground">Follow TEDxRSET for the latest event news and announcements.</p></div><Button asChild className="h-14 w-fit rounded-none px-8 text-xs font-bold uppercase tracking-[0.16em] shadow-none hover:bg-primary/85"><a href="https://tedxrset.com/" target="_blank" rel="noopener noreferrer">Visit TEDxRSET <ArrowUpRight /></a></Button></div></div>
      </section>

      <footer className="border-t border-border bg-background py-9"><div className="mx-auto flex max-w-7xl flex-col gap-7 px-6 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:px-12"><div><Wordmark small /><p className="mt-3 max-w-sm text-xs leading-6 text-muted-foreground">An independently organized TED event at Rajagiri School of Engineering &amp; Technology.</p></div><div className="flex flex-wrap items-center gap-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"><a href="#home" className="hover:text-primary">Back to top ↑</a><a href="https://tedxrset.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-primary">Official site <ArrowRight className="h-3 w-3" /></a></div></div></footer>
    </main>
  );
}
