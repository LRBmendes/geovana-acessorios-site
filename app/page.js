// app/page.js
"use client";

import { useEffect, useMemo, useState } from "react";

const WHATSAPP = "55679999481768";
const POR_PAGINA = 16;

// =========================
// BUSCA
// =========================
async function getProdutos() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/produtos?select=*&ativo=eq.true&order=id.desc`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_KEY}`,
        },
      }
    );

    return await res.json();
  } catch {
    return [];
  }
}

// =========================
// HELPERS
// =========================
function moeda(v) {
  const n = Math.floor(Number(v || 0));
  return `R$ ${n},90`;
}

function grupo(txt = "") {
  txt = txt.toLowerCase();

  if (txt.includes("prata")) return "Prata";
  if (txt.includes("semi")) return "Semijoia";
  return "Acessórios";
}

function tipo(txt = "") {
  txt = txt.toLowerCase();

  if (txt.includes("brinco")) return "Brincos";
  if (txt.includes("colar")) return "Colares";
  if (txt.includes("pulseira")) return "Pulseiras";
  if (txt.includes("anel")) return "Anéis";

  return "Diversos";
}

// =========================
// PAGE
// =========================
export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [pagina, setPagina] = useState(1);
  const [zoom, setZoom] = useState(null);

  useEffect(() => {
    getProdutos().then(setProdutos);
  }, []);

  const filtrados = useMemo(() => {
    return produtos.filter((p) => {
      const nome = (p.nome || "").toLowerCase();
      const categoria = (p.categoria || "").toLowerCase();

      const okBusca = nome.includes(busca.toLowerCase());

      let okFiltro = true;

      if (filtro === "Prata") okFiltro = grupo(categoria) === "Prata";
      if (filtro === "Semijoia")
        okFiltro = grupo(categoria) === "Semijoia";
      if (
        ["Brincos", "Colares", "Pulseiras", "Anéis"].includes(filtro)
      )
        okFiltro = tipo(nome) === filtro;

      return okBusca && okFiltro;
    });
  }, [produtos, busca, filtro]);

  const total = Math.ceil(filtrados.length / POR_PAGINA);

  const lista = filtrados.slice(
    (pagina - 1) * POR_PAGINA,
    pagina * POR_PAGINA
  );

  useEffect(() => {
    setPagina(1);
  }, [busca, filtro]);

  return (
    <main
      style={{
        background: "#faf8f5",
        minHeight: "100vh",
        color: "#4d3d31",
        fontFamily: "Georgia, serif",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          background: "#ffffffee",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 99,
          borderBottom: "1px solid #ece6de",
        }}
      >
        <div
          style={{
            maxWidth: 1450,
            margin: "0 auto",
            padding: "18px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
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
              style={{
                width: 58,
                height: 58,
                borderRadius: 14,
              }}
            />

            <strong style={{ fontSize: 30 }}>
              Geovana Acessórios
            </strong>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              flexWrap: "wrap",
            }}
          >
            <span>Início</span>
            <span>Prata</span>
            <span>Semijoia</span>

            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              style={{
                background: "#8f735d",
                color: "#fff",
                padding: "10px 18px",
                borderRadius: 30,
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              WhatsApp
            </a>
          </div>
        </div>
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
            fontSize: 58,
            marginBottom: 15,
          }}
        >
          Elegância que encanta.
        </h1>

        <p
          style={{
            maxWidth: 700,
            margin: "0 auto",
            fontSize: 22,
            color: "#7e6d60",
            lineHeight: 1.5,
          }}
        >
          Acessórios sofisticados para mulheres que gostam de
          presença.
        </p>

        <p
          style={{
            marginTop: 14,
            color: "#b39c89",
            fontSize: 14,
          }}
        >
          Versão V4.1 Luxury Refined
        </p>
      </section>

      {/* BUSCA */}
      <section
        style={{
          maxWidth: 850,
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar produtos..."
          style={{
            width: "100%",
            padding: 18,
            borderRadius: 14,
            border: "1px solid #ddd",
            fontSize: 16,
            background: "#fff",
          }}
        />
      </section>

      {/* FILTROS */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 12,
          padding: "30px 20px 50px",
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
            onClick={() => setFiltro(item)}
            style={{
              padding: "10px 18px",
              borderRadius: 30,
              border:
                filtro === item
                  ? "1px solid #8f735d"
                  : "1px solid #ddd",
              background:
                filtro === item ? "#8f735d" : "#fff",
              color:
                filtro === item ? "#fff" : "#6f5d4f",
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
          marginBottom: 35,
        }}
      >
        <h2 style={{ fontSize: 52 }}>
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
            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",
            gap: 24,
          }}
        >
          {lista.map((p) => (
            <div
              key={p.id}
              style={{
                background: "#fff",
                borderRadius: 18,
                overflow: "hidden",
                boxShadow:
                  "0 8px 28px rgba(0,0,0,0.05)",
              }}
            >
              <div
                onClick={() => setZoom(p.imagem_url)}
                style={{
                  height: 290,
                  cursor: "zoom-in",
                  overflow: "hidden",
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
                    flexWrap: "wrap",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      background: "#f8f3ed",
                      padding: "6px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                    }}
                  >
                    {grupo(p.categoria)}
                  </span>

                  <span
                    style={{
                      background: "#f8f3ed",
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
                    minHeight: 72,
                    lineHeight: 1.3,
                    fontSize: 18,
                  }}
                >
                  {p.nome}
                </h3>

                <div
                  style={{
                    fontSize: 34,
                    fontWeight: "bold",
                    margin: "12px 0 18px",
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
                    background: "#8f735d",
                    color: "#fff",
                    padding: 14,
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

      {/* PAGINACAO */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          flexWrap: "wrap",
          paddingBottom: 80,
        }}
      >
        {pagina > 1 && (
          <button
            onClick={() => setPagina(pagina - 1)}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
            }}
          >
            {"<"}
          </button>
        )}

        {Array.from(
          { length: Math.min(total, 5) },
          (_, i) => i + 1
        ).map((n) => (
          <button
            key={n}
            onClick={() => setPagina(n)}
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              border: "1px solid #ddd",
              background:
                pagina === n ? "#8f735d" : "#fff",
              color:
                pagina === n ? "#fff" : "#6f5d4f",
              fontWeight: "bold",
            }}
          >
            {n}
          </button>
        ))}

        {total > 5 && (
          <span style={{ padding: 10 }}>...</span>
        )}

        {pagina < total && (
          <button
            onClick={() => setPagina(pagina + 1)}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
            }}
          >
            {">"}
          </button>
        )}
      </section>

      {/* ZOOM */}
      {zoom && (
        <div
          onClick={() => setZoom(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
            padding: 20,
          }}
        >
          <img
            src={zoom}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 18,
            }}
          />
        </div>
      )}
    </main>
  );
}
