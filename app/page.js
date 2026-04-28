export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#d7cbb8",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
      }}
    >
      {/* TOPO */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 40px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "300" }}>
          Geovana
        </h2>

        <a
          href="https://wa.me/5567999999999"
          style={{
            background: "#ffffff",
            color: "#7b6b57",
            padding: "12px 22px",
            borderRadius: "30px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          WhatsApp
        </a>
      </header>

      {/* HERO */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "80px 20px",
        }}
      >
        <h1
          style={{
            fontSize: "58px",
            marginBottom: "20px",
            maxWidth: "900px",
          }}
        >
          Joias e acessórios que elevam sua beleza
        </h1>

        <p
          style={{
            fontSize: "22px",
            maxWidth: "700px",
            lineHeight: "1.6",
            marginBottom: "35px",
          }}
        >
          Delicadeza, elegância e peças escolhidas para mulheres que gostam de
          se destacar.
        </p>

        <a
          href="https://wa.me/5567999999999"
          style={{
            background: "#ffffff",
            color: "#7b6b57",
            padding: "16px 34px",
            borderRadius: "30px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          Ver Catálogo no WhatsApp
        </a>
      </section>

      {/* BENEFICIOS */}
      <section
        style={{
          background: "#efe7db",
          color: "#7b6b57",
          padding: "70px 30px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "38px", marginBottom: "40px" }}>
          Por que escolher a Geovana?
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "25px",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <div>
            <h3>✨ Elegância</h3>
            <p>Peças femininas e sofisticadas.</p>
          </div>

          <div>
            <h3>💖 Atendimento</h3>
            <p>Compra fácil e personalizada.</p>
          </div>

          <div>
            <h3>🚚 Entrega</h3>
            <p>Rapidez e praticidade.</p>
          </div>

          <div>
            <h3>🛍️ Catálogo Atualizado</h3>
            <p>Novidades frequentes.</p>
          </div>
        </div>
      </section>

      {/* RODAPE */}
      <footer
        style={{
          textAlign: "center",
          padding: "30px",
          color: "#ffffff",
        }}
      >
        © 2026 Geovana Acessórios
      </footer>
    </main>
  );
}
