export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        margin: 0,
        fontFamily: "Georgia, serif",
        background: "#f8f3ed",
        color: "#5e5146",
      }}
    >
      {/* TOPO */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 30px",
          borderBottom: "1px solid #e6ddd1",
          background: "#ffffff",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <h2 style={{ margin: 0, letterSpacing: "2px" }}>
          GEOVANA
        </h2>

        <a
          href="https://wa.me/5567999999999"
          style={{
            background: "#b89d7b",
            color: "#fff",
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
          padding: "90px 20px",
          textAlign: "center",
          background: "linear-gradient(to bottom,#f8f3ed,#efe6da)",
        }}
      >
        <p style={{ letterSpacing: "4px", fontSize: "14px" }}>
          JOIAS E ACESSÓRIOS
        </p>

        <h1
          style={{
            fontSize: "64px",
            maxWidth: "900px",
            margin: "20px auto",
            lineHeight: "1.2",
          }}
        >
          Elegância para mulheres que gostam de se destacar
        </h1>

        <p
          style={{
            fontSize: "22px",
            maxWidth: "700px",
            margin: "0 auto 35px",
            lineHeight: "1.7",
          }}
        >
          Peças delicadas, modernas e escolhidas para valorizar sua beleza em
          qualquer ocasião.
        </p>

        <a
          href="https://wa.me/5567999999999"
          style={{
            background: "#5e5146",
            color: "#fff",
            padding: "18px 34px",
            borderRadius: "40px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          Comprar Agora
        </a>
      </section>

      {/* CATEGORIAS */}
      <section
        style={{
          padding: "70px 25px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "42px", marginBottom: "40px" }}>
          Nossas Categorias
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {["Brincos", "Colares", "Pulseiras", "Anéis"].map((item) => (
            <div
              key={item}
              style={{
                background: "#ffffff",
                padding: "40px 20px",
                borderRadius: "16px",
                boxShadow: "0 8px 18px rgba(0,0,0,0.05)",
                fontSize: "24px",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* BENEFICIOS */}
      <section
        style={{
          background: "#ffffff",
          padding: "70px 25px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "42px", marginBottom: "35px" }}>
          Por que comprar conosco?
        </h2>

        <p style={{ fontSize: "22px", maxWidth: "800px", margin: "0 auto" }}>
          Atendimento personalizado, catálogo atualizado e peças que acompanham
          sua personalidade.
        </p>
      </section>

      {/* WHATS FIXO */}
      <a
        href="https://wa.me/5567999999999"
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          background: "#25D366",
          color: "#fff",
          padding: "16px 18px",
          borderRadius: "50%",
          textDecoration: "none",
          fontSize: "22px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        }}
      >
        💬
      </a>

      {/* RODAPE */}
      <footer
        style={{
          textAlign: "center",
          padding: "35px",
          fontSize: "15px",
        }}
      >
        © 2026 Geovana Acessórios
      </footer>
    </main>
  );
}
