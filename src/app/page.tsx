export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-20 border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3 text-lg font-semibold tracking-tight">
            <img
              src="/collabledger-logo.png"
              alt="CollabLedger logo"
              className="h-8 w-8"
            />
            <span>CollabLedger</span>
          </div>
          <div className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a className="hover:text-black/70" href="#home">
              Home
            </a>
            <a className="hover:text-black/70" href="#about">
              About
            </a>
            <a className="hover:text-black/70" href="#team">
              Team
            </a>
            <a className="hover:text-black/70" href="#projects">
              Projects
            </a>
            <a className="hover:text-black/70" href="#contact">
              Contact
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a
              className="rounded-full border border-black px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white"
              href="/signup"
            >
              Sign Up
            </a>
            <a
              className="rounded-full border border-black px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white"
              href="/login"
            >
              Log In
            </a>
          </div>
        </div>
      </nav>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-24 pt-10">
        {/* Hero Section */}
        <section
          id="home"
          className="relative overflow-hidden rounded-3xl bg-black px-8 py-16 text-white"
        >
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: "url('/hero-texture.svg')",
              backgroundSize: "cover",
            }}
          />
          <div className="absolute right-10 top-10 hidden h-24 w-24 rounded-full border border-white/20 bg-white/10 md:block" />
          <div className="absolute bottom-8 left-8 hidden h-10 w-40 rounded-full border border-white/20 bg-white/10 md:block" />
          <div className="relative">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="flex flex-col gap-6">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                  Stop duplicated effort
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  CollabLedger turns guesswork into visibility.
                </h1>
                <p className="text-lg text-white/70">
                  Open-source contributors and NGOs often rebuild what already exists.
                  We surface what is in progress, what is planned, and what is done so
                  every contribution moves the mission forward.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90">
                    Get Involved
                  </button>
                  <button className="rounded-full border border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
                    See How It Works
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="h-56 w-56 overflow-hidden rounded-full border border-white/20 bg-white">
                  <img
                    src="/collabledger-logo.png"
                    alt="CollabLedger logo"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section
          id="about"
          className="grid gap-10 rounded-3xl bg-white p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
        >
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute -left-6 -top-6 h-12 w-12 rounded-full border border-black/10 bg-black/5" />
              <img
                alt="Mission focus"
                className="h-52 w-52 rounded-full border border-black/10 object-cover"
                src="/mission-photo.svg"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">Mission of the Project</h2>
            <p className="text-sm leading-relaxed text-black/70">
              CollabLedger exists to make social-impact work visible, not
              fragmented. We provide a single source of truth for project
              status, tasks, and reusable resources so open-source contributors
              can avoid repeating work and focus on what is most urgent.
            </p>
          </div>
        </section>

        {/* Repeating Content Sections */}
        <section id="projects" className="flex flex-col gap-10">
          {[
            {
              title: "Future Projects and Activities",
              description:
                "Plan ahead with shared roadmaps so contributors build on what already exists.",
              image: "/project-future.svg",
              background: "bg-neutral-100",
              reversed: false,
            },
            {
              title: "Community Health Outreach",
              description:
                "Expose active work streams so new contributors plug in instead of duplicating effort.",
              image: "/project-health.svg",
              background: "bg-white",
              reversed: true,
            },
            {
              title: "Education Access Program",
              description:
                "Reuse lesson kits, tooling, and outreach assets to scale impact faster.",
              image: "/project-education.svg",
              background: "bg-neutral-200",
              reversed: false,
            },
            {
              title: "Sustainable Housing Pilot",
              description:
                "Track what is completed and what is blocked so teams invest time where it matters.",
              image: "/project-housing.svg",
              background: "bg-neutral-800 text-white",
              reversed: true,
            },
          ].map((section) => (
            <div
              key={section.title}
              className={`rounded-3xl p-8 ${section.background}`}
            >
              <div
                className={`grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center ${
                  section.reversed ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div
                      className={`absolute -right-6 -top-6 h-12 w-12 rounded-full border ${
                        section.background.includes("text-white")
                          ? "border-white/20 bg-white/10"
                          : "border-black/10 bg-black/5"
                      }`}
                    />
                    <img
                      alt={`${section.title} illustration`}
                      className={`h-48 w-48 rounded-full border object-cover ${
                        section.background.includes("text-white")
                          ? "border-white/20"
                          : "border-black/10"
                      }`}
                      src={section.image}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs ${
                        section.background.includes("text-white")
                          ? "border-white/20 text-white/70"
                          : "border-black/10 text-black/60"
                      }`}
                    >
                      ◆
                    </span>
                    <h3 className="text-2xl font-semibold">{section.title}</h3>
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      section.background.includes("text-white")
                        ? "text-white/70"
                        : "text-black/70"
                    }`}
                  >
                    {section.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Call to Action */}
        <section
          id="contact"
          className="flex flex-col items-center gap-4 rounded-3xl bg-neutral-100 p-10 text-center"
        >
          <h2 className="text-2xl font-semibold">Do you have any questions?</h2>
          <p className="text-sm text-black/70">
            Let us help your team reduce duplicated work and amplify open-source contributions.
          </p>
          <button className="rounded-full border border-black px-6 py-3 text-sm font-semibold hover:bg-black hover:text-white">
            Contact Us
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black py-10 text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 text-sm">
          <p>Location: 221 Impact Avenue, Nairobi</p>
          <p>Contact: hello@collabledger.org</p>
          <p className="text-white/70">© 2026 CollabLedger. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
