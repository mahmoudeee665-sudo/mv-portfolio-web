// app/page.jsx  (or app/(marketing)/page.jsx)
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      {/* ===== Top Bar ===== */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <a href="#" className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-400 font-black tracking-widest text-zinc-950 shadow-lg">
              MV
            </span>
            <div className="leading-tight">
              <div className="text-lg font-extrabold">MV7mood</div>
              <div className="text-xs text-zinc-400">
                Portfolio Maker for Developers
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#features" className="text-zinc-300 hover:text-white">
              Features
            </a>
            <a href="#templates" className="text-zinc-300 hover:text-white">
              Theme
            </a>
            <a href="#faq" className="text-zinc-300 hover:text-white">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="hidden rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-white/10 md:inline-block"
            >
              Log in
            </a>
            <a
              href="/register"
              className="rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-400 px-4 py-2 text-sm font-semibold text-zinc-950 shadow-lg shadow-indigo-500/20 hover:brightness-110"
            >
              Get started
            </a>
          </div>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative isolate overflow-hidden">
        {/* background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-10%] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute right-[-10%] bottom-[-10%] h-[26rem] w-[26rem] rounded-full bg-violet-500/20 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-20 md:grid-cols-2 md:py-28 lg:px-6">
          {/* Copy */}
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Ship a world-class{" "}
              <span className="bg-gradient-to-tr from-indigo-400 to-violet-300 bg-clip-text text-transparent">
                developer portfolio
              </span>{" "}
              in minutes
            </h1>

            <p className="mt-5 max-w-xl text-lg text-zinc-300">
              <strong>MV7mood</strong> connects to your Strapi content and
              auto-generates a polished, responsive portfolio. No page builders,
              no CSS hassle—just add your data and publish.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="/register"
                className="rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-400 px-6 py-3 font-semibold text-zinc-950 shadow-xl shadow-indigo-600/25 hover:brightness-110"
              >
                Create free account
              </a>
              <a
                href="/login"
                className="rounded-2xl border border-white/15 px-6 py-3 font-semibold text-zinc-200 hover:bg-white/10"
              >
                Log in
              </a>
              <span className="ml-2 text-xs text-zinc-400">
                No credit card needed
              </span>
            </div>

            <div className="mt-6 flex items-center gap-4 text-xs text-zinc-400">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="M22 4 12 14.01l-3-3" />
                </svg>
                <span>One-click deploy</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 20h9" />
                  <path d="M16 4h3a2 2 0 0 1 2 2v14" />
                  <path d="M8 4H6a2 2 0 0 0-2 2v14" />
                  <path d="M16 2v4" />
                  <path d="M8 2v4" />
                </svg>
                <span>Auto theming</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 0 1 7.04 4.3" />
                </svg>
                <span>100% dynamic</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="mx-auto w-full max-w-xl">
            <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl ring-1 ring-white/10">
              <Image
                src="/PortifolioPreview.png"
                alt="Portfolio preview"
                width={1200}
                height={800}
                className="h-auto w-full"
                priority
              />
            </div>
            <p className="mt-3 text-center text-xs text-zinc-400">
              Live preview of your portfolio layout (auto-generated)
            </p>
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold md:text-4xl">
              Everything you need — nothing you don’t
            </h2>
            <p className="mt-3 text-zinc-300">
              MV7mood handles layout, theming, routing, and content so you can
              focus on code. Your data flows from Strapi into a beautiful
              portfolio automatically.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Instant setup",
                desc: "Connect Strapi and publish in under 5 minutes.",
              },
              {
                title: "Auto-themed",
                desc: "Dark/light, glass cards, gradients—adapts to your brand.",
              },
              {
                title: "Dynamic content",
                desc: "Profile, projects, skills, blog & contact from CMS.",
              },
              {
                title: "Responsive by default",
                desc: "Pixel-perfect across phones, tablets, and desktops.",
              },
              {
                title: "SEO & speed",
                desc: "Clean markup, OG tags, optimized images, fast scores.",
              },
              {
                title: "Customizable",
                desc: "Toggle sections, reorder blocks, tweak copy easily.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10 transition hover:bg-white/10"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-400 font-bold text-zinc-950">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-zinc-300">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Single Theme Showcase ===== */}
      <section id="templates" className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold md:text-4xl">
              One theme. Fully dynamic.
            </h2>
            <p className="mt-3 text-zinc-300">
              A single, polished theme that auto-generates your entire portfolio
              from Strapi content. No configuration—just plug data and publish.
            </p>
          </div>

          <div className="mt-10 grid items-start gap-6 md:grid-cols-2">
            {/* Desktop */}
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 p-3 ring-1 ring-white/10">
              <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
                <Image
                  src="/protifoliopreview2.png"
                  alt="Portfolio desktop preview"
                  width={1400}
                  height={900}
                  className="h-auto w-full object-cover"
                />
              </div>
              <p className="mt-3 text-center text-xs text-zinc-400">
                Desktop layout — auto-generated from your Strapi content
              </p>
            </div>

            {/* Mobile */}
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 p-3 ring-1 ring-white/10">
              <div className="mx-auto w-[320px] overflow-hidden rounded-2xl ring-1 ring-white/10 md:w-[360px]">
                <Image
                  src="/portifoliopreview3.png"
                  alt="Portfolio mobile preview"
                  width={360}
                  height={720}
                  className="h-auto w-full object-cover"
                />
              </div>
              <p className="mt-3 text-center text-xs text-zinc-400">
                Mobile layout — responsive by default
              </p>
            </div>
          </div>

          {/* Included */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                t: "Profile & About",
                d: "Name, headline, bio, links pulled from Strapi.",
              },
              {
                t: "Projects",
                d: "Cards with title, description, stack, links.",
              },
              { t: "Skills", d: "Tag grid powered by your Skills." },
              { t: "Contact", d: "CTA + email form (optional)." },
              { t: "SEO Ready", d: "Meta/OG tags and fast Lighthouse." },
              { t: "Easy Deploy", d: "Vercel/Netlify in one click." },
            ].map((f, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10"
              >
                <div className="mb-3 text-sm text-zinc-400">Included</div>
                <h3 className="text-lg font-semibold">{f.t}</h3>
                <p className="mt-2 text-sm text-zinc-300">{f.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="/register"
              className="rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-400 px-6 py-3 font-semibold text-zinc-950 shadow-lg hover:brightness-110"
            >
              Get started free
            </a>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
<section
  id="faq"
  className="border-t border-white/10 bg-zinc-950/40 pt-24 pb-0 md:pt-28 md:pb-0 flex items-center justify-center"
>
  <div className="mx-auto max-w-7xl px-4 md:px-6">
    <div className="mx-auto max-w-5xl px-6">
      <h2 className="text-center text-3xl font-extrabold md:text-4xl">
        Frequently asked questions
      </h2>
      <div className="mt-10 w-full max-w-4xl mx-auto divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">


              {[
                {
                  q: "Do I need to design anything?",
                  a: "No. MV7mood ships with beautiful defaults. You only add your content.",
                },
                {
                  q: "Is it 100% dynamic?",
                  a: "Yes. Profile, projects, and skills are pulled from Strapi.",
                },
                {
                  q: "Can I self-host?",
                  a: "Absolutely. Deploy to Vercel/Netlify or your own server.",
                },
                {
                  q: "Does it support custom domains?",
                  a: "Yes—available on the Pro plan alongside analytics.",
                },
              ].map((item, i) => (
                <details key={i} className="group p-6">
                  <summary className="cursor-pointer list-none text-lg font-semibold">
                    <span className="mr-3 inline-block h-2 w-2 rounded-full bg-indigo-400" />
                    {item.q}
                  </summary>
                  <p className="mt-3 text-sm text-zinc-300">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-16">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-400 font-black text-zinc-950">
                MV
              </span>
              <span className="text-sm text-zinc-400">
                © {new Date().getFullYear()} MV7mood. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="/register" className="text-zinc-300 hover:text-white">
                Get started
              </a>
              <a href="/login" className="text-zinc-300 hover:text-white">
                Log in
              </a>
              <a href="#features" className="text-zinc-300 hover:text-white">
                Features
              </a>
              <a href="#faq" className="text-zinc-300 hover:text-white">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
