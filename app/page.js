// app/page.js

"use client";

import { useEffect, useMemo, useState } from "react";

const WHATSAPP = "5567984224485";
const POR_PAGINA = 16;
const SITE_VERSION = "4.2.0";

const beneficios = [
  "Garantia nas peças",
  "Atendimento humanizado",
  "Peças selecionadas",
  "Qualidade premium",
  "Envio seguro",
  "Atendimento rápido",
];

const depoimentos = [
  {
    nome: "Cliente Geovana",
    texto: "Atendimento impecável, peça linda e chegou muito bem embalada.",
  },
  {
    nome: "Compra pelo WhatsApp",
    texto: "Amei a curadoria. Me ajudaram a escolher uma peça delicada para presente.",
  },
  {
    nome: "Experiência premium",
    texto: "As peças são ainda mais bonitas pessoalmente. Voltarei a comprar.",
  },
];

const momentosInstagram = [
  "Looks delicados para o dia a dia",
  "Presentes com brilho e carinho",
  "Novidades escolhidas uma a uma",
];

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
      
      const okNovidade =
        somenteNovidades ? ehNovidade(p) : true;
      
      return (
        okBusca &&
        okColecao &&
        okTipo &&
        okNovidade
);
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
  let dados = [...filtrados];

  if (ordenacao === "menor") {
  dados.sort((a, b) => Number(a.preco_venda || 0) - Number(b.preco_venda || 0));
}

if (ordenacao === "maior") {
  dados.sort((a, b) => Number(b.preco_venda || 0) - Number(a.preco_venda || 0));
}

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

const totalPix = total * 0.95;
  function reservar() {
    const texto = selecao
      .map((p) => `• ${nomeBonito(p.nome)} - ${moeda(p.preco_venda)}`)
      .join("\n");

    const mensagem = `Olá, Geovana Acessórios! Quero reservar essas peças e receber atendimento personalizado:\n\n${texto}\n\nPode me ajudar a finalizar?`;

    window.open(whatsappUrl(mensagem), "_blank");
  }

  function falarComAtendimento() {
    window.open(
      whatsappUrl(
        "Olá, Geovana Acessórios! Quero atendimento personalizado para escolher uma peça elegante. Pode me ajudar?"
      ),
      "_blank"
    );
  }

  function verColecao() {
    document.getElementById("colecao")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
  "linear-gradient(to bottom,#f8f5f1,#f5efe8)",
      }}
    >
     {/* HEADER */}
<header
  style={{
    position: "relative",
    zIndex: 1,
    background: "#fff",
    borderBottom: "1px solid #eee",
    padding: "8px 16px",
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
      gap: 10,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "center",
flexWrap: "wrap",
textAlign: "center",
        gap: 10,
        minWidth: 0,
      }}
    >
      <img
        src="/logo.jpeg"
        alt="Geovana Acessórios"
        style={{
          width: 44,
          height: 44,
          borderRadius: 16,
          objectFit: "cover",
          flexShrink: 0,
        }}
      />

      <div>
        <div
          style={{
            fontSize: mobile ? 20 : 26,
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
            marginTop: 4,
          }}
        >
          Peças sofisticadas para mulheres elegantes ✨
        </div>
      </div>
    </div>

    <button
  onClick={() => setDrawer(true)}
  style={{
    border: "none",
    background: "#8f735d",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: 30,
    fontWeight: "bold",
    cursor: "pointer",
    whiteSpace: "nowrap",

    width: "fit-content",
    justifySelf: "center",
    marginTop: mobile ? 8 : 0,
  }}
>
  Minha seleção ({selecao.length})
</button>
  </div>
