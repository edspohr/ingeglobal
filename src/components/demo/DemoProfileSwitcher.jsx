import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const DEMO_PROFILES = [
  {
    key: "admin",
    label: "Admin (Vista Global)",
    user: {
      uid: "demo-admin",
      email: "admin@ingeglobal.cl",
      displayName: "Edmundo Administrador",
      jobTitle: "CTO",
      role: "admin",
      status: "active",
      contractedModules: ["cintas", "arcones", "camiones", "buzones", "acopios"],
    },
  },
  {
    key: "manager",
    label: "Manager (Gerente de Planta)",
    user: {
      uid: "demo-manager",
      email: "gerente@ingeglobal.cl",
      displayName: "Carlos Morales",
      jobTitle: "Gerente de Planta",
      role: "manager",
      status: "active",
      contractedModules: ["cintas", "camiones", "buzones", "acopios"],
    },
  },
  {
    key: "operator",
    label: "Operator (Operario de Terreno)",
    user: {
      uid: "demo-operator",
      email: "operador@ingeglobal.cl",
      displayName: "Juan Soto",
      jobTitle: "Operario de Cintas",
      role: "operator",
      status: "active",
      contractedModules: ["cintas", "camiones"],
    },
  },
];

const DemoProfileSwitcher = () => {
  const { setDemoUser, clearDemoUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (import.meta.env.VITE_DEMO_MODE !== "true") {
    return null;
  }

  const handleSelect = (profile) => {
    setDemoUser(profile.user);
    setOpen(false);
    navigate("/dashboard");
  };

  const handleClose = () => {
    clearDemoUser();
    setOpen(false);
    navigate("/login");
  };

  return (
    <div
      ref={containerRef}
      className="fixed top-3 left-3/4 -translate-x-1/2 z-50 font-mono"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-darker/80 backdrop-blur-md border border-brand-gold/60 text-brand-gold text-xs uppercase tracking-widest shadow-[0_0_12px_rgba(212,162,78,0.35)] hover:bg-brand-dark hover:border-brand-gold transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Sparkles size={14} className="text-brand-gold" />
        <span>Modo Demo</span>
        <ChevronDown
          size={12}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="glass-panel absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-xl border border-brand-gold/30 bg-brand-darker/90 backdrop-blur-md overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.55)]"
        >
          <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-brand-gold/70 border-b border-brand-gold/15">
            Seleccionar Perfil
          </div>
          {DEMO_PROFILES.map((profile) => (
            <button
              key={profile.key}
              type="button"
              onClick={() => handleSelect(profile)}
              className="w-full text-left px-3 py-2 text-xs text-gray-200 hover:bg-brand-gold/15 hover:text-brand-gold transition-colors border-b border-brand-gold/10 last:border-b-0"
              role="option"
            >
              <div className="font-semibold">{profile.label}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                {profile.user.displayName}
              </div>
            </button>
          ))}
          <button
            type="button"
            onClick={handleClose}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-300 hover:bg-red-500/15 hover:text-red-200 transition-colors border-t border-brand-gold/25"
          >
            <LogOut size={12} />
            <span>Cerrar Demo</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DemoProfileSwitcher;
