async function getProdutos() {
  const res = await fetch(
    "https://kcydlzerrhezpcxkqonx.supabase.co/rest/v1/produtos?select=*&order=id.desc&limit=8",
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_KEY}`,
      },
      cache: "no-store",
    }
  );

  return res.json();
}

export default async function Home() {
  const produtos = await getProdutos();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f1e8",
        fontFamily: "Georgia, serif",
        color: "#5f5347",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
          background: "#fff",
        }}
      >
        <img
          src="/logo.jpeg"
          style={{ width: "90px", borderRadius: "8px" }}
        />

        <a
          href="https://wa.me/5567999481768"
          style={{
            background: "#b79d7b",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "30px",
            textDecoration: "none",
          }}
        >
          WhatsApp
        </a>
      </header>

      <section style={{ padding: "50px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "52px" }}>
          Geovana Acessórios
        </h1>
        <p>Peças modernas e elegantes</p>
      </section>

      <section style={{ padding: "20px" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "38px",
          }}
        >
          Novidades
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(230px,1fr))",
            gap: "20px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {produtos.map((item) => (
            <div
              key={item.id}
              style={{
                background: "#fff",
                borderRadius: "18px",
                padding: "15px",
                boxShadow: "0 10px 25px rgba(0,0,0,.05)",
              }}
            >
              <img
                src={item.imagem_url}
                style={{
                  width: "100%",
                  height: "230px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />

              <h3 style={{ fontSize: "16px" }}>
                {item.nome}
              </h3>

              <p style={{ fontWeight: "bold" }}>
                R$ {item.preco_venda}
              </p>

              <a
                href={`https://wa.me/5567999481768?text=Olá,%20tenho%20interesse%20em:%20${item.nome}`}
                target="_blank"
                style={{
                  display: "block",
                  background: "#5f5347",
                  color: "#fff",
                  padding: "12px",
                  borderRadius: "12px",
                  textDecoration: "none",
                }}
              >
                Comprar no WhatsApp
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