</header>

      {/* HERO PREMIUM */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          textAlign: "center",
          padding: mobile ? "38px 18px 26px" : "56px 28px 34px",
          position: "relative",
         overflow: "hidden",
          borderRadius: 32,
          background:
  "linear-gradient(135deg,#fff,#f7efe7)",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(24px,4vw,34px)",
            margin: 0,
            color: "#503a2f",
            lineHeight: 1.1,
          }}
        >
          Elegância que acompanha seus momentos especiais.
        </h1>

             <p
          style={{
            marginTop: 10,
            fontSize: 15,
            color: "#8b7565",
            maxWidth: 760,
            marginInline: "auto",
            lineHeight: 1.5,
          }}
        >
          Peças delicadas e selecionadas para realçar sua beleza com sutileza,
          confiança e presença. Escolha sua favorita e receba um atendimento
          feito com calma, carinho e olhar de curadoria.
        </p>

        <div
          style={{
            marginTop: 22,
            display: "flex",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={verColecao}
            style={{
              border: "none",
              background: "#8f735d",
              color: "#fff",
              padding: "14px 22px",
              borderRadius: 30,
              fontWeight: "bold",
              cursor: "pointer",
              minWidth: mobile ? "100%" : 150,
              boxShadow: "0 10px 22px rgba(143,115,93,.22)",
            }}
          >
            Ver coleção
          </button>

          <button
            onClick={falarComAtendimento}
            style={{
              border: "1px solid #d8c7b9",
              background: "#fff",
              color: "#6d5848",
              padding: "14px 22px",
              borderRadius: 30,
              fontWeight: "bold",
              cursor: "pointer",
              minWidth: mobile ? "100%" : 220,
            }}
          >
            Atendimento via WhatsApp
          </button>
        </div>
        
        <div
          style={{
            marginTop: 18,
            fontSize: 12,
            color: "#7a8b6f",
            fontWeight: "bold",
          }}
        >
          Mais de 300 clientes satisfeitas
            <div
  style={{
    marginTop: 10,
    fontSize: 13,
    color: "#b66a2c",
    fontWeight: "bold",
  }}
>
  Lançamentos com estoque limitado e 5% de desconto no PIX
</div>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1120,
          margin: "16px auto 0",
          padding: "0 16px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "repeat(2, minmax(0, 1fr))" : "repeat(6, minmax(0, 1fr))",
            gap: 10,
          }}
        >
          {beneficios.map((beneficio) => (
            <div
              key={beneficio}
              style={{
                background: "#fff",
                border: "1px solid #eee4dc",
                borderRadius: 18,
                padding: mobile ? "12px 10px" : "14px 10px",
                textAlign: "center",
                color: "#6d5848",
                fontSize: mobile ? 12 : 13,
                fontWeight: "bold",
                boxShadow: "0 10px 24px rgba(80,58,47,.05)",
              }}
            >
              {beneficio}
            </div>
          ))}
        </div>
      </section>

      {/* BARRA CONFIANÇA */}
      {/* <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 16px 12px",
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: 18,
            padding: "10px 12px",
            display: "flex",
            justifyContent: "center",
            gap: 18,
            flexWrap: "wrap",
            color: "#7b6556",
            fontSize: 12,
            fontWeight: "bold",
          }}
        >
          <span>✨ Garantia nas peças</span>
          <span>🚚 Envio rápido</span>
          <span>💬 Atendimento rápido</span>
          <span>⭐ Clientes satisfeitas</span>
        </div>
      </section>*/}

     {/* BUSCA */}
     <section
        style={{
          maxWidth: 850,
          margin: "0 auto",
          padding: "0 16px 6px",
        }}
      >
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar brincos, anéis, colares..."
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 16,
            border: "1px solid #ddd",
            fontSize: 16,
            background: "#fff",
          }}
        />
      </section> 
<section
  style={{
    maxWidth: 850,
    margin: "0 auto",
    padding: "6px 16px 0",
    display: "flex",
    justifyContent: "center",
    gap: 10,
    flexWrap: "wrap",
  }}
>
  {[
    { label: "Padrão", value: "padrao" },
    { label: "Menor preço", value: "menor" },
    { label: "Maior preço", value: "maior" },
  ].map((item) => (
    <button
      key={item.value}
      onClick={() => setOrdenacao(item.value)}
      style={{
        border: "1px solid #ddd",
        padding: "8px 14px",
        borderRadius: 20,
        cursor: "pointer",
        fontWeight: "bold",
        background:
          ordenacao === item.value ? "#8f735d" : "#fff",
        color:
          ordenacao === item.value ? "#fff" : "#6d5848",
        fontSize: 13,
      }}
    >
      {item.label}
    </button>
  ))}
