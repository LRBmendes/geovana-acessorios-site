export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f1e8",
        fontFamily: "Georgia, serif",
        color: "#5f5347",
      }}
    >
      {/* TOPO */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 25px",
          background: "#ffffff",
          borderBottom: "1px solid #eee",
          position: "sticky",
          top: 0,
          zIndex: 99,
        }}
      >
        <img
          src="/logo.jpeg"
          alt="Geovana"
          style={{ height: "70px", borderRadius: "10px" }}
        />

        <a
          href="https://wa.me/5567999481768"
          style={{
            background: "#b79d7b",
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
          textAlign: "center",
          padding: "70px 20px",
        }}
      >
        <h1
          style={{
            fontSize: "56px",
            maxWidth: "900px",
            margin: "0 auto 20px",
            lineHeight: "1.2",
          }}
        >
          Acessórios que transformam sua presença
        </h1>

        <p
          style={{
            fontSize: "22px",
            maxWidth: "700px",
            margin: "0 auto 35px",
            lineHeight: "1.7",
          }}
        >
          Peças delicadas, modernas e elegantes para valorizar sua beleza todos
          os dias.
        </p>

        <a
          href="https://wa.me/5567999481768"
          style={{
            background: "#5f5347",
            color: "#fff",
            padding: "18px 34px",
            borderRadius: "35px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          Comprar no WhatsApp
        </a>
      </section>

      {/* PRODUTOS */}
      <section
        style={{
          padding: "50px 20px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "42px", marginBottom: "35px" }}>
          Destaques
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
          {[
            "Brincos Elegantes",
            "Colares Delicados",
            "Pulseiras Premium",
            "Anéis Modernos",
          ].map((item) => (
            <div
              key={item}
              style={{
                background: "#fff",
                padding: "40px 20px",
                borderRadius: "16px",
                boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
              }}
            >
              <p style={{ fontSize: "22px" }}>{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background: "#e8dccd",
          padding: "70px 20px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "40px" }}>
          Receba nosso catálogo atualizado
        </h2>

        <p style={{ fontSize: "22px", marginBottom: "30px" }}>
          Fale conosco e veja as novidades.
        </p>

        <a
          href="https://wa.me/5567999481768"
          style={{
            background: "#5f5347",
            color: "#fff",
            padding: "16px 34px",
            borderRadius: "30px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Chamar no WhatsApp
        </a>
      </section>

      {/* BOTAO FIXO */}
      <a
        href="https://wa.me/5567999481768"
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

      <footer
        style={{
          textAlign: "center",
          padding: "30px",
        }}
      >
        © 2026 Geovana Joias e Acessórios
      </footer>
    </main>
  );
}
