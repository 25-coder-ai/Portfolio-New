"use client";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html>
      <body
        style={{
          margin: 0,
          background: "#111B2F",
          color: "#E8EEFF",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h2 style={{ marginBottom: "1rem" }}>Something went wrong</h2>
          <button
            onClick={() => unstable_retry()}
            style={{
              background: "#4F8EF7",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.5rem 1.25rem",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
