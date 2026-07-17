import { Link } from "wouter";
import { Droplets, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <title>Page Not Found | Crystal Natural Water</title>
      <main className="min-h-[60vh] flex items-center justify-center bg-blue-50">
        <div className="text-center px-4">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-5 rounded-full">
              <Droplets className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-blue-700 mb-3">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            The page you're looking for doesn't exist. Let's get you back to pure water solutions.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 border border-blue-200 text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
