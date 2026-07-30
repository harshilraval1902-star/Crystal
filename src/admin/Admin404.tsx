import React from "react";
import { Link } from "wouter";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/admin/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/admin/ui/Card";

export default function Admin404() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <Card className="max-w-md w-full border border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xl rounded-[2rem] overflow-hidden">
        <CardHeader className="text-center pb-2 pt-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 ring-8 ring-indigo-50/50">
            <HelpCircle className="h-8 w-8 animate-bounce" />
          </div>
          <CardTitle className="text-3xl font-extrabold text-slate-900 tracking-tight">
            404 - Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center px-8 pb-8 pt-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 mb-3">
            Admin Area Error
          </p>
          <p className="text-slate-600 mb-8 leading-relaxed">
            The admin page or section you are looking for does not exist or has been moved to another path.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/admin">
              <Button className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] transition-all py-3 shadow-md shadow-indigo-600/10">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export { Admin404 };