</section>

      {/* FILTROS */}
<section
  style={{
    display: "flex",
    justifyContent: "center",
    padding: "10px 20px 0",
  }}
>
  <button
    onClick={() =>
      setSomenteNovidades(!somenteNovidades)
    }
    style={{
      border: "1px solid #f0d7b8",
      background: somenteNovidades
        ? "#b66a2c"
        : "#fff7ef",
      color: somenteNovidades
        ? "#fff"
        : "#b66a2c",
      padding: "10px 18px",
      borderRadius: 30,
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: 13,
      boxShadow:
        somenteNovidades
          ? "0 8px 20px rgba(182,106,44,.2)"
          : "none",
    }}
  >
    ✨ Ver novidades
  </button>
</section>      
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
        id="colecao"
        style={{
          maxWidth: 1450,
          margin: "0 auto",
          padding: "0 20px 60px",
        }}
      >
        <div
          style={{
            maxWidth: 980,
            margin: "0 auto 24px",
            textAlign: "center",
            color: "#7b6556",
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          <strong style={{ color: "#503a2f" }}>{filtrados.length}</strong> peças selecionadas para você.
          Escolha suas favoritas e fale com a Geovana para reservar antes que saiam do estoque.
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
  "repeat(auto-fit,minmax(270px,320px))",
justifyContent: lista.length <= 3 ? "center" : "start",
            gap: 28,
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
        "0 24px 48px rgba(0,0,0,.12)";
    }
  }}

  onMouseLeave={(e) => {
    if (!mobile) {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow =
        "0 14px 34px rgba(0,0,0,.06)";
    }
  }}

  style={{
    background: "#fff",
    borderRadius: 24,
    overflow: "hidden",
    boxShadow:
      "0 14px 34px rgba(0,0,0,.06)",
    transition: "all .25s ease",
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
          "linear-gradient(135deg,#ffcc80,#ff9800)",
        color: "#fff",
        padding: "6px 12px",
        borderRadius: 30,
        fontSize: 11,
        fontWeight: "bold",
        boxShadow:
          "0 6px 16px rgba(255,152,0,.25)",
      }}
    >
      ✨ NOVIDADE
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
    fontSize: 18,
    fontWeight: 600,
      lineHeight: 1.35,
      color: "#4e3d31",
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
      }}
    >
      Edição selecionada · 5% OFF no PIX
    </div>

    <div
      style={{
        marginTop: 8,
        margin: "0 auto 12px",
        display: "block",
        width: "fit-content",
        background: ehPrata(p) ? "#e8f5e9" : "#fff8e1",
        color: ehPrata(p) ? "#2e7d32" : "#b28704",
        padding: "5px 12px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: "bold",
  }}
>
        {ehPrata(p)
          ? "✨GARANTIA VITALÍCIA"
          : ehSemijoia(p)
          ? "✨1 ANO DE GARANTIA"
          : ""}
</div>
  </div> 

  {/* BOTÃO PRINCIPAL */}
<button
  onClick={() => adicionar(p)}

  onMouseEnter={(e)=>{
    if(!mobile){
      e.currentTarget.style.transform="scale(1.02)"
    }
  }}

  onMouseLeave={(e)=>{
    if(!mobile){
      e.currentTarget.style.transform="scale(1)"
    }
  }}
  style={{
    width: "100%",
    padding: 14,
    border: "none",
    borderRadius: 16,
    cursor: "pointer",
    background:
      "linear-gradient(135deg,#8f735d,#6f5745)",
    boxShadow:
      "0 8px 20px rgba(143,115,93,.25)",
    transition: "all .2s ease",
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
    const texto = `Olá, Geovana Acessórios! Quero garantir essa peça: ${nomeBonito(p.nome)}. Pode me atender pelo WhatsApp?`;
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
    border: "1px solid #ddd",
    background: "#fff",
    color: "#6d5848",
    fontWeight: "bold",
    fontSize: 13,
    cursor: "pointer",
  }}
>
  Falar com atendimento
