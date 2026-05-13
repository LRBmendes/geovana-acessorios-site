// app/page.js

"use client";

import { useEffect, useMemo, useState } from "react";

const WHATSAPP = "5567984224485";
const POR_PAGINA = 16;
const SITE_VERSION = "4.3.3";

const beneficios = [
  "Garantia nas peças",
  "Peças selecionadas",
  "Atendimento personalizado",
];

const termosTecnicosBloqueados = [
  "saquinho",
  "saquinho transp",
  "zip",
  "ziplock",
  "embalagem",
  "saco",
  "pacote",
  "plastico",
  "organizador",
  "material interno",
  "materiais internos",
];

const categoriasFiltro = [
  { value: "Todos", label: "Todos" },
  { value: "Semijoias", label: "Semi joias" },
  { value: "Prata", label: "Prata" },
  { value: "Ródio", label: "Ródio" },
];

const tiposFiltro = ["Todos", "Brincos", "Colares", "Pulseiras", "Anéis"];

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

function textoCategoria(produto) {
  return normalizar(produto.categoria || "");
}

function ehItemTecnico(produto) {
  const txt = textoCompleto(produto);

  return termosTecnicosBloqueados.some((termo) => txt.includes(normalizar(termo)));
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

function whatsappUrl(mensagem) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
}

function ehNovidade(produto) {
  const data =
    produto.imported_at ||
    produto.created_at ||
    produto.data_importacao;

  if (!data) return false;

  const dias =
    (Date.now() - new Date(data).getTime()) /
    (1000 * 60 * 60 * 24);

  return dias <= 30;
}

// =====================================================
// FILTROS
// =====================================================
function ehPrata(produto) {
  const txt = textoCompleto(produto);

  return (
    txt.includes("prata") ||
    txt.includes("925")
  );
}

function ehRodio(produto) {
  const txt = textoCompleto(produto);

  return txt.includes("rodio branco") || txt.includes("rodio") || txt.includes("ródio");
}

function ehSemijoia(produto) {
  const txt = textoCompleto(produto);
  const categoria = textoCategoria(produto);

  if (categoria.includes("semijoia") || categoria.includes("semi joia") || categoria.includes("semi-joia")) {
    return true;
  }

  return (
    !ehPrata(produto) &&
    (txt.includes("semijoia") ||
      txt.includes("semi joia") ||
      txt.includes("semi-joia") ||
      txt.includes("dourado") ||
      txt.includes("banho") ||
      txt.includes("ouro"))
  );
}

function ehBrinco(produto) {
  const txt = textoCompleto(produto);
  const categoria = textoCategoria(produto);

  if (categoria) {
    return (
      categoria.includes("brinco") ||
      categoria.includes("piercing") ||
      categoria.includes("ear cuff")
    );
  }

  return (
    txt.includes("brinco") ||
    txt.includes("argola") ||
    txt.includes("ear cuff") ||
    txt.includes("piercing")
  );
}

function ehColar(produto) {
  const txt = textoCompleto(produto);
  const categoria = textoCategoria(produto);

  if (categoria) {
    return (
      categoria.includes("colar") ||
      categoria.includes("corrente") ||
      categoria.includes("chocker") ||
      categoria.includes("choker") ||
      categoria.includes("gargantilha") ||
      categoria.includes("pingente")
    );
  }

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
  const categoria = textoCategoria(produto);

  if (categoria) {
    return categoria.includes("pulseira") || categoria.includes("bracelete");
  }

  return txt.includes("pulseira") || txt.includes("bracelete");
}

function ehAnel(produto) {
  const txt = textoCompleto(produto);
  const categoria = textoCategoria(produto);

  if (categoria) {
    return categoria.includes("anel") || categoria.includes("alianca") || categoria.includes("aliança");
  }

  return (
    txt.includes("anel") ||
    txt.includes("alianca") ||
    txt.includes("aliança") ||
    txt.includes("solitario")
  );
}

