// app/page.js
"use client";

import { useEffect, useMemo, useState } from "react";

const WHATSAPP = "55679999481768";
const POR_PAGINA = 15;

// ==================================================
// API
// ==================================================
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

// ==================================================
// HELPERS
// ==================================================
function normalizar(txt = "") {
  return String(txt).toLowerCase();
}

function textoCompleto(produto) {
  return normalizar(
    `${produto.nome || ""} ${produto.categoria || ""}`
  );
}

function moeda(v) {
  const n = Math.floor(Number(v || 0));
  return `R$ ${n},90`;
}

// -------------------------
// FILTRO PRINCIPAL
// -------------------------
function ehPrata(produto) {
  const txt = textoCompleto(produto);

  return (
    txt.includes("prata") ||
    txt.includes("925") ||
    txt.includes("banho de prata")
  );
}

function ehSemijoia(produto) {
  const txt = textoCompleto(produto);

  return (
    txt.includes("semijoia") ||
    txt.includes("semi joia") ||
    txt.includes("semi-joia") ||
    txt.includes("banho de ouro") ||
    txt.includes("dourado")
  );
}

// -------------------------
// SUBTIPO
// -------------------------
function ehBrinco(produto) {
  return textoCompleto(produto).includes("brinco");
}

function ehColar(produto) {
  const txt = textoCompleto(produto);

  return (
    txt.includes("colar") ||
    txt.includes("corrente")
  );
}

function ehPulseira(produto) {
  const txt = textoCompleto(produto);

  return (
    txt.includes("pulseira") ||
    txt.includes("bracelete") ||
    txt.includes("elo")
  );
}

function ehAnel(produto) {
  return textoCompleto(produto).includes("anel");
}

