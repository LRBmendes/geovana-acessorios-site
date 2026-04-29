import Image from "next/image";

// ==========================================
// CONFIG
// ==========================================
const WHATSAPP = "55679999481768"; // atualizado

// ==========================================
// SUPABASE
// ==========================================
async function getProdutos() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/produtos?select=*&ativo=eq.true&order=id.desc`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_KEY}`,
        },
        cache: "no-store",
      }
    );

    return await res.json();
  } catch {
    return [];
  }
}

// ==========================================
// HELPERS
// ==========================================
function moeda(v) {
  return Number(v).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function categoriaPrincipal(txt = "") {
  txt = txt.toLowerCase();

  if (txt.includes("prata")) return "Prata";
  if (txt.includes("semijoia")) return "Semijoia";
  return "Outros";
}

function tipoProduto(txt = "") {
  txt = txt.toLowerCase();

  if (txt.includes("brinco")) return "Brincos";
  if (txt.includes("colar")) return "Colares";
  if (txt.includes("pulseira")) return "Pulseiras";
  if (txt.includes("anel")) return "Anéis";
  if (txt.includes("corrente")) return "Correntes";

  return "Diversos";
}

// ==========================================
// PAGE
// ==========================================
export default async function Home() {
  const produtos = await getProdutos();

  const destaque = produtos.slice(0, 16);

  return (
    <main
      style={{
        background: "#f3eee6",
        minHeight: "100vh",
        fontFamily: "Georgia, serif",
        color: "#5b4a3e",
      }}
    >
      {/* TOPO */}
      <header
        style={{
          padding: "20px 30px",
          borderBottom: "1px solid #e3dbd0",
          background: "#f8f4ed",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 28 }}>Geovana Acessórios</h2>

          <nav style={{ display: "flex", gap: 20, fontSize: 15 }}>
            <span>Início</span>
            <span>Prata</span>
            <span>Semijoia</span>
            <span>Novidades</span>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          textAlign: "center",
          padding: "70px 20px 40px",
        }}
      >
        <h1
          style={{
            fontSize: 64,
            marginBottom: 15,
          }}
        >
          Elegância que Encanta
        </h1>

        <p style={{ fontSize: 22, opacity: 0.8 }}>
          Peças modernas, femininas e sofisticadas
        </p>

        <p style={{ marginTop: 15, fontSize: 14, opacity: 0.6 }}>
          Versão Premium V2.1
        </p>
      </section>

      {/* FILTROS */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          gap: 15,
          justifyContent: "center",
          flexWrap: "wrap",
          padding: "10px 20px 50px",
        }}
      >
        {[
          "Todos",
          "Prata",
          "Semijoia",
          "Brincos",
          "Colares",
          "Pulseiras",
        ].map((item) => (
          <button
            key={item}
            style={{
              padding: "12px 22px",
              borderRadius: 30,
              border: "none",
              background: "#6b5a4e",
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            {item}
          </button>
        ))}
      </section>

      {/* PRODUTOS */}
      <section
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 20px 80px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: 54,
            marginBottom: 50,
          }}
        >
          Catálogo Premium
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 28,
          }}
        >
          {destaque.map((p) => {
            const cat1 = categoriaPrincipal(p.categoria);
            const cat2 = tipoProduto(p.nome);

            return (
              <div
                key={p.id}
                style={{
                  background: "#fff",
                  borderRadius: 22,
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                }}
              >
                <div style={{ position: "relative", height: 280 }}>
                  <Image
                    src={p.imagem_url}
                    alt={p.nome}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>

                <div style={{ padding: 18 }}>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginBottom: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        background: "#efe8dd",
                        padding: "5px 10px",
                        borderRadius: 20,
                        fontSize: 12,
                      }}
                    >
                      {cat1}
                    </span>

                    <span
                      style={{
                        background: "#efe8dd",
                        padding: "5px 10px",
                        borderRadius: 20,
                        fontSize: 12,
                      }}
                    >
                      {cat2}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: 24,
                      lineHeight: 1.2,
                      minHeight: 68,
                    }}
                  >
                    {p.nome}
                  </h3>

                  <p
                    style={{
                      fontSize: 34,
                      margin: "10px 0 20px",
                      fontWeight: "bold",
                    }}
                  >
                    {moeda(p.preco_venda)}
                  </p>

                  <a
                    href={`https://wa.me/${WHATSAPP}?text=Olá! Tenho interesse em: ${encodeURIComponent(
                      p.nome
                    )}`}
                    target="_blank"
                    style={{
                      display: "block",
                      textAlign: "center",
                      background: "#6b5a4e",
                      color: "#fff",
                      padding: "14px",
                      borderRadius: 14,
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Comprar no WhatsApp
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
