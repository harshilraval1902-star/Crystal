import { Redirect, Route, Switch } from "wouter";
import Layout from "@/components/AdminLayout";
import NotFound from "./NotFound";
import Dashboard from "./Dashboard";
import Products from "./Products";
import AMCPlans from "./AMCPlans";
import ServiceRequests from "./ServiceRequests";
import Inquiries from "./Inquiries";
import Testimonials from "./Testimonials";
import Settings from "./Settings";
import Gallery from "./Gallery";
import Reviews from "./Reviews";
import Faqs from "./Faqs";
import SiteServices from "./SiteServices";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-500 text-white">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/admin/login" replace />;
  }

  return (
    <Layout>
      <Switch>
        <Route path="/admin" component={Dashboard} />
        <Route path="/admin/dashboard" component={Dashboard} />
        <Route path="/admin/products" component={Products} />
        <Route path="/admin/amc" component={AMCPlans} />
        <Route path="/admin/services" component={ServiceRequests} />
        <Route path="/admin/inquiries" component={Inquiries} />
        <Route path="/admin/testimonials" component={Testimonials} />
        <Route path="/admin/gallery" component={Gallery} />
        <Route path="/admin/reviews" component={Reviews} />
        <Route path="/admin/faqs" component={Faqs} />
        <Route path="/admin/site-services" component={SiteServices} />
        <Route path="/admin/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}
