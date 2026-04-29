// app/page.js
"use client";

import { useEffect, useMemo, useState } from "react";

const WHATSAPP = "55679999481768";
const POR_PAGINA = 16;

// ============================
// BUSCA DADOS
// ============================
async function carregarProdutos() {
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

// ============================
// HELPERS
// ============================
function precoPsicologico(v) {
  const n = Number(v || 0);
  const inteiro = Math.floor(n);
  return `${inteiro},90`;
}

function moeda(v) {
  return `R$ ${precoPsicologico(v)}`;
}

function grupo(cat = "") {
  const t = cat.toLowerCase();

  if (t.includes("prata")) return "Prata";
  if (t.includes("semi")) return "Semijoia";

  return "Acessórios";
}

function tipo(nome = "") {
  const t = nome.toLowerCase();

  if (t.includes("brinco")) return "Brincos";
  if (t.includes("colar")) return "Colares";
  if (t.includes("pulseira")) return "Pulseiras";
  if (t.includes("anel")) return "Anéis";
  if (t.includes("corrente")) return "Correntes";

  return "Diversos";
}

// ============================
// COMPONENTE
// ============================
export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    carregarProdutos().then(setProdutos);
  }, []);

  const lista = useMemo(() => {
    return produtos.filter((p) => {
      const nome = (p.nome || "").toLowerCase();
      const categoria = (p.categoria || "").toLowerCase();

      const matchBusca = nome.includes(busca.toLowerCase());

      let matchFiltro = true;

      if (filtro === "Prata")
        matchFiltro = grupo(categoria) === "Prata";

      if (filtro === "Semijoia")
        matchFiltro = grupo(categoria) === "Semijoia";

      if (["Brincos", "Colares", "Pulseiras", "Anéis"].includes(filtro))
        matchFiltro = tipo(nome) === filtro;

      return matchBusca && matchFiltro;
    });
  }, [produtos, busca, filtro]);

  const totalPaginas = Math.ceil(lista.length / POR_PAGINA);

  const paginados = lista.slice(
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
        color: "#4b3c32",
        fontFamily: "Georgia, serif",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          borderBottom: "1px solid #ece7e1",
          background: "#fff",
          padding: "18px 30px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 1450,
            margin: "0 auto",
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
              alt="logo"
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
              }}
            />

            <strong style={{ fontSize: 34 }}>
              Geovana Acessórios
            </strong>
          </div>

          <nav
            style={{
              display: "flex",
              gap: 18,
              fontSize: 16,
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
          textAlign: "center",
          padding: "70px 20px 40px",
        }}
      >
        <h1
          style={{
            fontSize: 62,
            marginBottom: 16,
          }}
        >
          Elegância que encanta.
        </h1>

        <p
          style={{
            fontSize: 24,
            color: "#7b6b5f",
            maxWidth: 700,
            margin: "0 auto",
            lineHeight: 1.5,
          }}
        >
          Peças delicadas e sofisticadas para valorizar sua beleza.
        </p>

        <p
          style={{
            marginTop: 18,
            fontSize: 14,
            color: "#b09a87",
          }}
        >
          V4 Luxury Light
        </p>
      </section>

      {/* BUSCA */}
      <section
        style={{
          maxWidth: 800,
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
          padding: "28px 20px 55px",
        }}
      >
        {[
          "Todos",
          "Prata",
          "Semijoia",
          "Brincos",
          "Colares",
          "Pulseiras",
          "Anéis",
        ].map((item) => (
          <button
            key={item}
            onClick={() => setFiltro(item)}
            style={{
              padding: "12px 20px",
              borderRadius: 30,
              border: "1px solid #d8c8b8",
              background:
                filtro === item ? "#8c735f" : "#fff",
              color:
                filtro === item ? "#fff" : "#6d5848",
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
          marginBottom: 40,
        }}
      >
        <h2
          style={{
            fontSize: 52,
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
            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",
            gap: 26,
          }}
        >
          {paginados.map((p) => (
            <div
              key={p.id}
              style={{
                background: "#fff",
                borderRadius: 18,
                overflow: "hidden",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  height: 300,
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
                      background: "#f7f2ec",
                      padding: "6px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                    }}
                  >
                    {grupo(p.categoria)}
                  </span>

                  <span
                    style={{
                      background: "#f7f2ec",
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
                    fontSize: 18,
                    minHeight: 70,
                    lineHeight: 1.3,
                  }}
                >
                  {p.nome}
                </h3>

                <div
                  style={{
                    fontSize: 34,
                    margin: "12px 0 18px",
                    fontWeight: "bold",
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
                    padding: 14,
                    borderRadius: 12,
                    background: "#8c735f",
                    color: "#fff",
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
          gap: 10,
          paddingBottom: 80,
          flexWrap: "wrap",
        }}
      >
        {Array.from(
          { length: totalPaginas },
          (_, i) => i + 1
        ).map((n) => (
          <button
            key={n}
            onClick={() => setPagina(n)}
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              border: "1px solid #d9c9bb",
              background:
                pagina === n ? "#8c735f" : "#fff",
              color:
                pagina === n ? "#fff" : "#6b5746",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {n}
          </button>
        ))}
      </section>
    </main>
  );
}
