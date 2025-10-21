import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { detectSubdomain } from "@/utils/subdomain";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading, isAdmin, isMember } = useAuth();

  useEffect(() => {
    if (loading) return;

    const subdomainInfo = detectSubdomain();

    // Se não há subdomínio, redireciona para erro
    if (!subdomainInfo.isSubdomain) {
      navigate("/not-found");
      return;
    }

    // Se não está autenticado, redireciona para login
    if (!user) {
      navigate("/auth");
      return;
    }

    // Se está autenticado, redireciona para o dashboard apropriado
    if (isAdmin && isAdmin()) {
      navigate("/dashboard");
    } else if (isMember && isMember()) {
      navigate("/member-dashboard");
    } else {
      navigate("/member-dashboard");
    }
  }, [user, loading, navigate, isAdmin, isMember]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
};

export default Index;
