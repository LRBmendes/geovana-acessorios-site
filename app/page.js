// app/page.js

"use client";

import { useEffect, useMemo, useState } from "react";

const WHATSAPP = "5567999481768";
const POR_PAGINA = 16;
const SITE_VERSION = "4.1.8";

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
  return normalizar(`${produto.nome || ""} ${produto.categoria || ""}`);
}

function moeda(v) {
  const n = Math.floor(Number(v || 0));
  return `R$ ${n},90`;
}

function nomeBonito(nome = "") {
  return nome
    .toLowerCase()
    .split(" ")
    .map((p) => (p ? p.charAt(0).toUpperCase() + p.slice(1) : ""))
    .join(" ")
    .trim();
}

// =====================================================
// FILTROS
// =====================================================
function ehPrata(produto) {
  const txt = textoCompleto(produto);

  return (
    txt.includes("prata") ||
    txt.includes("925") ||
    txt.includes("rodio branco")
  );
}

function ehSemijoia(produto) {
  const txt = textoCompleto(produto);

  return (
    txt.includes("semijoia") ||
    txt.includes("semi joia") ||
    txt.includes("semi-joia") ||
    txt.includes("dourado") ||
    txt.includes("rodio") ||
    txt.includes("ouro")
  );
}

function ehBrinco(produto) {
  const txt = textoCompleto(produto);

  return (
    txt.includes("brinco") ||
    txt.includes("argola") ||
    txt.includes("ear cuff") ||
    txt.includes("piercing")
  );
}

function ehColar(produto) {
  const txt = textoCompleto(produto);

  return (
    txt.includes("colar") ||
    txt.includes("corrente") ||
    txt.includes("choker") ||
    txt.includes("gargantilha") ||
    txt.includes("pingente")
  );
}

function ehPulseira(produto) {
  const txt = textoCompleto(produto);

  return txt.includes("pulseira") || txt.includes("bracelete");
}

function ehAnel(produto) {
  const txt = textoCompleto(produto);

  return (
    txt.includes("anel") ||
    txt.includes("alianca") ||
    txt.includes("aliança") ||
    txt.includes("solitario")
  );
}

// =====================================================
// COMPONENTE
// =====================================================
export default function Home() {
  const mobile =
typeof navigator !== "undefined" &&
/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [colecao, setColecao] = useState("Todos");
  const [tipo, setTipo] = useState("Todos");
  const [pagina, setPagina] = useState(1);

  const [drawer, setDrawer] = useState(false);
  const [selecao, setSelecao] = useState([]);

  const [zoom, setZoom] = useState(null);

  useEffect(() => {
    getProdutos().then(setProdutos);
  }, []);

  useEffect(() => {
    setPagina(1);
  }, [busca, colecao, tipo]);

  // =====================================================
  // FILTRAGEM
  // =====================================================
  const filtrados = useMemo(() => {
    return produtos.filter((p) => {
      const txt = textoCompleto(p);

      const okBusca =
        busca.trim() === ""
          ? true
          : txt.includes(normalizar(busca));

      let okColecao = true;

      if (colecao === "Prata") okColecao = ehPrata(p);
      if (colecao === "Semijoias") okColecao = ehSemijoia(p);

      let okTipo = true;

      if (tipo === "Brincos") okTipo = ehBrinco(p);
      if (tipo === "Colares") okTipo = ehColar(p);
      if (tipo === "Pulseiras") okTipo = ehPulseira(p);
      if (tipo === "Anéis") okTipo = ehAnel(p);

      return okBusca && okColecao && okTipo;
    });
  }, [produtos, busca, colecao, tipo]);

  // =====================================================
  // PAGINAÇÃO
  // =====================================================
  const totalPaginas = Math.max(
    1,
    Math.ceil(filtrados.length / POR_PAGINA)
  );

  const lista = useMemo(() => {
    const inicio = (pagina - 1) * POR_PAGINA;
    const fim = inicio + POR_PAGINA;

    return filtrados.slice(inicio, fim);
  }, [filtrados, pagina]);

  function paginasVisiveis() {
    const arr = [];

    const inicio = Math.max(1, pagina - 2);
    const fim = Math.min(totalPaginas, pagina + 2);

    for (let i = inicio; i <= fim; i++) {
      arr.push(i);
    }

    return arr;
  }

  // =====================================================
  // SELEÇÃO
  // =====================================================
  function adicionar(item) {
    if (selecao.find((x) => x.id === item.id)) return;

   setSelecao((prev) => [...prev, item]);

if (!mobile) {
  setDrawer(true);
}

if (mobile) {
  setDrawer(true);

  setTimeout(() => {
    setDrawer(false);
  }, 1200);
}
}
  function remover(id) {
    setSelecao(selecao.filter((x) => x.id !== id));
  }

  function limpar() {
    setSelecao([]);
  }

  function reservar() {
    if (selecao.length === 0) return;

    const texto = selecao
      .map((p) => `• ${nomeBonito(p.nome)}`)
      .join("%0A");

    const url = `https://wa.me/${WHATSAPP}?text=Olá! Separei algumas peças da Geovana Acessórios e gostaria de atendimento especial 💎%0A%0A${texto}`;

    window.open(url, "_blank");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8f5f1",
      }}
    >
     {/* HEADER */}