function produtoCombinaComColecao(produto, colecaoAtual) {
  if (colecaoAtual === "Todos") {
    return true;
  }

  if (colecaoAtual === "Prata") {
    return ehPrata(produto);
  }

  if (colecaoAtual === "Semijoias") {
    return ehSemijoia(produto);
  }

  if (colecaoAtual === "Ródio") {
    return ehRodio(produto);
  }

  return true;
}

function produtoCombinaComTipo(produto, tipoAtual) {
  if (tipoAtual === "Todos") {
    return true;
  }

  if (tipoAtual === "Brincos") {
    return ehBrinco(produto);
  }

  if (tipoAtual === "Colares") {
    return ehColar(produto);
  }

  if (tipoAtual === "Pulseiras") {
    return ehPulseira(produto);
  }

  if (tipoAtual === "Anéis") {
    return ehAnel(produto);
  }

  return true;
}

function produtoCombinaComBusca(produto, buscaAtual) {
  const termoBusca = normalizar(buscaAtual.trim());

  if (!termoBusca) {
    return true;
  }

  return textoCompleto(produto).includes(termoBusca);
}

function filtrarProdutos(produtosBase, filtros) {
  return produtosBase
    .filter((produto) => !ehItemTecnico(produto))
    .filter((produto) => produtoCombinaComColecao(produto, filtros.colecao))
    .filter((produto) => produtoCombinaComTipo(produto, filtros.tipo))
    .filter((produto) => produtoCombinaComBusca(produto, filtros.busca))
    .filter((produto) => (filtros.somenteNovidades ? ehNovidade(produto) : true));
}

function ordenarProdutos(produtosBase, ordenacaoAtual) {
  const dados = [...produtosBase];

  if (ordenacaoAtual === "novidades") {
    dados.sort((a, b) => {
      const dataA = new Date(a.imported_at || a.created_at || a.data_importacao || 0).getTime();
      const dataB = new Date(b.imported_at || b.created_at || b.data_importacao || 0).getTime();
      return dataB - dataA;
    });
  }

  if (ordenacaoAtual === "menor") {
    dados.sort((a, b) => Number(a.preco_venda || 0) - Number(b.preco_venda || 0));
  }

  if (ordenacaoAtual === "maior") {
    dados.sort((a, b) => Number(b.preco_venda || 0) - Number(a.preco_venda || 0));
  }

  return dados;
}

