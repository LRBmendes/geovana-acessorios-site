export default function Loading() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(135deg,#fbf8f3,#efe3d4)",
        color: "#6f5745",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <img
          src="/geovana-gv-mark.png"
          alt="Geovana Semi Joias"
          style={{
            width: 96,
            height: 96,
            borderRadius: 28,
            objectFit: "cover",
            boxShadow: "0 18px 42px rgba(80,58,47,.14)",
          }}
        />
        <div
          style={{
            marginTop: 16,
            fontFamily: "Georgia, 'Times New Roman', serif",
            letterSpacing: 4,
            fontSize: 13,
            textTransform: "uppercase",
          }}
        >
          Geovana
        </div>
      </div>
    </main>
  );
}
