import { Link } from "wouter";
import { Droplets, Home } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <title>Page Not Found | Crystal Natural Water</title>
      <main className="min-h-[70vh] bg-slate-50 text-slate-900 flex items-center justify-center px-4 py-24 lg:py-32">
        <div className="max-w-xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
            <Droplets className="h-8 w-8" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">404 error</p>
          <h1 className="mt-4 text-5xl font-black text-slate-950">Page not found</h1>
          <p className="mt-4 text-slate-600">The page you are looking for doesn’t exist or has been moved.</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              <Home className="h-4 w-4" /> Go home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
