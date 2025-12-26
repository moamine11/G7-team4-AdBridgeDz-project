import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    
    try {
      await axios.patch(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );

      setSuccess("Password reset successful! Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0e1a",
      padding: "32px",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        maxWidth: "420px",
        width: "100%",
        background: "#1e293b",
        borderRadius: "12px",
        padding: "32px",
        border: "1px solid #334155"
      }}>
        <h2 style={{
          fontSize: "24px",
          fontWeight: "600",
          color: "#ffffff",
          marginBottom: "8px",
          textAlign: "center"
        }}>
          Reset Password
        </h2>
        
        <p style={{
          fontSize: "14px",
          color: "#94a3b8",
          marginBottom: "32px",
          textAlign: "center"
        }}>
          Enter your new password
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "500",
              color: "#cbd5e1",
              marginBottom: "8px"
            }}>
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px",
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#f1f5f9",
                fontFamily: "inherit"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "500",
              color: "#cbd5e1",
              marginBottom: "8px"
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px",
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#f1f5f9",
                fontFamily: "inherit"
              }}
            />
          </div>

          {error && (
            <div style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid #f87171",
              color: "#f87171",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "20px"
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid #10b981",
              color: "#10b981",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "20px"
            }}>
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password || !confirmPassword}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)",
              color: "white",
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: (isLoading || !password || !confirmPassword) ? 0.7 : 1,
              transition: "all 0.2s"
            }}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}