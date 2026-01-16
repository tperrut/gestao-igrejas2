
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AuthGuard from "./components/auth/AuthGuard";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MemberDashboard from "./pages/MemberDashboard";
import Library from "./pages/Library";
import Members from "./pages/Members";
import Events from "./pages/Events";
import Calendar from "./pages/Calendar";
import Courses from "./pages/Courses";
import Loans from "./pages/Loans";
import Finance from "./pages/Finance";
import Contact from "./pages/Contact";
import PastoralAppointment from "./pages/PastoralAppointment";
import PastoralManagement from "./pages/PastoralManagement";
import Settings from "./pages/Settings";
import SundaySchool from "./pages/SundaySchool";
import NotFound from "./pages/NotFound";
import OwnerDashboard from "./pages/OwnerDashboard";
import TenantManagement from "./pages/TenantManagement";
import NewTenant from "./pages/NewTenant";
import UserManagement from "./pages/UserManagement";
import OwnerGuard from "./components/auth/OwnerGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/register" element={<Register />} />
            
            {/* Owner Routes */}
            <Route path="/owner/dashboard" element={
              <OwnerGuard>
                <OwnerDashboard />
              </OwnerGuard>
            } />
            <Route path="/owner/tenants" element={
              <OwnerGuard>
                <TenantManagement />
              </OwnerGuard>
            } />
            <Route path="/owner/tenants/new" element={
              <OwnerGuard>
                <NewTenant />
              </OwnerGuard>
            } />
            <Route path="/owner/users" element={
              <OwnerGuard>
                <UserManagement />
              </OwnerGuard>
            } />
            
            {/* Protected Tenant Routes */}
            <Route element={
              <AuthGuard>
                <Layout>
                  <Outlet />
                </Layout>
              </AuthGuard>
            }>
              <Route path="/dashboard" element={
                <AuthGuard requireAdmin={true}>
                  <Dashboard />
                </AuthGuard>
              } />
              <Route path="/member-dashboard" element={<MemberDashboard />} />
              <Route path="/library" element={<Library />} />
              <Route path="/members" element={
                <AuthGuard requireAdmin={true}>
                  <Members />
                </AuthGuard>
              } />
              <Route path="/events" element={
                <AuthGuard requireAdmin={true}>
                  <Events />
                </AuthGuard>
              } />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/loans" element={
                <AuthGuard requireAdmin={true}>
                  <Loans />
                </AuthGuard>
              } />
              <Route path="/finance" element={<Finance />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pastoral-appointment" element={<PastoralAppointment />} />
              <Route path="/pastoral-management" element={
                <AuthGuard requireAdmin={true}>
                  <PastoralManagement />
                </AuthGuard>
              } />
              <Route path="/sunday-school" element={
                <AuthGuard requireAdmin={true}>
                  <SundaySchool />
                </AuthGuard>
              } />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
