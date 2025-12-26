import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
        email
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { message } = response.data;
      console.log("Password reset requested for:", email);
      setIsSubmitted(true);
      
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || "Failed to send reset email. Please try again.");
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
            <svg viewBox="0 0 24 24" style={styles.lockIcon}>
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
          </div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Reset Your Password</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={styles.card}
        >
          {isSubmitted ? (
            <div style={styles.successMessage}>
              <svg style={styles.successIcon} viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <h3 style={styles.successTitle}>Reset Email Sent</h3>
              <p style={styles.successText}>
                Check your email at <strong>{email}</strong> for password reset instructions.
                The link will expire in 1 hour.
              </p>
              <div style={styles.actions}>
                <Link to="/login" style={styles.backButton}>
                  Back to Login
                </Link>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  style={styles.resendButton}
                >
                  Resend Email
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 style={styles.cardTitle}>Forgot Password?</h2>
              <p style={styles.description}>
                Enter your admin email address and we'll send you instructions to reset your password.
              </p>

              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Admin Email Address</label>
                  <div style={styles.inputWrapper}>
                    <svg style={styles.inputIcon} viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    <input
                      type="email"
                      value={email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                      placeholder="admin@company.com"
                      required
                      disabled={isLoading}
                      style={styles.input}
                    />
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
                  disabled={isLoading || email.length === 0}
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
                    "Send Reset Instructions"
                  )}
                </motion.button>

                <div style={styles.loginLink}>
                  <Link to="/login" style={styles.backLink}>
                    ← Back to Login
                  </Link>
                </div>
              </form>
            </>
          )}
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
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
  lockIcon: {
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
    margin: "0 0 16px",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
  },
  description: {
    fontSize: "14px",
    color: "#cbd5e1",
    margin: "0 0 28px",
    lineHeight: "1.5",
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
    width: "80%",
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
    overflow: "hidden",
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
  loginLink: {
    textAlign: "center" as const,
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #334155",
  },
  backLink: {
    color: "#22d3ee",
    textDecoration: "none",
    fontWeight: "500" as const,
    fontSize: "13px",
  },
  successMessage: {
    textAlign: "center" as const,
    padding: "20px 0",
  },
  successIcon: {
    width: "48px",
    height: "48px",
    fill: "#10b981",
    margin: "0 auto 20px",
  },
  successTitle: {
    fontSize: "18px",
    fontWeight: "600" as const,
    color: "#ffffff",
    margin: "0 0 12px",
  },
  successText: {
    fontSize: "14px",
    color: "#cbd5e1",
    lineHeight: "1.5",
    margin: "0 0 24px",
  },
  actions: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  backButton: {
    padding: "10px 20px",
    background: "#334155",
    color: "#f1f5f9",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500" as const,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
  },
  resendButton: {
    padding: "10px 20px",
    background: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500" as const,
    cursor: "pointer",
  },
};