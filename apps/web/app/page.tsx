export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#050507",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontFamily: "sans-serif"
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 40 }}>◈ NeuroLingua AI</h1>
        <p style={{ color: "#6ee7b7", marginTop: 10 }}>
          Your AI Language Tutor
        </p>
      </div>
    </main>
  )
}