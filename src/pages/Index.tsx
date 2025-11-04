import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Dashboard } from "@/components/Dashboard";
import { PricingSection } from "@/components/PricingSection";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { isSignedIn, signOut } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSignOut={handleSignOut} />

      {isSignedIn ? (
        <Dashboard />
      ) : (
        <main>
          <Hero onGetStarted={handleGetStarted} />
          <PricingSection />
        </main>
      )}
    </div>
  );
};

export default Index;
