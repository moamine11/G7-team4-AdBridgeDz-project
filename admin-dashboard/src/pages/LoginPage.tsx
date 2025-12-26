import { useState, useRef, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      emailRef.current?.focus();
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { token, admin } = response.data;
      
      if (login(token, admin)) {
        navigate("/dashboard");
      } else {
        setError("Login failed. Please try again.");
      }
      
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || "Invalid email or password");
      } else if (err.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={styles.header}
        >
          <div style={styles.logo}>
            <svg viewBox="0 0 24 24" style={styles.shieldIcon}>
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
          </div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Secure Access Portal</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={styles.card}
        >
          <h2 style={styles.cardTitle}>Authentication Required</h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <svg style={styles.inputIcon} viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <input
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  placeholder="email address"
                  required
                  disabled={isLoading}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <svg style={styles.inputIcon} viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  style={styles.input}
                />
                <motion.button
                  type="button"
                  style={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showPassword ? "|" : "👁"}
                </motion.button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                style={styles.errorMessage}
              >
                <svg viewBox="0 0 24 24" style={styles.errorIcon}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                <span>{error}</span>
              </motion.div>
            )}

            <motion.button
              type="submit"
              style={styles.submitButton}
              disabled={
                isLoading || email.length === 0 || password.length === 0
              }
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <motion.span
                  style={styles.spinner}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                "Sign In"
              )}
            </motion.button>

            <div style={styles.forgotPasswordLink}>
              <Link 
                to="/forgot-password" 
                style={styles.forgotPasswordButton}
              >
                Forgot Password?
              </Link>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0a0e1a",
    padding: "32px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  wrapper: {
    maxWidth: "420px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "48px",
  },
  logo: {
    width: "56px",
    height: "56px",
    background: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    boxShadow: "0 4px 20px rgba(34, 211, 238, 0.3)",
  },
  shieldIcon: {
    width: "28px",
    height: "28px",
    fill: "white",
  },
  title: {
    fontSize: "20px",
    fontWeight: "600" as const,
    color: "#ffffff",
    margin: "0 0 6px",
  },
  subtitle: {
    fontSize: "13px",
    color: "#94a3b8",
    margin: "0",
  },
  card: {
    background: "#1e293b",
    borderRadius: "12px",
    padding: "32px",
    border: "1px solid #334155",
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: "500" as const,
    color: "#94a3b8",
    margin: "0 0 28px",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "500" as const,
    color: "#cbd5e1",
    marginBottom: "4px",
  },
  inputWrapper: {
    position: "relative" as const,
  },
  inputIcon: {
    position: "absolute" as const,
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "16px",
    height: "16px",
    fill: "#64748b",
  },
  input: {
    width: "87%", 
    padding: "10px 10px 10px 40px",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#f1f5f9",
    fontFamily: "inherit",
    transition: "all 0.2s",
    height: "42px",
  },
  passwordToggle: {
    position: "absolute" as const,
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "0",
    color: "#64748b",
  },
  errorMessage: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid #f87171",
    color: "#f87171",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px",
  },
  errorIcon: {
    width: "16px",
    height: "16px",
    fill: "#f87171",
    flexShrink: 0,
  },
  submitButton: {
    width: "100%",
    background: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500" as const,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "all 0.2s",
    height: "44px",
    marginTop: "8px",
  },
  spinner: {
    width: "18px",
    height: "18px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
  },
  forgotPasswordLink: {
    textAlign: "center" as const,
    marginTop: "8px",
  },
  forgotPasswordButton: {
    color: "#22d3ee",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "500" as const,
    transition: "all 0.2s",
  },
  signupLink: {
    textAlign: "center" as const,
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #334155",
  },
  signupText: {
    fontSize: "13px",
    color: "#94a3b8",
  },
  signupLinkButton: {
    color: "#22d3ee",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "500" as const,
    transition: "all 0.2s",
  },
};