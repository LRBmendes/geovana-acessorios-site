export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#f5e6ea",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Arial"
    }}>
      <h1 style={{fontSize:"48px", color:"#a64d79", marginBottom:"10px"}}>
        Geovana Acessórios
      </h1>

      <p style={{fontSize:"20px", color:"#444", marginBottom:"30px"}}>
        Catálogo oficial em construção 💖
      </p>

      <a
        href="https://wa.me/5567999999999"
        style={{
          background:"#a64d79",
          color:"#fff",
          padding:"15px 30px",
          borderRadius:"10px",
          textDecoration:"none",
          fontWeight:"bold"
        }}
      >
        Comprar no WhatsApp
      </a>
    </main>
  );
}
