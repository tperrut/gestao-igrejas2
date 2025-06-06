
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AuthGuard from "./components/auth/AuthGuard";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route element={
              <AuthGuard>
                <Layout />
              </AuthGuard>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
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
              <Route path="/finance" element={
                <AuthGuard requireAdmin={true}>
                  <Finance />
                </AuthGuard>
              } />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pastoral-appointment" element={<PastoralAppointment />} />
              <Route path="/pastoral-management" element={
                <AuthGuard requireAdmin={true}>
                  <PastoralManagement />
                </AuthGuard>
              } />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
