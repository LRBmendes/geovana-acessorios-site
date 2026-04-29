// app/page.js
"use client";

import { useEffect, useMemo, useState } from "react";

const WHATSAPP = "55679999481768";
const POR_PAGINA = 16;

// ============================
// API
// ============================
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

// ============================
// HELPERS
// ============================
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

// ============================
// PAGE
// ============================
export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [pagina, setPagina] = useState(1);
  const [zoom, setZoom] = useState(null);
  const [selecao, setSelecao] = useState([]);

  useEffect(() => {
    getProdutos().then(setProdutos);
  }, []);

  // ============================
  // FILTROS
  // ============================
  const filtrados = useMemo(() => {
    return produtos.filter((p) => {
      const nome = (p.nome || "").toLowerCase();
      const categoria = (p.categoria || "").toLowerCase();

      const okBusca = nome.includes(busca.toLowerCase());

      let okFiltro = true;

      if (filtro === "Prata")
        okFiltro = grupo(categoria) === "Prata";

      if (filtro === "Semijoia")
        okFiltro = grupo(categoria) === "Semijoia";

      if (
        ["Brincos", "Colares", "Pulseiras", "Anéis"].includes(filtro)
      ) {
        okFiltro = tipo(nome) === filtro;
      }

      return okBusca && okFiltro;
    });
  }, [produtos, busca, filtro]);

  // Reset pagina ao mudar filtro
  useEffect(() => {
    setPagina(1);
  }, [busca, filtro]);

  const totalPaginas = Math.ceil(
    filtrados.length / POR_PAGINA
  );

  const lista = filtrados.slice(
    (pagina - 1) * POR_PAGINA,
    pagina * POR_PAGINA
  );

  // ============================
  // SELECAO
  // ============================
  function adicionar(item) {
    const existe = selecao.find(
      (x) => x.id === item.id
    );

    if (existe) return;

    setSelecao([...selecao, item]);
  }

  function remover(id) {
    setSelecao(
      selecao.filter((x) => x.id !== id)
    );
  }

  function enviarWhats() {
    const texto = selecao
      .map((p) => `• ${p.nome}`)
      .join("%0A");

    const url = `https://wa.me/${WHATSAPP}?text=Olá! Tenho interesse nestas peças:%0A%0A${texto}`;

    window.open(url, "_blank");
  }

  // ============================
  // PAGINACAO INTELIGENTE
  // ============================
  function paginasVisiveis() {
    let ini = Math.max(1, pagina - 2);
    let fim = Math.min(totalPaginas, pagina + 2);

    const arr = [];

    for (let i = ini; i <= fim; i++) {
      arr.push(i);
    }

    return arr;
  }

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
          borderBottom: "1px solid #ece6de",
          position: "sticky",
          top: 0,
          zIndex: 99,
        }}
      >
        <div
          style={{
            maxWidth: 1450,
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 14,
              alignItems: "center",
            }}
          >
            <img
              src="/logo.jpeg"
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
              }}
            />

            <strong style={{ fontSize: 30 }}>
              Geovana Acessórios
            </strong>
          </div>

          <button
            onClick={enviarWhats}
            style={{
              background: "#8f735d",
              color: "#fff",
              border: "none",
              padding: "12px 18px",
              borderRadius: 30,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            💎 Minha Seleção ({selecao.length})
          </button>
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          textAlign: "center",
          padding: "55px 20px 30px",
        }}
      >
        <h1 style={{ fontSize: 58 }}>
          Elegância que encanta.
        </h1>

        <p
          style={{
            fontSize: 22,
            color: "#7e6d60",
          }}
        >
          Versão V4.2 Conversão Comercial
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
          onChange={(e) =>
            setBusca(e.target.value)
          }
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
          gap: 10,
          flexWrap: "wrap",
          padding: "28px 20px 50px",
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
            onClick={() =>
              setFiltro(item)
            }
            style={{
              padding: "10px 18px",
              borderRadius: 30,
              border: "1px solid #ddd",
              background:
                filtro === item
                  ? "#8f735d"
                  : "#fff",
              color:
                filtro === item
                  ? "#fff"
                  : "#6f5d4f",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {item}
          </button>
        ))}
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
                onClick={() =>
                  setZoom(p.imagem_url)
                }
                style={{
                  height: 290,
                  cursor: "zoom-in",
                }}
              >
                <img
                  src={p.imagem_url}
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
                      background:
                        "#f8f3ed",
                      padding:
                        "6px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                    }}
                  >
                    {grupo(p.categoria)}
                  </span>

                  <span
                    style={{
                      background:
                        "#f8f3ed",
                      padding:
                        "6px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                    }}
                  >
                    {tipo(p.nome)}
                  </span>
                </div>

                <h3
                  style={{
                    minHeight: 70,
                    fontSize: 18,
                    lineHeight: 1.3,
                  }}
                >
                  {p.nome}
                </h3>

                <div
                  style={{
                    fontSize: 34,
                    fontWeight:
                      "bold",
                    margin:
                      "12px 0 16px",
                  }}
                >
                  {moeda(
                    p.preco_venda
                  )}
                </div>

                <button
                  onClick={() =>
                    adicionar(p)
                  }
                  style={{
                    width: "100%",
                    padding: 12,
                    border: "none",
                    borderRadius: 12,
                    background:
                      "#8f735d",
                    color: "#fff",
                    fontWeight:
                      "bold",
                    cursor: "pointer",
                  }}
                >
                  💎 Adicionar à Seleção
                </button>
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
            onClick={() =>
              setPagina(
                pagina - 1
              )
            }
          >
            {"<"}
          </button>
        )}

        {paginasVisiveis().map(
          (n) => (
            <button
              key={n}
              onClick={() =>
                setPagina(n)
              }
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                border:
                  "1px solid #ddd",
                background:
                  pagina === n
                    ? "#8f735d"
                    : "#fff",
                color:
                  pagina === n
                    ? "#fff"
                    : "#6f5d4f",
                fontWeight:
                  "bold",
              }}
            >
              {n}
            </button>
          )
        )}

        {pagina < totalPaginas && (
          <button
            onClick={() =>
              setPagina(
                pagina + 1
              )
            }
          >
            {">"}
          </button>
        )}
      </section>

      {/* ZOOM */}
      {zoom && (
        <div
          onClick={() =>
            setZoom(null)
          }
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.75)",
            display: "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
            zIndex: 999,
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