<header
  style={{
    position: "relative",
    zIndex: 1,
    background: "#fff",
    borderBottom: "1px solid #eee",
    padding: "14px 24px",
  }}
>
  <div
    style={{
      maxWidth: 1320,
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "1fr",
      justifyContent: "center",
flexWrap: "wrap",
textAlign: "center",
      gap: 18,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "center",
flexWrap: "wrap",
textAlign: "center",
        gap: 14,
        minWidth: 0,
      }}
    >
      <img
        src="/logo.jpeg"
        style={{
          width: 54,
          height: 54,
          borderRadius: 16,
          objectFit: "cover",
          flexShrink: 0,
        }}
      />

      <div>
        <div
          style={{
            fontSize: mobile ? 24 : 32,
            fontWeight: "bold",
            color: "#5a4333",
            lineHeight: 1,
          }}
        >
          Geovana Acessórios
        </div>

        <div
          style={{
            fontSize: 13,
            color: "#9a7e69",
            marginTop: 10,
          }}
        >
          Luxo acessível para todos os momentos
        </div>
      </div>
    </div>

    <button
      onClick={() => setDrawer(true)}
      style={{
        border: "none",
        background: "#8f735d",
        color: "#fff",
        padding: "14px 22px",
        borderRadius: 30,
        fontWeight: "bold",
        cursor: "pointer",
        whiteSpace: "nowrap",
        width:
  mobile ? "100%" : "auto",
marginTop:
  mobile ? 12 : 0,
      }}
    >
      💎 Minha Seleção ({selecao.length})
    </button>
  </div>