</button>
</div>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 20px 54px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: 22,
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#503a2f",
              fontSize: mobile ? 24 : 30,
              lineHeight: 1.2,
            }}
          >
            Quem compra sente a diferença no atendimento.
          </h2>
          <p
            style={{
              margin: "8px auto 0",
              maxWidth: 640,
              color: "#8b7565",
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            A Geovana acompanha sua escolha pelo WhatsApp, tira dúvidas e ajuda você a encontrar a peça certa para o momento.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          {depoimentos.map((depoimento) => (
            <article
              key={depoimento.nome}
              style={{
                background: "#fff",
                border: "1px solid #eee4dc",
                borderRadius: 22,
                padding: 20,
                color: "#6d5848",
                boxShadow: "0 12px 28px rgba(80,58,47,.06)",
              }}
            >
              <div style={{ color: "#b28704", fontSize: 15, marginBottom: 10 }}>★★★★★</div>
              <p style={{ margin: 0, lineHeight: 1.5, fontSize: 14 }}>{depoimento.texto}</p>
              <strong style={{ display: "block", marginTop: 14, color: "#503a2f", fontSize: 13 }}>
                {depoimento.nome}
              </strong>
            </article>
          ))}
        </div>
      </section>

      <section
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "0 20px 64px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "1.1fr .9fr",
            gap: 18,
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              background: "#fffaf6",
              border: "1px solid #eadfd5",
              borderRadius: 24,
              padding: mobile ? 22 : 28,
            }}
          >
            <h2 style={{ margin: 0, color: "#503a2f", fontSize: mobile ? 24 : 30 }}>
              Vida real, brilho real.
            </h2>
            <p style={{ color: "#7b6556", lineHeight: 1.6, fontSize: 14 }}>
              Acompanhe combinações, novidades e bastidores no Instagram para ver como as peças ficam em momentos reais.
            </p>
            <button
              onClick={falarComAtendimento}
              style={{
                border: "none",
                background: "#8f735d",
                color: "#fff",
                padding: "13px 18px",
                borderRadius: 18,
                fontWeight: "bold",
                cursor: "pointer",
                width: mobile ? "100%" : "auto",
              }}
            >
              Receber sugestões pelo WhatsApp
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            {momentosInstagram.map((momento) => (
              <div
                key={momento}
                style={{
                  minHeight: mobile ? 120 : 170,
                  borderRadius: 22,
                  background: "linear-gradient(135deg,#f2e7dd,#fff,#e8d9cc)",
                  border: "1px solid #eadfd5",
                  display: "flex",
                  alignItems: "end",
                  padding: 12,
                  color: "#5a4333",
                  fontSize: 12,
                  fontWeight: "bold",
                  lineHeight: 1.35,
                }}
              >
                {momento}
              </div>
            ))}
          </div>
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
  © {new Date().getFullYear()} Geovana Acessórios • Versão {SITE_VERSION}
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
              Minha seleção
            </h2>
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
    transition: "all 0.2s ease",
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
    padding: "12px 16px",
    borderRadius: 14,
    border: "1px solid #e6d8cb",
    background: "#fff",
    maxWidth: 240,
  }}
>
  <div
    style={{
      fontSize: 13,
      color: "#a38a77",
      textDecoration: "line-through",
      marginBottom: 4,
    }}
  >
    De: {moeda(total)}
  </div>

  <div
    style={{
      fontSize: 22,
      fontWeight: "bold",
      color: "#8f735d",
    }}
  >
    {moeda(totalPix)}
  </div>

  <div
    style={{
      fontSize: 12,
      color: "#9a7e69",
      marginTop: 2,
    }}
  >
    no PIX
  </div>
      <div
  style={{
    fontSize: 11,
    color: "#9a7e69",
    marginTop: 4,
    opacity: 0.8,
  }}
>
  💰 5% de desconto
</div>
</div>

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
                  Garantir minhas peças pelo WhatsApp
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
          background: "#6f7f64",
          color: "#fff",
          padding: mobile ? "13px 16px" : "14px 18px",
          fontWeight: "bold",
          fontSize: mobile ? 14 : 15,
          cursor: "pointer",
          boxShadow: "0 12px 26px rgba(0,0,0,.2)",
          maxWidth: mobile ? "calc(100% - 40px)" : 280,
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
      alt="Peça Geovana Acessórios em detalhe"
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
