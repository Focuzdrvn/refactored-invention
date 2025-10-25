import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    const initializeAuth = async () => {
      // Clear any stuck Supabase sessions first
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          console.log("Found existing Supabase session, processing...");
          // If there's a Supabase session but no local token, process it
          const localToken = localStorage.getItem("token");
          if (!localToken) {
            try {
              const response = await authAPI.googleCallback(
                session.access_token
              );
              if (response.data.success) {
                const { token: systemToken, user: userData } = response.data;
                localStorage.setItem("token", systemToken);
                localStorage.setItem("user", JSON.stringify(userData));
                setToken(systemToken);
                setUser(userData);
                setRole(userData.role);
              }
            } catch (error) {
              console.error("Error processing existing session:", error);
              await supabase.auth.signOut();
            }
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }

      checkAuth();
    };

    initializeAuth();

    // Listen for OAuth redirects (persists across page reloads)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);

      if (event === "SIGNED_IN" && session) {
        try {
          console.log("OAuth redirect detected, calling backend...");
          setLoading(true);

          // Send Supabase token to backend
          const response = await authAPI.googleCallback(session.access_token);
          console.log("Backend response:", response.data);

          if (response.data.success) {
            const { token: systemToken, user: userData } = response.data;

            // Store in localStorage
            localStorage.setItem("token", systemToken);
            localStorage.setItem("user", JSON.stringify(userData));

            // Update state
            setToken(systemToken);
            setUser(userData);
            setRole(userData.role);

            console.log("Login successful, token stored");
          }
        } catch (error) {
          console.error("Backend callback error:", error);
          const errorMessage =
            error.response?.data?.message ||
            "Login failed. Please ensure you are registered as an eligible voter.";
          alert(errorMessage);
          // Clear Supabase session on backend error
          await supabase.auth.signOut();
        } finally {
          setLoading(false);
        }
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuth = () => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setRole(userData.role);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Trigger Supabase Google OAuth (will redirect to Google)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      // The onAuthStateChange listener in useEffect will handle the callback
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const loginAsAdmin = async (username, password) => {
    try {
      setLoading(true);

      const response = await authAPI.adminLogin(username, password);

      if (response.data.success) {
        const { token: systemToken, user: userData } = response.data;

        // Store in localStorage
        localStorage.setItem("token", systemToken);
        localStorage.setItem("user", JSON.stringify(userData));

        // Update state
        setToken(systemToken);
        setUser(userData);
        setRole(userData.role);

        return true;
      }
    } catch (error) {
      console.error("Admin login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Sign out from Supabase if logged in via Google
      if (role === "Voter") {
        await supabase.auth.signOut();
      }

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Clear state
      setToken(null);
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    user,
    token,
    role,
    loading,
    loginWithGoogle,
    loginAsAdmin,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
