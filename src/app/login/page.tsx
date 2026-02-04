"use client";

import React, { type FormEvent, useState } from "react";
import type { JSX } from "react";

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setToken(null);

    try {
      if (!email.trim() || !password.trim()) {
        setMessage({ type: "error", text: "Email and password are required" });
        setLoading(false);
        return;
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: "error", text: data.error || "Login failed" });
        return;
      }

      setMessage({ type: "success", text: `Login successful! Welcome back.` });
      setToken(data.token);
      console.log("JWT Token:", data.token);
      setEmail("");
      setPassword("");
    } catch (err) {
      setMessage({
        type: "error",
        text: `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        color: "#000000",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "20px",
          color: "#000000",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "30px", fontSize: "24px" }}>
          Login
        </h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "14px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "14px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "14px",
              fontWeight: "bold",
              backgroundColor: loading ? "#ccc" : "#000",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              backgroundColor:
                message.type === "success" ? "#d4edda" : "#f8d7da",
              color: message.type === "success" ? "#155724" : "#721c24",
              borderRadius: "4px",
              fontSize: "14px",
              border: `1px solid ${message.type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
            }}
          >
            {message.text}
          </div>
        )}

        {token && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              backgroundColor: "#e7f3ff",
              color: "#00000",
              borderRadius: "4px",
              wordBreak: "break-all",
              fontSize: "12px",
              border: "1px solid #b8daff",
            }}
          >
            <strong>JWT Token (also logged to console):</strong>
            <div
              style={{
                marginTop: "8px",
                fontFamily: "monospace",
                overflow: "auto",
                maxHeight: "100px",
              }}
            >
              {token}
            </div>
          </div>
        )}

        <p style={{ marginTop: "20px", fontSize: "14px", textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <a href="/signup" style={{ color: "#00000", textDecoration: "none" }}>
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}