// =====================================================
// COMPONENTE
// =====================================================
export default function Home() {
  const [mobile, setMobile] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [colecao, setColecao] = useState("Todos");
  const [tipo, setTipo] = useState("Todos");
  const [somenteNovidades, setSomenteNovidades] = useState(false);
  const [ordenacao, setOrdenacao] = useState("padrao");
  const [pagina, setPagina] = useState(1);

  const [drawer, setDrawer] = useState(false);
  const [selecao, setSelecao] = useState([]);

  const [zoom, setZoom] = useState(null);

  useEffect(() => {
    getProdutos().then(setProdutos);
  }, []);

  useEffect(() => {
    function atualizarMobile() {
      setMobile(window.innerWidth <= 760);
    }

    atualizarMobile();
    window.addEventListener("resize", atualizarMobile);
    return () => window.removeEventListener("resize", atualizarMobile);
  }, []);

  useEffect(() => {
  setPagina(1);
}, [busca, colecao, tipo, ordenacao, somenteNovidades]);

  // =====================================================
  // FILTRAGEM
  // =====================================================
  const filtrados = useMemo(() => {
    return filtrarProdutos(produtos, {
      busca,
      colecao,
      tipo,
      somenteNovidades
    });
  }, [produtos, busca, colecao, tipo, somenteNovidades]);

  // =====================================================
  // PAGINAÇÃO
  // =====================================================
  const totalPaginas = Math.max(
    1,
    Math.ceil(filtrados.length / POR_PAGINA)
  );

  
  const lista = useMemo(() => {
  const dados = ordenarProdutos(filtrados, ordenacao);

  const inicio = (pagina - 1) * POR_PAGINA;
  const fim = inicio + POR_PAGINA;

  return dados.slice(inicio, fim);
}, [filtrados, pagina, ordenacao]);
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
const total = selecao.reduce((acc, item) => {
  return acc + Number(item.preco_venda || 0);
}, 0);

  function reservar() {
    const texto = selecao
      .map((p) => `• ${nomeBonito(p.nome)} - ${moeda(p.preco_venda)}`)
      .join("\n");

    const mensagem = `Olá, Geovana Semi Joias! Quero reservar essas peças e receber atendimento personalizado:\n\n${texto}\n\nPode me ajudar a finalizar?`;

    window.open(whatsappUrl(mensagem), "_blank");
  }

  function falarComAtendimento() {
    window.open(
      whatsappUrl(
        "Olá, Geovana Semi Joias! Quero atendimento personalizado para escolher uma peça elegante. Pode me ajudar?"
      ),
      "_blank"
    );
  }

  function verColecao() {
    document.getElementById("colecao")?.scrollIntoView({ behavior: "smooth" });
  }

  const selectStyle = {
    width: "100%",
    appearance: "none",
    border: "1px solid rgba(174,145,105,.38)",
    borderRadius: 18,
    padding: mobile ? "13px 42px 13px 15px" : "14px 44px 14px 16px",
    background:
      "linear-gradient(135deg,rgba(255,253,249,.98),rgba(246,238,227,.96))",
    color: "#513d30",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 12px 28px rgba(80,58,47,.08), inset 0 1px 0 rgba(255,255,255,.75)",
    transition: "border-color .18s ease, box-shadow .18s ease, transform .18s ease",
  };

  function resetarFiltros() {
    setBusca("");
    setColecao("Todos");
    setTipo("Todos");
    setSomenteNovidades(false);
    setOrdenacao("padrao");
    setPagina(1);
  }

  function atualizarOrdenacao(valor) {
    if (valor === "padrao") {
      resetarFiltros();
      return;
    }

    setOrdenacao(valor);
    setSomenteNovidades(valor === "novidades");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
  "linear-gradient(to bottom,#faf7f1,#f2e7d8 52%,#fbf8f3)",
      }}
    >
     {/* HEADER */}
<header
  style={{
    position: "sticky",
    top: 0,
    zIndex: 80,
    background: "rgba(250,247,241,.92)",
    borderBottom: "1px solid rgba(204,181,146,.35)",
    padding: mobile ? "8px 14px" : "10px 20px",
    backdropFilter: "blur(14px)",
  }}
>
  <div
    style={{
      maxWidth: 1320,
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: mobile ? 10 : 13,
        minWidth: 0,
      }}
    >
      <img
        src="/geovana-gv-mark.png"
        alt="Geovana Semi Joias"
        style={{
          width: mobile ? 42 : 50,
          height: mobile ? 42 : 50,
          borderRadius: mobile ? 15 : 18,
          objectFit: "cover",
          flexShrink: 0,
          boxShadow: "0 10px 24px rgba(80,58,47,.12)",
        }}
      />

      <div>
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: mobile ? 18 : 24,
            fontWeight: 500,
            letterSpacing: mobile ? 2.5 : 4,
            color: "#513d30",
            lineHeight: 1,
            textTransform: "uppercase",
          }}
        >
          Geovana
        </div>

        <div
          style={{
            fontSize: mobile ? 10 : 11,
            color: "#9a7e69",
            marginTop: 5,
            letterSpacing: mobile ? 2 : 3,
            textTransform: "uppercase",
          }}
        >
          Semi Joias
        </div>
      </div>
    </div>

    <button
  onClick={() => setDrawer(true)}
  style={{
    border: "1px solid rgba(255,255,255,.45)",
    background: "linear-gradient(135deg,#9a7b61,#6b5342)",
    color: "#fff",
    padding: mobile ? "10px 13px" : "12px 18px",
    borderRadius: 30,
    fontWeight: "bold",
    cursor: "pointer",
    whiteSpace: "nowrap",

    width: "fit-content",
    boxShadow: "0 12px 28px rgba(80,58,47,.16), inset 0 1px 0 rgba(255,255,255,.22)",
    fontSize: mobile ? 12 : 14,
  }}
