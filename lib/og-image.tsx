export const OG_SIZE = { width: 1200, height: 630 };

export function renderOgImage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "80px",
        backgroundColor: "#050505",
        backgroundImage:
          "radial-gradient(circle at 82% 22%, rgba(255,107,53,0.35), transparent 45%), radial-gradient(circle at 12% 88%, rgba(255,204,2,0.18), transparent 40%)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          borderTop: "6px solid #ff6b35",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "36px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "20px",
            height: "20px",
            borderRadius: "999px",
            backgroundColor: "#39ff14",
          }}
        />
        <div style={{ display: "flex", color: "#b5b5b5", fontSize: 28, letterSpacing: 4 }}>
          RETRO-GAMING SHOP · DEUTSCHLAND
        </div>
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 116,
          fontWeight: 800,
          color: "#ffffff",
          letterSpacing: -2,
          lineHeight: 1,
        }}
      >
        Retr
        <span style={{ color: "#ff6b35" }}>Oase</span>
      </div>

      <div
        style={{
          display: "flex",
          marginTop: "28px",
          fontSize: 40,
          color: "#e5e5e5",
          maxWidth: "900px",
        }}
      >
        Wo Gaming-Träume wahr werden.
      </div>

      <div style={{ display: "flex", gap: "16px", marginTop: "48px" }}>
        {["Nintendo", "PlayStation", "Game Boy", "Pokémon"].map((tag) => (
          <div
            key={tag}
            style={{
              display: "flex",
              padding: "10px 22px",
              borderRadius: "999px",
              border: "2px solid #2a2a2a",
              color: "#ffcc02",
              fontSize: 24,
            }}
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
}
