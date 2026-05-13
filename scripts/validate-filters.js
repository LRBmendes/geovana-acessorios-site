const normalizar = (txt = "") =>
  String(txt)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const textoCompleto = (produto) => normalizar(`${produto.nome || ""} ${produto.categoria || ""}`);
const textoCategoria = (produto) => normalizar(produto.categoria || "");

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

function ehItemTecnico(produto) {
  const txt = textoCompleto(produto);
  return termosTecnicosBloqueados.some((termo) => txt.includes(normalizar(termo)));
}

function ehPrata(produto) {
  const txt = textoCompleto(produto);
  return txt.includes("prata") || txt.includes("925") || txt.includes("rodio branco");
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

const ehBrinco = (produto) => ["brinco", "argola", "ear cuff", "piercing"].some((termo) => textoCompleto(produto).includes(termo));
const ehColar = (produto) => ["colar", "corrente", "choker", "gargantilha", "pingente"].some((termo) => textoCompleto(produto).includes(termo));
const ehPulseira = (produto) => textoCompleto(produto).includes("pulseira") || textoCompleto(produto).includes("bracelete");
const ehAnel = (produto) => ["anel", "alianca", "alianca", "solitario"].some((termo) => textoCompleto(produto).includes(termo));

function ehNovidade(produto) {
  if (!produto.imported_at) return false;
  const dias = (Date.now() - new Date(produto.imported_at).getTime()) / (1000 * 60 * 60 * 24);
  return dias <= 30;
}

function produtoCombinaComColecao(produto, colecaoAtual) {
  if (colecaoAtual === "Todos") return true;
  if (colecaoAtual === "Prata") return ehPrata(produto);
  if (colecaoAtual === "Semijoias") return ehSemijoia(produto);
  return true;
}

function produtoCombinaComTipo(produto, tipoAtual) {
  if (tipoAtual === "Todos") return true;
  if (tipoAtual === "Brincos") return ehBrinco(produto);
  if (tipoAtual === "Colares") return ehColar(produto);
  if (tipoAtual === "Pulseiras") return ehPulseira(produto);
  if (tipoAtual === "Anéis") return ehAnel(produto);
  return true;
}

function produtoCombinaComBusca(produto, buscaAtual) {
  const termoBusca = normalizar(buscaAtual.trim());
  return !termoBusca || textoCompleto(produto).includes(termoBusca);
}

function filtrarProdutos(produtosBase, filtros) {
  return produtosBase
    .filter((produto) => !ehItemTecnico(produto))
    .filter((produto) => produtoCombinaComColecao(produto, filtros.colecao))
    .filter((produto) => produtoCombinaComTipo(produto, filtros.tipo))
    .filter((produto) => produtoCombinaComBusca(produto, filtros.busca))
    .filter((produto) => (filtros.somenteNovidades ? ehNovidade(produto) : true));
}

const hoje = new Date().toISOString();
const antigo = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString();

const produtos = [
  { nome: "Brinco cristal dourado", categoria: "Semijoias", preco_venda: 89, imported_at: hoje },
  { nome: "Brinco cristal prata 925", categoria: "Prata", preco_venda: 119, imported_at: hoje },
  { nome: "Anel solitario prata 925", categoria: "Prata", preco_venda: 129, imported_at: hoje },
  { nome: "Anel dourado zirconia", categoria: "Semijoias", preco_venda: 99, imported_at: antigo },
  { nome: "Colar cristal dourado", categoria: "Semijoias", preco_venda: 109, imported_at: hoje },
  { nome: "Pulseira prata 925 delicada", categoria: "Prata", preco_venda: 139, imported_at: hoje },
  { nome: "Saquinho zip transparente", categoria: "Embalagem", preco_venda: 1, imported_at: hoje },
];

const cenarios = [
  {
    nome: "Semijoias + Brincos",
    filtros: { colecao: "Semijoias", tipo: "Brincos", busca: "", somenteNovidades: false },
    esperado: ["Brinco cristal dourado"],
  },
  {
    nome: "Prata + Anéis",
    filtros: { colecao: "Prata", tipo: "Anéis", busca: "", somenteNovidades: false },
    esperado: ["Anel solitario prata 925"],
  },
  {
    nome: "Colares + busca textual",
    filtros: { colecao: "Todos", tipo: "Colares", busca: "cristal", somenteNovidades: false },
    esperado: ["Colar cristal dourado"],
  },
  {
    nome: "Novidades + Semijoias",
    filtros: { colecao: "Semijoias", tipo: "Todos", busca: "", somenteNovidades: true },
    esperado: ["Brinco cristal dourado", "Colar cristal dourado"],
  },
  {
    nome: "Brincos + cristal",
    filtros: { colecao: "Todos", tipo: "Brincos", busca: "cristal", somenteNovidades: false },
    esperado: ["Brinco cristal dourado", "Brinco cristal prata 925"],
  },
  {
    nome: "Pulseiras + prata + novidades",
    filtros: { colecao: "Prata", tipo: "Pulseiras", busca: "", somenteNovidades: true },
    esperado: ["Pulseira prata 925 delicada"],
  },
];

for (const cenario of cenarios) {
  const resultado = filtrarProdutos(produtos, cenario.filtros).map((produto) => produto.nome).sort();
  const esperado = [...cenario.esperado].sort();

  if (JSON.stringify(resultado) !== JSON.stringify(esperado)) {
    console.error(`Falhou: ${cenario.nome}`);
    console.error("Esperado:", esperado);
    console.error("Resultado:", resultado);
    process.exit(1);
  }
}

console.log("Filtros combinados validados:", cenarios.length);
