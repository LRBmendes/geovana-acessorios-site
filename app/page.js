export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f1e8",
        fontFamily: "Georgia, serif",
        color: "#5f5347",
        margin: 0,
      }}
    >
      {/* TOPO */}
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          padding: "18px 20px",
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
          style={{
            width: "90px",
            height: "90px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
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
            fontSize: "16px",
          }}
        >
          WhatsApp
        </a>
      </header>

      {/* HERO */}
      <section
        style={{
          textAlign: "center",
          padding: "60px 20px 30px",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(32px, 8vw, 58px)",
            maxWidth: "900px",
            margin: "0 auto 20px",
            lineHeight: "1.15",
          }}
        >
          Acessórios que transformam sua presença
        </h1>

        <p
          style={{
            fontSize: "clamp(18px,4vw,22px)",
            maxWidth: "760px",
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
            padding: "16px 30px",
            borderRadius: "35px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "16px",
            display: "inline-block",
          }}
        >
          Comprar no WhatsApp
        </a>
      </section>

      {/* DESTAQUES */}
      <section
        style={{
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(30px,7vw,42px)",
            marginBottom: "30px",
          }}
        >
          Destaques
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: "18px",
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
                background: "#ffffff",
                padding: "30px 18px",
                borderRadius: "18px",
                boxShadow: "0 10px 22px rgba(0,0,0,0.05)",
              }}
            >
              <p
                style={{
                  fontSize: "clamp(18px,4vw,22px)",
                  margin: 0,
                }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background: "#e7dac8",
          padding: "60px 20px",
          textAlign: "center",
          marginTop: "30px",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(30px,7vw,42px)",
            marginBottom: "18px",
            lineHeight: "1.2",
          }}
        >
          Receba nosso catálogo atualizado
        </h2>

        <p
          style={{
            fontSize: "clamp(18px,4vw,22px)",
            marginBottom: "28px",
          }}
        >
          Fale conosco no WhatsApp e veja as novidades.
        </p>

        <a
          href="https://wa.me/5567999481768"
          style={{
            background: "#5f5347",
            color: "#fff",
            padding: "16px 30px",
            borderRadius: "30px",
            textDecoration: "none",
            fontWeight: "bold",
            display: "inline-block",
          }}
        >
          Chamar no WhatsApp
        </a>
      </section>

      {/* BOTÃO FIXO */}
      <a
        href="https://wa.me/5567999481768"
        style={{
          position: "fixed",
          right: "15px",
          bottom: "15px",
          background: "#25D366",
          color: "#fff",
          width: "58px",
          height: "58px",
          borderRadius: "50%",
          textDecoration: "none",
          fontSize: "26px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        }}
      >
        💬
      </a>

      {/* RODAPÉ */}
      <footer
        style={{
          textAlign: "center",
          padding: "25px 15px",
          fontSize: "14px",
        }}
      >
        © 2026 02 Geovana Joias e Acessórios
      </footer>
    </main>
  );
}
