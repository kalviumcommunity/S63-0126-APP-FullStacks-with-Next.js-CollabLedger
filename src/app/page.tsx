import EnvironmentBadge from '../components/EnvironmentBadge';
import { getApiBaseUrl } from '../lib/env.client';

export default function Home() {
  const apiBaseUrl = getApiBaseUrl();
  const buildEnv = process.env.NODE_ENV || 'development';

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-sans">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          CollabLedger
        </h1>
        <p className="text-xl text-muted-foreground max-w-600px text-center sm:text-left">
          Streamlining collaboration between NGOs and open-source contributors to eliminate work duplication.
        </p>

        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <EnvironmentBadge />
          <div className="text-xs text-muted-foreground">
            Build: {buildEnv} | API: {apiBaseUrl}
          </div>
        </div>
        
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5">
            Get Started
          </button>
          <button className="rounded-full border border-solid border-black/.08 dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44">
            Learn More
          </button>
        </div>
      </main>
    </div>
  );
}