// ==================================================
// PAGE
// ==================================================
export default function Home() {
  const [produtos, setProdutos] = useState([]);

  const [colecao, setColecao] = useState("Todos");
  const [tipo, setTipo] = useState("Todos");

  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);

  const [zoom, setZoom] = useState(null);

  const [drawer, setDrawer] = useState(false);
  const [selecao, setSelecao] = useState([]);

  useEffect(() => {
    getProdutos().then(setProdutos);
  }, []);

  // reset pagina
  useEffect(() => {
    setPagina(1);
  }, [colecao, tipo, busca]);

  // ==================================================
  // FILTRAGEM PROFISSIONAL
  // ==================================================
  const filtrados = useMemo(() => {
    return produtos.filter((p) => {
      const txt = textoCompleto(p);

      // busca
      const okBusca =
        busca.trim() === ""
          ? true
          : txt.includes(
              busca.toLowerCase()
            );

      // linha 1
      let okColecao = true;

      if (colecao === "Prata") {
        okColecao = ehPrata(p);
      }

      if (colecao === "Semijoias") {
        okColecao = ehSemijoia(p);
      }

      // linha 2
      let okTipo = true;

      if (tipo === "Brincos") {
        okTipo = ehBrinco(p);
      }

      if (tipo === "Colares") {
        okTipo = ehColar(p);
      }

      if (tipo === "Pulseiras") {
        okTipo = ehPulseira(p);
      }

      if (tipo === "Anéis") {
        okTipo = ehAnel(p);
      }

      return (
        okBusca &&
        okColecao &&
        okTipo
      );
    });
  }, [produtos, colecao, tipo, busca]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(
      filtrados.length /
        POR_PAGINA
    )
  );

  const lista = useMemo(() => {
    const inicio =
      (pagina - 1) *
      POR_PAGINA;

    const fim =
      inicio + POR_PAGINA;

    return filtrados.slice(
      inicio,
      fim
    );
  }, [filtrados, pagina]);

  function paginasVisiveis() {
    let ini = Math.max(
      1,
      pagina - 2
    );

    let fim = Math.min(
      totalPaginas,
      pagina + 2
    );

    const arr = [];

    for (
      let i = ini;
      i <= fim;
      i++
    ) {
      arr.push(i);
    }

    return arr;
  }

  // ==================================================
  // SELECAO
  // ==================================================
  function adicionar(item) {
    const existe =
      selecao.find(
        (x) =>
          x.id === item.id
      );

    if (existe) return;

    setSelecao([
      ...selecao,
      item,
    ]);

    setDrawer(true);
  }

  function remover(id) {
    setSelecao(
      selecao.filter(
        (x) =>
          x.id !== id
      )
    );
  }

  function limpar() {
    setSelecao([]);
  }

  function reservar() {
    if (
      selecao.length === 0
    )
      return;

    const texto =
      selecao
        .map(
          (p) =>
            `• ${p.nome}`
        )
        .join("%0A");

    const url = `https://wa.me/${WHATSAPP}?text=Olá! Gostaria de reservar estas peças:%0A%0A${texto}`;

    window.open(
      url,
      "_blank"
    );
  }

  return (
    <main
      style={{
        background:
          "#faf8f5",
        minHeight:
          "100vh",
        fontFamily:
          "Georgia, serif",
        color:
          "#4d3d31",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          background:
            "#ffffffee",
          borderBottom:
            "1px solid #ece6de",
          padding:
            "16px 24px",
          position:
            "sticky",
          top: 0,
          zIndex: 99,
        }}
      >
        <div
          style={{
            maxWidth: 1500,
            margin:
              "0 auto",
            display:
              "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            gap: 20,
            flexWrap:
              "wrap",
          }}
        >
          <div
            style={{
              display:
                "flex",
              gap: 14,
              alignItems:
                "center",
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

            <strong
              style={{
                fontSize: 30,
              }}
            >
              Geovana
              Acessórios
            </strong>
          </div>

          <button
            onClick={() =>
              setDrawer(
                true
              )
            }
            style={{
              background:
                "#8f735d",
              color:
                "#fff",
              border:
                "none",
              padding:
                "12px 18px",
              borderRadius: 30,
              fontWeight:
                "bold",
              cursor:
                "pointer",
            }}
          >
            💎 Minha
            Seleção (
            {
              selecao.length
            }
            )
          </button>
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          textAlign:
            "center",
          padding:
            "45px 20px 25px",
        }}
      >
        <h1
          style={{
            fontSize: 58,
          }}
        >
          Elegância que
          encanta.
        </h1>

        <p
          style={{
            fontSize: 20,
            color:
              "#7e6d60",
          }}
        >
          Versão V5.1
          Filtros
          Inteligentes
        </p>
      </section>

      {/* BUSCA */}
      <section
        style={{
          maxWidth: 900,
          margin:
            "0 auto",
          padding:
            "0 20px",
        }}
      >
        <input
          value={busca}
          onChange={(
            e
          ) =>
            setBusca(
              e.target
                .value
            )
          }
          placeholder="Buscar produtos..."
          style={{
            width:
              "100%",
            padding: 18,
            borderRadius: 14,
            border:
              "1px solid #ddd",
            fontSize: 16,
          }}
        />
      </section>

      {/* LINHA 1 */}
      <section
        style={{
          display:
            "flex",
          justifyContent:
            "center",
          gap: 10,
          flexWrap:
            "wrap",
          padding:
            "30px 20px 15px",
        }}
      >
        {[
          "Todos",
          "Prata",
          "Semijoias",
        ].map(
          (item) => (
            <button
              key={
                item
              }
              onClick={() =>
                setColecao(
                  item
                )
              }
              style={{
                padding:
                  "12px 20px",
                borderRadius: 30,
                border:
                  "1px solid #ddd",
                background:
                  colecao ===
                  item
                    ? "#8f735d"
                    : "#fff",
                color:
                  colecao ===
                  item
                    ? "#fff"
                    : "#6f5d4f",
                fontWeight:
                  "bold",
                cursor:
                  "pointer",
              }}
            >
              {item}
            </button>
          )
        )}
      </section>

      {/* LINHA 2 */}
      <section
        style={{
          display:
            "flex",
          justifyContent:
            "center",
          gap: 10,
          flexWrap:
            "wrap",
          padding:
            "0 20px 40px",
        }}
      >
        {[
          "Todos",
          "Brincos",
          "Colares",
          "Pulseiras",
          "Anéis",
        ].map(
          (item) => (
            <button
              key={
                item
              }
              onClick={() =>
                setTipo(
                  item
                )
              }
              style={{
                padding:
                  "10px 16px",
                borderRadius: 30,
                border:
                  "1px solid #ddd",
                background:
                  tipo ===
                  item
                    ? "#d7c4b0"
                    : "#fff",
                color:
                  "#6f5d4f",
                fontWeight:
                  "bold",
                cursor:
                  "pointer",
              }}
            >
              {item}
            </button>
          )
        )}
      </section>

      {/* GRID */}
      <section
        style={{
          maxWidth: 1500,
          margin:
            "0 auto",
          padding:
            "0 20px 60px",
        }}
      >
        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",
            gap: 24,
          }}
        >
          {lista.map(
            (p) => (
              <div
                key={
                  p.id
                }
                style={{
                  background:
                    "#fff",
                  borderRadius: 18,
                  overflow:
                    "hidden",
                  boxShadow:
                    "0 8px 28px rgba(0,0,0,.05)",
                }}
              >
                <div
                  onClick={() =>
                    setZoom(
                      p.imagem_url
                    )
                  }
                  style={{
                    height: 290,
                    cursor:
                      "zoom-in",
                  }}
                >
                  <img
                    src={
                      p.imagem_url
                    }
                    style={{
                      width:
                        "100%",
                      height:
                        "100%",
                      objectFit:
                        "cover",
                    }}
                  />
                </div>

                <div
                  style={{
                    padding: 18,
                  }}
                >
                  <h3
                    style={{
                      minHeight: 78,
                      fontSize: 18,
                      lineHeight: 1.3,
                    }}
                  >
                    {
                      p.nome
                    }
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
                      adicionar(
                        p
                      )
                    }
                    style={{
                      width:
                        "100%",
                      padding: 13,
                      border:
                        "none",
                      borderRadius: 12,
                      background:
                        "#8f735d",
                      color:
                        "#fff",
                      fontWeight:
                        "bold",
                      cursor:
                        "pointer",
                    }}
                  >
                    💎
                    Adicionar
                    à
                    Seleção
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* PAGINACAO */}
      {totalPaginas >
        1 && (
        <section
          style={{
            display:
              "flex",
            justifyContent:
              "center",
            gap: 8,
            flexWrap:
              "wrap",
            paddingBottom: 80,
          }}
        >
          {pagina >
            1 && (
            <button
              onClick={() =>
                setPagina(
                  pagina -
                    1
                )
              }
            >
              {"<"}
            </button>
          )}

          {paginasVisiveis().map(
            (
              n
            ) => (
              <button
                key={
                  n
                }
                onClick={() =>
                  setPagina(
                    n
                  )
                }
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  border:
                    "1px solid #ddd",
                  background:
                    pagina ===
                    n
                      ? "#8f735d"
                      : "#fff",
                  color:
                    pagina ===
                    n
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

          {pagina <
            totalPaginas && (
            <button
              onClick={() =>
                setPagina(
                  pagina +
                    1
                )
              }
            >
              {">"}
            </button>
          )}
        </section>
      )}

      {/* DRAWER */}
      {drawer && (
        <>
          <div
            onClick={() =>
              setDrawer(
                false
              )
            }
            style={{
              position:
                "fixed",
              inset: 0,
              background:
                "rgba(0,0,0,.35)",
              zIndex: 200,
            }}
          />

          <div
            style={{
              position:
                "fixed",
              right: 0,
              top: 0,
              width: 390,
              maxWidth:
                "100%",
              height:
                "100vh",
              background:
                "#fff",
              zIndex: 201,
              padding: 20,
              overflowY:
                "auto",
            }}
          >
            <h2>
              💎 Minha
              Seleção
            </h2>

            {selecao.length ===
              0 && (
              <p>
                Nenhum
                item
                selecionado.
              </p>
            )}

            {selecao.map(
              (
                item
              ) => (
                <div
                  key={
                    item.id
                  }
                  style={{
                    display:
                      "flex",
                    gap: 12,
                    marginTop: 15,
                    borderBottom:
                      "1px solid #eee",
                    paddingBottom: 12,
                  }}
                >
                  <img
                    src={
                      item.imagem_url
                    }
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 10,
                      objectFit:
                        "cover",
                    }}
                  />

                  <div
                    style={{
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 14,
                      }}
                    >
                      {
                        item.nome
                      }
                    </div>

                    <strong>
                      {moeda(
                        item.preco_venda
                      )}
                    </strong>
                  </div>

                  <button
                    onClick={() =>
                      remover(
                        item.id
                      )
                    }
                  >
                    🗑
                  </button>
                </div>
              )
            )}

            {selecao.length >
              0 && (
              <>
                <button
                  onClick={
                    reservar
                  }
                  style={{
                    width:
                      "100%",
                    marginTop: 20,
                    padding: 14,
                    border:
                      "none",
                    borderRadius: 12,
                    background:
                      "#8f735d",
                    color:
                      "#fff",
                    fontWeight:
                      "bold",
                  }}
                >
                  ✨
                  Reservar
                  Peças
                </button>

                <button
                  onClick={
                    limpar
                  }
                  style={{
                    width:
                      "100%",
                    marginTop: 10,
                    padding: 12,
                  }}
                >
                  Limpar
                  Seleção
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* ZOOM */}
      {zoom && (
        <div
          onClick={() =>
            setZoom(
              null
            )
          }
          style={{
            position:
              "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,.75)",
            display:
              "flex",
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
              maxWidth:
                "90%",
              maxHeight:
                "90%",
              borderRadius: 18,
            }}
          />
        </div>
      )}
    </main>
  );
}
