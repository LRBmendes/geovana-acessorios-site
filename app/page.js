// app/page.js
"use client";

import { useEffect, useMemo, useState } from "react";

const WHATSAPP = "55679999481768";
const POR_PAGINA = 15;

// =====================================================
// API
// =====================================================
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

// =====================================================
// HELPERS
// =====================================================
function normalizar(txt = "") {
  return String(txt)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
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

// =====================================================
// FILTRO PRINCIPAL
// =====================================================
function ehPrata(produto) {
  const txt = textoCompleto(produto);

  return (
    txt.includes("prata") ||
    txt.includes("925") ||
    txt.includes("inox")
  );
}

function ehSemijoia(produto) {
  const txt = textoCompleto(produto);

  return !ehPrata(produto) || txt.includes("semi");
}

// =====================================================
// SUBTIPOS
// =====================================================
function ehBrinco(produto) {
  return textoCompleto(produto).includes("brinco");
}

function ehColar(produto) {
  const txt = textoCompleto(produto);

  return (
    txt.includes("colar") ||
    txt.includes("corrente") ||
    txt.includes("gargantilha") ||
    txt.includes("choker")
  );
}

function ehPulseira(produto) {
  const txt = textoCompleto(produto);

  return (
    txt.includes("pulseira") ||
    txt.includes("bracelete") ||
    txt.includes("pandora") ||
    txt.includes("elo")
  );
}

function ehAnel(produto) {
  const txt = textoCompleto(produto);

  return (
    txt.includes("anel") ||
    txt.includes("alianca") ||
    txt.includes("aliança") ||
    txt.includes("solitario") ||
    txt.includes("aro")
  );
}

// =====================================================
// PAGE
// =====================================================
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

  useEffect(() => {
    setPagina(1);
  }, [colecao, tipo, busca]);

  // =====================================================
  // FILTRO MASTER
  // =====================================================
  const filtrados = useMemo(() => {
    return produtos.filter((p) => {
      const txt = textoCompleto(p);

      const okBusca =
        busca.trim() === ""
          ? true
          : txt.includes(normalizar(busca));

      let okColecao = true;

      if (colecao === "Prata") {
        okColecao = ehPrata(p);
      }

      if (colecao === "Semijoias") {
        okColecao = ehSemijoia(p);
      }

      let okTipo = true;

      if (tipo === "Brincos") okTipo = ehBrinco(p);
      if (tipo === "Colares") okTipo = ehColar(p);
      if (tipo === "Pulseiras") okTipo = ehPulseira(p);
      if (tipo === "Anéis") okTipo = ehAnel(p);

      return okBusca && okColecao && okTipo;
    });
  }, [produtos, colecao, tipo, busca]);

  // =====================================================
  // PAGINAÇÃO
  // =====================================================
  const totalPaginas = Math.max(
    1,
    Math.ceil(filtrados.length / POR_PAGINA)
  );

  const lista = useMemo(() => {
    const inicio = (pagina - 1) * POR_PAGINA;
    return filtrados.slice(
      inicio,
      inicio + POR_PAGINA
    );
  }, [filtrados, pagina]);

  function paginasVisiveis() {
    let ini = Math.max(1, pagina - 2);
    let fim = Math.min(totalPaginas, pagina + 2);

    const arr = [];

    for (let i = ini; i <= fim; i++) {
      arr.push(i);
    }

    return arr;
  }

  // =====================================================
  // SELEÇÃO
  // =====================================================
  function adicionar(item) {
    if (
      selecao.find((x) => x.id === item.id)
    )
      return;

    setSelecao([...selecao, item]);
    setDrawer(true);
  }

  function remover(id) {
    setSelecao(
      selecao.filter((x) => x.id !== id)
    );
  }

  function limpar() {
    setSelecao([]);
  }

  function reservar() {
    if (selecao.length === 0) return;

    const texto = selecao
      .map((p) => `• ${p.nome}`)
      .join("%0A");

    window.open(
      `https://wa.me/${WHATSAPP}?text=Olá! Gostaria de reservar:%0A%0A${texto}`,
      "_blank"
    );
  }

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <main
      style={{
        background: "#faf8f5",
        minHeight: "100vh",
        color: "#4d3d31",
        fontFamily: "Georgia, serif",
      }}
    >
      {/* HERO */}
      <section
        style={{
          textAlign: "center",
          padding: "40px 20px",
        }}
      >
        <h1 style={{ fontSize: 54 }}>
          Elegância que encanta.
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "#7e6d60",
          }}
        >
          Versão V5.3 Correção Real Final
        </p>
      </section>

      {/* BUSCA */}
      <section
        style={{
          maxWidth: 900,
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
          }}
        />
      </section>

      {/* LINHA 1 */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          flexWrap: "wrap",
          padding: "30px 20px 12px",
        }}
      >
        {[
          "Todos",
          "Prata",
          "Semijoias",
        ].map((item) => (
          <button
            key={item}
            onClick={() =>
              setColecao(item)
            }
          >
            {item}
          </button>
        ))}
      </section>

      {/* LINHA 2 */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          flexWrap: "wrap",
          paddingBottom: 40,
        }}
      >
        {[
          "Todos",
          "Brincos",
          "Colares",
          "Pulseiras",
          "Anéis",
        ].map((item) => (
          <button
            key={item}
            onClick={() => setTipo(item)}
          >
            {item}
          </button>
        ))}
      </section>

      {/* GRID */}
      <section
        style={{
          maxWidth: 1500,
          margin: "0 auto",
          padding: "0 20px 60px",
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
              }}
            >
              <div
                onClick={() =>
                  setZoom(p.imagem_url)
                }
                style={{
                  height: 280,
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
                <h3
                  style={{
                    minHeight: 80,
                  }}
                >
                  {p.nome}
                </h3>

                <div
                  style={{
                    fontSize: 34,
                    fontWeight: "bold",
                  }}
                >
                  {moeda(p.preco_venda)}
                </div>

                <button
                  onClick={() =>
                    adicionar(p)
                  }
                  style={{
                    width: "100%",
                    marginTop: 14,
                  }}
                >
                  💎 Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PAGINAÇÃO */}
      {totalPaginas > 1 && (
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            paddingBottom: 80,
            flexWrap: "wrap",
          }}
        >
          {paginasVisiveis().map((n) => (
            <button
              key={n}
              onClick={() =>
                setPagina(n)
              }
            >
              {n}
            </button>
          ))}
        </section>
      )}

      {/* DRAWER */}
      {drawer && (
        <div
          style={{
            position: "fixed",
            right: 0,
            top: 0,
            width: 360,
            height: "100vh",
            background: "#fff",
            padding: 20,
            overflowY: "auto",
            zIndex: 999,
          }}
        >
          <h2>💎 Minha Seleção</h2>

          {selecao.map((item) => (
            <div key={item.id}>
              {item.nome}

              <button
                onClick={() =>
                  remover(item.id)
                }
              >
                🗑
              </button>
            </div>
          ))}

          <button
            onClick={reservar}
          >
            Reservar
          </button>

          <button
            onClick={limpar}
          >
            Limpar
          </button>
        </div>
      )}

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
              "rgba(0,0,0,.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={zoom}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
            }}
          />
        </div>
      )}
    </main>
  );
}
