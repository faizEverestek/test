import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import WorkflowEditor from "./pages/WorkflowEditor";
import DatabaseEditor from "./pages/DatabaseEditor";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ValidateOTP from "./pages/ValidateOTP";
import { AuthType } from "./types/auth";
import AuthCallback from "./pages/AuthCallback";
import UnlockAccount from "./pages/UnlockAccount";
import ForgotPassword from "./pages/ForgotPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="codegenai-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/validate-otp" element={<ValidateOTP />} />
              <Route path="/account/unlock" element={<UnlockAccount />} />
              <Route 
                path="/forgot-password"
                element={<ForgotPassword />}
              />
              <Route
                path="/oauth2-google/signup-authorize"
                element={<AuthCallback type={AuthType.GOOGLE} />}
              />
              <Route
                path="/oauth2-google/signin-authorize"
                element={<AuthCallback type={AuthType.GOOGLE_SIGNIN} />}
              />
              <Route
                path="/oauth2-microsoft/signup-authorize"
                element={<AuthCallback type={AuthType.MICROSOFT} />}
              />
              <Route
                path="/oauth2-microsoft/signin-authorize"
                element={<AuthCallback type={AuthType.MICROSOFT_SIGNIN} />}
              />
              <Route path="/workflow-editor" element={<WorkflowEditor />} />
              <Route path="/database-editor" element={<DatabaseEditor />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