</header>

      {/* HERO PREMIUM */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          textAlign: "center",
          padding: "32px 20px 18px",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(34px,5vw,58px)",
            margin: 0,
            color: "#503a2f",
            lineHeight: 1.1,
          }}
        >
          Acessórios que elevam sua beleza.
        </h1>

        <p
          style={{
            marginTop: 18,
            fontSize: 20,
            color: "#8b7565",
            maxWidth: 760,
            marginInline: "auto",
            lineHeight: 1.5,
          }}
        >
          Peças delicadas, elegantes e selecionadas para mulheres
          que gostam de se destacar em todos os momentos.
        </p>
      </section>

      {/* BARRA CONFIANÇA */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 20px 30px",
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: 18,
            padding: "14px 20px",
            display: "flex",
            justifyContent: "center",
            gap: 18,
            flexWrap: "wrap",
            color: "#7b6556",
            fontSize: 14,
            fontWeight: "bold",
          }}
        >
          <span>✓ Atendimento rápido</span>
          <span>✓ Produtos selecionados</span>
          <span>✓ Pedido fácil no WhatsApp</span>
          <span>✓ Qualidade garantida</span>
        </div>
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
          placeholder="Buscar brincos, anéis, colares..."
          style={{
            width: "100%",
            padding: 18,
            borderRadius: 16,
            border: "1px solid #ddd",
            fontSize: 16,
            background: "#fff",
          }}
        />
      </section>

      {/* FILTROS */}
      <section
        style={{
          padding: "28px 20px 8px",
          display: "flex",
          justifyContent: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        {["Todos", "Prata", "Semijoias"].map((item) => (
          <button
            key={item}
            onClick={() => setColecao(item)}
            style={{
              border: "1px solid #ddd",
              padding: "12px 20px",
              borderRadius: 30,
              cursor: "pointer",
              fontWeight: "bold",
              background:
                colecao === item ? "#8f735d" : "#fff",
              color:
                colecao === item ? "#fff" : "#6d5848",
            }}
          >
            {item}
          </button>
        ))}
      </section>

      <section
        style={{
          padding: "0 20px 45px",
          display: "flex",
          justifyContent: "center",
          gap: 10,
          flexWrap: "wrap",
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
            style={{
              border: "1px solid #ddd",
              padding: "10px 16px",
              borderRadius: 30,
              cursor: "pointer",
              fontWeight: "bold",
              background:
                tipo === item ? "#e6d8cb" : "#fff",
              color: "#6d5848",
            }}
          >
            {item}
          </button>
        ))}
      </section>

      {/* GRID */}
      <section
        style={{
          maxWidth: 1450,
          margin: "0 auto",
          padding: "0 20px 60px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(270px,1fr))",
            gap: 28,
          }}
        >
          {lista.map((p) => (
            <div
              key={p.id}
              style={{
                background: "#fff",
                borderRadius: 24,
                overflow: "hidden",
                boxShadow:
                  "0 14px 34px rgba(0,0,0,.06)",
              }}
            >
              <div
                onClick={() => setZoom(p.imagem_url)}
                style={{
                  height: 310,
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

              <div style={{ padding: 22 }}>
                <h3
                  style={{
                    minHeight: 62,
                    margin: 0,
                    fontSize: 22,
                    lineHeight: 1.35,
                    color: "#4e3d31",
                    textAlign: "center",
                  }}
                >
                  {nomeBonito(p.nome).slice(0, 42)}
                </h3>

                <div
                  style={{
                    marginTop: 18,
                    marginBottom: 20,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 34,
                      fontWeight: "bold",
                      color: "#8f735d",
                      lineHeight: 1,
                    }}
                  >
                    {moeda(p.preco_venda)}
                  </div>

                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 12,
                      color: "#a38a77",
                      letterSpacing: 1,
                    }}
                  >
                    PEÇA EXCLUSIVA
                  </div>
                </div>

                <button
                  onClick={() => adicionar(p)}
                  style={{
                    width: "100%",
                    padding: 15,
                    border: "none",
                    borderRadius: 16,
                    cursor: "pointer",
                    background: "#8f735d",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: 15,
                  }}
                >
                  ✨ Quero Este
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
            justifyContent: "center",
flexWrap: "wrap",
textAlign: "center",
            gap: 8,
            flexWrap: "wrap",
            paddingBottom: 60,
          }}
        >
          {pagina > 1 && (
            <button onClick={() => setPagina(pagina - 1)}>
              ←
            </button>
          )}

          {paginasVisiveis().map((n) => (
            <button
              key={n}
              onClick={() => setPagina(n)}
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                border: "1px solid #ddd",
                background:
                  pagina === n ? "#8f735d" : "#fff",
                color:
                  pagina === n ? "#fff" : "#6d5848",
              }}
            >
              {n}
            </button>
          ))}

          {pagina < totalPaginas && (
            <button onClick={() => setPagina(pagina + 1)}>
              →
            </button>
          )}
        </section>
      )}

      {/* FOOTER */}
      <footer
        style={{
          textAlign: "center",
          padding: "26px 20px 40px",
          color: "#8c7768",
          fontSize: 13,
          borderTop: "1px solid #ece6de",
        }}
      >
        © {new Date().getFullYear()} Geovana Acessórios • Versão {SITE_VERSION}
      </footer>

      {/* DRAWER */}
      {drawer && (
        <>
          <div
            onClick={() => setDrawer(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.35)",
              zIndex: 100,
            }}
          />

          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: 390,
              maxWidth: "100%",
              height: "100vh",
              background: "#fff",
              zIndex: 101,
              padding: 22,
              overflowY: "auto",
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              💎 Minha Seleção
            </h2>
{mobile && (
  <button
    onClick={() => setDrawer(false)}
    style={{
      width: "100%",
      padding: 12,
      marginBottom: 14,
      borderRadius: 12,
      border: "1px solid #ddd",
      background: "#f5f5f5",
      cursor: "pointer",
      fontWeight: "bold"
    }}
  >
    ← Continuar escolhendo
  </button>
)}
            {selecao.length === 0 && (
              <p>Nenhum item selecionado.</p>
            )}

            {selecao.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: 12,
                  borderBottom: "1px solid #eee",
                  paddingBottom: 12,
                  marginBottom: 14,
                }}
              >
                <img
                  src={item.imagem_url}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 12,
                    objectFit: "cover",
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 14,
                      marginBottom: 6,
                    }}
                  >
                    {nomeBonito(item.nome)}
                  </div>

                  <strong>
                    {moeda(item.preco_venda)}
                  </strong>
                </div>

                <button
                  onClick={() => remover(item.id)}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  🗑
                </button>
              </div>
            ))}

            {selecao.length > 0 && (
              <>
                <button
                  onClick={reservar}
                  style={{
                    width: "100%",
                    padding: 14,
                    border: "none",
                    borderRadius: 14,
                    background: "#8f735d",
                    color: "#fff",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  ✨ Reservar no WhatsApp
                </button>

                <button
                  onClick={limpar}
                  style={{
                    width: "100%",
                    padding: 12,
                    marginTop: 10,
                    borderRadius: 14,
                    border: "1px solid #ddd",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Limpar Seleção
                </button>
              </>
            )}
          </div>
        </>
      )}
{mobile && (
  <button
    onClick={() => setDrawer(true)}
    style={{
      position: "fixed",
      bottom: 20,
      left: 20,
      right: 20,
      zIndex: 200,
      padding: 16,
      borderRadius: 16,
      border: "none",
      background: "#8f735d",
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    }}
  >
    💎 Minha Seleção ({selecao.length})
  </button>
)}
      {/* ZOOM */}
      {zoom && (
        <div
          onClick={() => setZoom(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.82)",
            display: "flex",
            justifyContent: "center",
            justifyContent: "center",
flexWrap: "wrap",
textAlign: "center",
            zIndex: 999,
            padding: 20,
          }}
        >
          <img
            src={zoom}
            style={{
              maxWidth: "92%",
              maxHeight: "92%",
              borderRadius: 18,
            }}
          />
        </div>
      )}
    </main>
  );
}