>
  Seleção ({selecao.length})
</button>
  </div>
</header>

      {/* HERO PREMIUM */}
      <section
        style={{
          maxWidth: 980,
          margin: "0 auto",
          textAlign: "center",
          padding: mobile ? "20px 18px 14px" : "26px 28px 18px",
          position: "relative",
         overflow: "hidden",
          borderRadius: mobile ? 0 : 28,
          background:
  "linear-gradient(135deg,#fffdf9,#f2e4d2)",
          border: "1px solid rgba(204,181,146,.28)",
          boxShadow: mobile ? "none" : "0 18px 46px rgba(80,58,47,.06)",
        }}
      >
        <h1
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "clamp(24px,2.7vw,32px)",
            fontWeight: 500,
            margin: 0,
            color: "#4a372b",
            lineHeight: 1.1,
          }}
        >
          Semi joias para momentos que merecem presença.
        </h1>

             <p
          style={{
            marginTop: 8,
            fontSize: 14,
            color: "#8b7565",
            maxWidth: 760,
            marginInline: "auto",
            lineHeight: 1.5,
          }}
        >
          Curadoria delicada, acabamento premium e atendimento de boutique.
        </p>

        <div
          style={{
            marginTop: 14,
            display: "flex",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={verColecao}
            style={{
              border: "1px solid rgba(255,255,255,.55)",
              background: "linear-gradient(135deg,#92745e,#6f5745)",
              color: "#fff",
              padding: mobile ? "12px 18px" : "12px 20px",
              borderRadius: 30,
              fontWeight: "bold",
              cursor: "pointer",
              minWidth: mobile ? "100%" : 150,
              boxShadow: "0 12px 28px rgba(80,58,47,.18), inset 0 1px 0 rgba(255,255,255,.28)",
              transition: "transform .2s ease, box-shadow .2s ease, filter .2s ease",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.transform = "translateY(-1px)";
              event.currentTarget.style.filter = "brightness(1.03)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.transform = "translateY(0)";
              event.currentTarget.style.filter = "brightness(1)";
            }}
          >
            Ver coleção
          </button>

          <button
            onClick={falarComAtendimento}
            style={{
              border: "1px solid #d8c7b9",
              background: "rgba(255,255,255,.92)",
              color: "#6d5848",
              padding: mobile ? "12px 18px" : "12px 20px",
              borderRadius: 30,
              fontWeight: "bold",
              cursor: "pointer",
              minWidth: mobile ? "100%" : 220,
              boxShadow: "0 10px 24px rgba(80,58,47,.08)",
              transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.transform = "translateY(-1px)";
              event.currentTarget.style.borderColor = "#bfa996";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.transform = "translateY(0)";
              event.currentTarget.style.borderColor = "#d8c7b9";
            }}
          >
            Atendimento via WhatsApp
          </button>
        </div>
      </section>

      <section
        style={{
          maxWidth: 760,
          margin: "8px auto 0",
          padding: "0 16px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: mobile ? 8 : 18,
            flexWrap: "wrap",
          }}
        >
          {beneficios.map((beneficio) => (
            <div
              key={beneficio}
              style={{
                borderBottom: "1px solid #d8c7b9",
                padding: "0 2px 4px",
                textAlign: "center",
                color: "#8b7565",
                fontSize: 12,
              }}
            >
              {beneficio}
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: mobile ? "14px 16px 16px" : "18px 20px 20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
            gap: mobile ? 10 : 12,
            alignItems: "end",
          }}
        >
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ color: "#8b7565", fontSize: 11, letterSpacing: 1.8, textTransform: "uppercase" }}>
              Categoria
            </span>
            <select
              value={colecao}
              onChange={(event) => setColecao(event.target.value)}
              style={{
                ...selectStyle,
                backgroundImage:
                  "linear-gradient(135deg,rgba(255,253,249,.98),rgba(246,238,227,.96)), linear-gradient(45deg,transparent 50%,#8f735d 50%), linear-gradient(135deg,#8f735d 50%,transparent 50%)",
                backgroundPosition: "center, calc(100% - 22px) 52%, calc(100% - 16px) 52%",
                backgroundSize: "auto, 6px 6px, 6px 6px",
                backgroundRepeat: "no-repeat",
              }}
            >
              {categoriasFiltro.map((categoria) => (
                <option value={categoria.value} key={categoria.value}>
                  {categoria.label}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ color: "#8b7565", fontSize: 11, letterSpacing: 1.8, textTransform: "uppercase" }}>
              Tipo
            </span>
            <select
              value={tipo}
              onChange={(event) => setTipo(event.target.value)}
              style={{
                ...selectStyle,
                backgroundImage:
                  "linear-gradient(135deg,rgba(255,253,249,.98),rgba(246,238,227,.96)), linear-gradient(45deg,transparent 50%,#8f735d 50%), linear-gradient(135deg,#8f735d 50%,transparent 50%)",
                backgroundPosition: "center, calc(100% - 22px) 52%, calc(100% - 16px) 52%",
                backgroundSize: "auto, 6px 6px, 6px 6px",
                backgroundRepeat: "no-repeat",
              }}
            >
              {tiposFiltro.map((tipoFiltro) => (
                <option value={tipoFiltro} key={tipoFiltro}>
                  {tipoFiltro}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ color: "#8b7565", fontSize: 11, letterSpacing: 1.8, textTransform: "uppercase" }}>
              Ordenação
            </span>
            <select
              value={ordenacao}
              onChange={(event) => atualizarOrdenacao(event.target.value)}
              style={{
                ...selectStyle,
                backgroundImage:
                  "linear-gradient(135deg,rgba(255,253,249,.98),rgba(246,238,227,.96)), linear-gradient(45deg,transparent 50%,#8f735d 50%), linear-gradient(135deg,#8f735d 50%,transparent 50%)",
                backgroundPosition: "center, calc(100% - 22px) 52%, calc(100% - 16px) 52%",
                backgroundSize: "auto, 6px 6px, 6px 6px",
                backgroundRepeat: "no-repeat",
              }}
            >
              <option value="padrao">Padrão</option>
              <option value="maior">Maior preço</option>
              <option value="menor">Menor preço</option>
              <option value="novidades">Novidades</option>
            </select>
          </label>
        </div>
      </section>

      {/* GRID */}
      <section
        id="colecao"
        style={{
          maxWidth: 1450,
          margin: "0 auto",
          padding: mobile ? "0 16px 56px" : "0 20px 56px",
        }}
      >
        <div
          style={{
            maxWidth: 980,
            margin: "0 auto 14px",
            textAlign: "center",
            color: "#7b6556",
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          <strong style={{ color: "#503a2f" }}>{filtrados.length}</strong> peças selecionadas.
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
  mobile ? "minmax(0, min(100%, 320px))" : "repeat(auto-fit,minmax(270px,320px))",
justifyContent: mobile || lista.length <= 3 ? "center" : "start",
            gap: mobile ? 18 : 26,
          }}
        >
      {produtos.length === 0 && (
        <div style={{ textAlign: "center", padding: 40 }}>
    Carregando produtos...
  </div>
)}
          {lista.map((p) => (
            <div
  key={p.id}

  onMouseEnter={(e) => {
    if (!mobile) {
      e.currentTarget.style.transform = "translateY(-6px)";
      e.currentTarget.style.boxShadow =
        "0 24px 52px rgba(80,58,47,.14)";
    }
  }}

  onMouseLeave={(e) => {
    if (!mobile) {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow =
        "0 16px 38px rgba(80,58,47,.07)";
    }
  }}

  style={{
    background: "#fffdf9",
    border: "1px solid rgba(204,181,146,.24)",
    borderRadius: 22,
    overflow: "hidden",
    boxShadow:
      "0 16px 38px rgba(80,58,47,.07)",
    transition: "transform .25s ease, box-shadow .25s ease",
    width: "100%",
  }}
>
           <div
  style={{
    position: "relative",
  }}
>
  {ehNovidade(p) && (
    <div
      style={{
        position: "absolute",
        top: 14,
        left: 14,
        zIndex: 2,
        background:
          "linear-gradient(135deg,#d9bf8f,#b78945)",
        color: "#fffdf8",
        padding: "6px 12px",
        borderRadius: 30,
        fontSize: 11,
        fontWeight: "bold",
        boxShadow:
          "0 8px 18px rgba(116,78,35,.18)",
      }}
    >
      NOVIDADE
    </div>
  )}

  <div
    onClick={() => setZoom(p.imagem_url)}
  onMouseEnter={(e) =>
    e.currentTarget.querySelector("img").style.transform = "scale(1.05)"
  }
  onMouseLeave={(e) =>
    e.currentTarget.querySelector("img").style.transform = "scale(1)"
  }
        style={{
    width: "100%",
    aspectRatio: "4 / 5",
    cursor: "zoom-in",
    overflow: "hidden",
  }}
>
  <img
  src={p.imagem_url}
  alt={nomeBonito(p.nome)}
  loading="lazy"
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.3s ease", 
  }}
/>
</div>
</div>

             <div style={{ padding: 22 }}>
  <h3
  style={{
    minHeight: 62,
    margin: 0,
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 17,
    fontWeight: 500,
      lineHeight: 1.35,
      color: "#46372d",
      textAlign: "center",
    }}
  >
    {nomeBonito(p.nome).slice(0, 42)}
  </h3>
  {/*<div
  style={{
    display: "inline-block",
    background: "#fff3e8",
    color: "#b66a2c",
    padding: "6px 12px",
    borderRadius: 30,
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 12,
  }}
>
  🔥 Peça em alta
</div>*/}
  <div
    style={{
      marginTop: 18,
      marginBottom: 20,
      textAlign: "center",
    }}
  >
    <div
      style={{
        fontSize: 38,
        letterSpacing: -1,
        fontWeight: "bold",
        color: "#8c6b4f",
        lineHeight: 1,
      }}
    >
      {moeda(p.preco_venda)}
    </div>

    <div
      style={{
        marginTop: 6,
        fontSize: 12,
        color: "#a08a75",
      }}
    >
      Edição selecionada
    </div>

    <div
      style={{
        marginTop: 8,
        margin: "0 auto 12px",
        display: "block",
        width: "fit-content",
        background: ehPrata(p) ? "#f1eee7" : "#fbf4e7",
        color: ehPrata(p) ? "#6a665f" : "#9a6f36",
        padding: "5px 12px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: "bold",
  }}
>
        {ehPrata(p)
          ? "GARANTIA VITALÍCIA"
          : ehSemijoia(p)
          ? "1 ANO DE GARANTIA"
          : ""}
</div>
  </div> 

  {/* BOTÃO PRINCIPAL */}
<button
  onClick={() => adicionar(p)}

  onMouseEnter={(e)=>{
    if(!mobile){
      e.currentTarget.style.transform="translateY(-1px)"
      e.currentTarget.style.filter="brightness(1.03)"
    }
  }}

  onMouseLeave={(e)=>{
    if(!mobile){
      e.currentTarget.style.transform="translateY(0)"
      e.currentTarget.style.filter="brightness(1)"
    }
  }}
  style={{
    width: "100%",
    padding: 14,
    border: "1px solid rgba(255,255,255,.48)",
    borderRadius: 16,
    cursor: "pointer",
    background:
      "linear-gradient(135deg,#967761,#6f5745)",
    boxShadow:
      "0 12px 24px rgba(80,58,47,.18), inset 0 1px 0 rgba(255,255,255,.25)",
    transition: "transform .2s ease, box-shadow .2s ease, filter .2s ease",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  }}
>
  Quero reservar essa peça
</button>

{/* BOTÃO SECUNDÁRIO */}
<button
  onClick={() => {
    const texto = `Olá, Geovana Semi Joias! Quero garantir essa peça: ${nomeBonito(p.nome)}. Pode me atender pelo WhatsApp?`;
    window.open(
      whatsappUrl(texto),
      "_blank"
    );
  }}
  style={{
    width: "100%",
    marginTop: 8,
    padding: 10,
    borderRadius: 12,
    border: "1px solid #e1d4ca",
    background: "#fff",
    color: "#6d5848",
    fontWeight: "bold",
    fontSize: 13,
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(80,58,47,.05)",
    transition: "transform .2s ease, border-color .2s ease, box-shadow .2s ease",
  }}
  onMouseEnter={(event) => {
    if (!mobile) {
      event.currentTarget.style.transform = "translateY(-1px)";
      event.currentTarget.style.borderColor = "#bfa996";
    }
  }}
  onMouseLeave={(event) => {
    if (!mobile) {
      event.currentTarget.style.transform = "translateY(0)";
      event.currentTarget.style.borderColor = "#e1d4ca";
    }
  }}
>
  Falar com atendimento
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
       <>
  © {new Date().getFullYear()} Geovana Semi Joias • Versão {SITE_VERSION}
  <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
    Desenvolvido por Luís Mendes
  </div>
</>
      </footer>

      {/* DRAWER */}
      {drawer && (
        <>
          <div
            onClick={() => setDrawer(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(40,30,24,.38)",
              zIndex: 100,
              opacity: 1,
              transition: "opacity .24s ease",
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
              padding: mobile ? "22px 18px 26px" : 22,
              overflowY: "auto",
              boxShadow: "-18px 0 40px rgba(40,30,24,.18)",
              transform: "translateX(0)",
              transition: "transform .28s ease",
            }}
          >
            <button
              type="button"
              aria-label="Fechar minha seleção"
              onClick={() => setDrawer(false)}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 38,
                height: 38,
                borderRadius: "50%",
                border: "1px solid #e6d8cb",
                background: "#fffaf6",
                color: "#6d5848",
                cursor: "pointer",
                fontSize: 22,
                lineHeight: 1,
                boxShadow: "0 8px 18px rgba(80,58,47,.08)",
                transition: "transform .18s ease, background .18s ease, box-shadow .18s ease",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.transform = "translateY(-1px)";
                event.currentTarget.style.background = "#f3e8df";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform = "translateY(0)";
                event.currentTarget.style.background = "#fffaf6";
              }}
            >
              ×
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
                paddingRight: 42,
              }}
            >
              <img
                src="/geovana-gv-mark.png"
                alt="Geovana Semi Joias"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 14,
                  objectFit: "cover",
                  boxShadow: "0 8px 18px rgba(80,58,47,.1)",
                }}
              />
              <h2
                style={{
                  margin: 0,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontWeight: 500,
                  color: "#46372d",
                }}
              >
                Minha seleção
              </h2>
            </div>
  <button
  onClick={() => setDrawer(false)}

  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#f3e8df";
  }}

  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#fffaf6";
  }}

  style={{
    width: "100%",
    padding: 12,
    marginBottom: 14,
    borderRadius: 12,
    border: "1px solid #e6d8cb",
    background: "#fffaf6",
    color: "#8f735d",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 8px 18px rgba(80,58,47,.05)",
    transition: "transform .18s ease, background .18s ease, box-shadow .18s ease",
  }}
