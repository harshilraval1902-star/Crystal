import { Suspense, lazy } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { ToastProvider } from "@/components/admin/ToastProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";

// Lazy Loaded Pages
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const ROSales = lazy(() => import("@/pages/ROSales"));
const AMCPlans = lazy(() => import("@/pages/AMCPlans"));
const ServiceBooking = lazy(() => import("@/pages/ServiceBooking"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const AdminLogin = lazy(() => import("@/admin/Login"));
const AdminLayout = lazy(() => import("@/admin/Layout"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// A premium loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-900 rounded-full animate-spin"></div>
  </div>
);

function AppRoutes() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/ro-sales" component={ROSales} />
          <Route path="/amc-plans" component={AMCPlans} />
          <Route path="/service-booking" component={ServiceBooking} />
          <Route path="/contact" component={Contact} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin" component={AdminLayout} />
          <Route path="/admin/*" component={AdminLayout} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppButton />}
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <WouterRouter>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </WouterRouter>
        </ToastProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
