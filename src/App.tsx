import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import Home from "@/pages/Home";
import About from "@/pages/About";
import ROSales from "@/pages/ROSales";
import AMCPlans from "@/pages/AMCPlans";
import ServiceBooking from "@/pages/ServiceBooking";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import AdminLogin from "@/admin/Login";
import AdminLayout from "@/admin/Layout";
import { ToastProvider } from "@/components/admin/ToastProvider";


const queryClient = new QueryClient();

function AppRoutes() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
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
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppButton />}
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <WouterRouter>
          <AppRoutes />
        </WouterRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}
