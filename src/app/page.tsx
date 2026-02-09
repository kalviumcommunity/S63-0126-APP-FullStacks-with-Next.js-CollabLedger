import EnvironmentBadge from "../components/EnvironmentBadge";
import { getApiBaseUrl } from "../lib/env.client";

export default function Home() {
  const apiBaseUrl = getApiBaseUrl();
  const buildEnv = process.env.NODE_ENV || "development";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background font-semibold">
            CL
          </div>
          <div>
            <p className="text-lg font-semibold">CollabLedger</p>
            <p className="text-xs text-muted-foreground">
              NGO collaboration hub
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <EnvironmentBadge />
          <div className="text-xs text-muted-foreground">
            Build: {buildEnv} | API: {apiBaseUrl}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-20 pt-8">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Eliminate duplicate work and accelerate social impact.
            </h1>
            <p className="text-lg text-muted-foreground">
              CollabLedger unifies NGO projects and open-source contributors in
              one shared workspace, so teams can discover active initiatives,
              align tasks, and deliver faster.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:bg-[#383838] dark:hover:bg-[#ccc]">
                Get Started
              </button>
              <button className="rounded-full border border-black/10 px-6 py-3 text-sm font-semibold hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10">
                View Demo
              </button>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span>Trusted by 40+ NGOs</span>
              <span>Open-source friendly</span>
              <span>Secure & transparent</span>
            </div>
          </div>
          <div className="rounded-3xl border border-black/5 bg-linear-to-br from-black/5 to-transparent p-6 dark:border-white/10">
            <div className="space-y-4 rounded-2xl bg-background p-6 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Active initiatives
              </p>
              <h3 className="text-2xl font-semibold">Clean Water Atlas</h3>
              <p className="text-sm text-muted-foreground">
                A shared roadmap aligning NGO partners and volunteer engineers.
              </p>
              <div className="flex items-center gap-3 text-xs">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                  In Progress
                </span>
                <span className="text-muted-foreground">12 tasks open</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Project Visibility",
              description:
                "See every initiative, pipeline stage, and resource in a single dashboard.",
            },
            {
              title: "Contributor Matching",
              description:
                "Connect open-source talent with NGO needs based on skills and impact.",
            },
            {
              title: "Accountability",
              description:
                "Track milestones, owners, and outcomes with full transparency.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-black/5 p-6 text-sm shadow-sm dark:border-white/10"
            >
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-3 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </section>

        <section className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-black/5 p-8 dark:bg-white/5 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold">
              Ready to coordinate impact?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Launch a workspace for your organization and invite contributors
              in minutes.
            </p>
          </div>
          <button className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:bg-[#383838] dark:hover:bg-[#ccc]">
            Create Workspace
          </button>
        </section>
      </main>

      <footer className="border-t border-black/5 py-6 text-center text-xs text-muted-foreground dark:border-white/10">
        CollabLedger © 2026 · Coordinating social impact with open-source teams.
      </footer>
    </div>
  );
}