>
  ← Ver mais produtos
</button>
            {selecao.length === 0 && (
              <p>Escolha suas peças favoritas para receber atendimento personalizado.</p>
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
                  alt={nomeBonito(item.nome)}
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
<div
  style={{
    textAlign: "center",
    margin: "14px auto 18px",
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid #e6d8cb",
    background: "#fff",
    maxWidth: 240,
  }}
>
  <div
    style={{
      fontSize: 12,
      color: "#9a7e69",
      marginBottom: 6,
    }}
  >
    Total da seleção
  </div>

  <div
    style={{
      fontSize: 22,
      fontWeight: "bold",
      color: "#8f735d",
    }}
  >
    {moeda(total)}
  </div>
</div>

                <button
                  onClick={reservar}
                  style={{
                    width: "100%",
                    padding: 14,
                    border: "none",
                    borderRadius: 14,
                    background: "linear-gradient(135deg,#967761,#6f5745)",
                    color: "#fff",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 12px 24px rgba(80,58,47,.18)",
                    transition: "transform .2s ease, filter .2s ease",
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.transform = "translateY(-1px)";
                    event.currentTarget.style.filter = "brightness(1.03)";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.transform = "translateY(0)";
                    event.currentTarget.style.filter = "brightness(1)";
                  }}
                >
                  Garantir minhas peças pelo WhatsApp
                </button>

                <button
                  onClick={limpar}
                  style={{
                    width: "100%",
                    padding: 12,
                    marginTop: 10,
                    borderRadius: 14,
                    border: "1px solid #e1d4ca",
                    background: "#fff",
                    cursor: "pointer",
                    color: "#6d5848",
                    boxShadow: "0 8px 18px rgba(80,58,47,.05)",
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
      border: "1px solid rgba(255,255,255,.45)",
      background: "linear-gradient(135deg,#967761,#6f5745)",
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
      boxShadow: "0 14px 28px rgba(80,58,47,.22), inset 0 1px 0 rgba(255,255,255,.24)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    }}
  >
    Minha seleção ({selecao.length})
  </button>
)}
      <button
        onClick={falarComAtendimento}
        aria-label="Falar com atendimento Geovana pelo WhatsApp"
        style={{
          position: "fixed",
          right: mobile ? 20 : 24,
          bottom: mobile ? 86 : 24,
          zIndex: 210,
          border: "none",
          borderRadius: 18,
          background: "linear-gradient(135deg,#7c8b71,#5f6e55)",
          color: "#fff",
          padding: mobile ? "13px 16px" : "14px 18px",
          fontWeight: "bold",
          fontSize: mobile ? 14 : 15,
          cursor: "pointer",
          boxShadow: "0 12px 26px rgba(60,72,54,.2), inset 0 1px 0 rgba(255,255,255,.22)",
          maxWidth: mobile ? "calc(100% - 40px)" : 280,
          transition: "transform .2s ease, filter .2s ease",
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.transform = "translateY(-1px)";
          event.currentTarget.style.filter = "brightness(1.03)";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.transform = "translateY(0)";
          event.currentTarget.style.filter = "brightness(1)";
        }}
      >
        Falar com atendimento
      </button>
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
      zIndex: 999,
      padding: 20,
    }}
  >
    {/* BOTÃO FECHAR */}
    <button
      onClick={(e) => {
        e.stopPropagation(); // 👈 importante
        setZoom(null);
      }}
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        background: "#fff",
        color: "#000",
        border: "none",
        borderRadius: "50%",
        width: 40,
        height: 40,
        fontSize: 20,
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      ✕
    </button>

    <img
      src={zoom}
      alt="Peça Geovana Semi Joias em detalhe"
      style={{
        maxWidth: "92%",
        maxHeight: "92%",
        width: "auto",
        height: "auto",
        objectFit: "contain",
        borderRadius: 18,
        
      }}
    />
  </div>
)}
 
    </main>
  );
}
