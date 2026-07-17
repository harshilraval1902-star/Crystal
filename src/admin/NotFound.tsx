import { Link } from "wouter";
import { ArrowLeft, Droplets } from "lucide-react";

export default function NotFound() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm text-slate-900">
      <div className="mb-8 flex items-center gap-3 text-slate-700">
        <Droplets className="h-7 w-7 text-indigo-600" />
        <span className="text-sm font-semibold uppercase tracking-[0.24em]">Admin route not found</span>
      </div>
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-4 text-slate-600">This admin section does not exist. Please choose another page from the menu.</p>
      <Link
        href="/admin"
        className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
    </div>
  );
}
