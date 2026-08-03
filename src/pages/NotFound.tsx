import { Link } from "wouter";
import { Droplets, Home, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <>
      <title>Page Not Found | Crystal RO Care</title>
      <main className="min-h-[80vh] bg-background text-slate-900 flex items-center justify-center px-4 py-24 lg:py-32 overflow-hidden relative">
        {/* Abstract background elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50 pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-50 rounded-full blur-3xl opacity-50 pointer-events-none -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl w-full rounded-[2rem] border border-primary-200/50 glass-card p-10 sm:p-14 text-center shadow-md relative z-10"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-accent-50 text-accent-500 shadow-sm"
          >
            <Droplets className="h-10 w-10" />
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-600 mb-2"
          >
            404 Error
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl sm:text-5xl font-black text-primary-900 mb-4 tracking-tight"
          >
            Page not found
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-500 text-lg max-w-md mx-auto"
          >
            The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/"
              className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl bg-primary-900 px-7 py-3.5 text-sm font-semibold text-white hover:bg-primary-800 transition-elegant shadow-sm"
            >
              <Home className="h-4 w-4" /> 
              Return Home
            </Link>
            <Link
              href="/contact"
              className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl bg-white border border-primary-200 px-7 py-3.5 text-sm font-semibold text-primary-800 hover:bg-primary-50 transition-elegant shadow-sm"
            >
              <Phone className="h-4 w-4" />
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
