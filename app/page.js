// app/page.js

// ==========================================
// V3 PREMIUM INSTAGRAM 2026
// Geovana Acessórios
// Produtos por página: 16
// ==========================================

const WHATSAPP = "55679999481768";
const PRODUTOS_POR_PAGINA = 16;

// ==========================================
// BUSCAR PRODUTOS
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

function categoria(txt = "") {
  txt = txt.toLowerCase();

  if (txt.includes("prata")) return "Prata";
  if (txt.includes("semijoia")) return "Semijoia";
  return "Acessórios";
}

function tipo(txt = "") {
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
  const lista = produtos.slice(0, PRODUTOS_POR_PAGINA);

  return (
    <main
      style={{
        background: "#ffffff",
        color: "#111",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          borderBottom: "1px solid #eee",
          padding: "18px 30px",
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 99,
        }}
      >
        <div
          style={{
            maxWidth: 1450,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <img
              src="/logo.jpeg"
              alt="Logo"
              style={{
                width: 52,
                height: 52,
                borderRadius: 12,
              }}
            />

            <strong style={{ fontSize: 28 }}>Geovana Acessórios</strong>
          </div>

          <nav
            style={{
              display: "flex",
              gap: 22,
              fontSize: 15,
              color: "#555",
            }}
          >
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
          maxWidth: 1300,
          margin: "0 auto",
          padding: "70px 20px 50px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 62,
            marginBottom: 20,
            lineHeight: 1.1,
          }}
        >
          Peças que elevam sua presença.
        </h1>

        <p
          style={{
            maxWidth: 700,
            margin: "0 auto",
            fontSize: 22,
            color: "#666",
            lineHeight: 1.5,
          }}
        >
          Semijoias e acessórios selecionados para mulheres que gostam de
          elegância.
        </p>

        <p
          style={{
            marginTop: 18,
            fontSize: 13,
            color: "#999",
          }}
        >
          V3 Premium Instagram 2026
        </p>
      </section>

      {/* BUSCA */}
      <section
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "0 20px 30px",
        }}
      >
        <input
          placeholder="Buscar produtos..."
          style={{
            width: "100%",
            padding: 18,
            borderRadius: 14,
            border: "1px solid #ddd",
            fontSize: 16,
          }}
        />
      </section>

      {/* FILTROS */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          flexWrap: "wrap",
          padding: "0 20px 60px",
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
              padding: "12px 20px",
              borderRadius: 40,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {item}
          </button>
        ))}
      </section>

      {/* TITULO */}
      <section
        style={{
          textAlign: "center",
          marginBottom: 45,
        }}
      >
        <h2
          style={{
            fontSize: 48,
            margin: 0,
          }}
        >
          Catálogo Premium
        </h2>
      </section>

      {/* PRODUTOS */}
      <section
        style={{
          maxWidth: 1450,
          margin: "0 auto",
          padding: "0 20px 70px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 26,
          }}
        >
          {lista.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 18,
                overflow: "hidden",
                background: "#fff",
                transition: "0.2s",
              }}
            >
              <div
                style={{
                  height: 300,
                  overflow: "hidden",
                  background: "#f8f8f8",
                }}
              >
                <img
                  src={p.imagem_url}
                  alt={p.nome}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div style={{ padding: 18 }}>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      background: "#f5f5f5",
                      padding: "6px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                    }}
                  >
                    {categoria(p.categoria)}
                  </span>

                  <span
                    style={{
                      background: "#f5f5f5",
                      padding: "6px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                    }}
                  >
                    {tipo(p.nome)}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: 22,
                    lineHeight: 1.25,
                    minHeight: 65,
                    marginBottom: 14,
                  }}
                >
                  {p.nome}
                </h3>

                <div
                  style={{
                    fontSize: 34,
                    fontWeight: "bold",
                    marginBottom: 18,
                  }}
                >
                  {moeda(p.preco_venda)}
                </div>

                <a
                  href={`https://wa.me/${WHATSAPP}?text=Olá! Tenho interesse em: ${encodeURIComponent(
                    p.nome
                  )}`}
                  target="_blank"
                  style={{
                    display: "block",
                    textAlign: "center",
                    background: "#111",
                    color: "#fff",
                    padding: "15px",
                    borderRadius: 12,
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Comprar no WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PAGINACAO VISUAL */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          paddingBottom: 80,
          flexWrap: "wrap",
        }}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              border: "1px solid #ddd",
              background: n === 1 ? "#111" : "#fff",
              color: n === 1 ? "#fff" : "#111",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {n}
          </button>
        ))}
      </section>
    </main>
  );
}
