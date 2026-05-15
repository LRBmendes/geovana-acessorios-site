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
  return txt.includes("prata") || txt.includes("925");
}

function ehRodio(produto) {
  const txt = textoCompleto(produto);
  return (
    txt.includes("rodio branco") ||
    txt.includes("rodio bra") ||
    txt.includes("rodio br") ||
    txt.includes("rodio") ||
    txt.includes("ródio") ||
    /(^|[\s/.,>-])rb($|[\s/.,<-])/.test(txt)
  );
}

function ehSemijoia(produto) {
  const txt = textoCompleto(produto);
  const categoria = textoCategoria(produto);

  if (ehPrata(produto) || ehRodio(produto)) {
    return false;
  }

  if (categoria.includes("semijoia") || categoria.includes("semi joia") || categoria.includes("semi-joia")) {
    return true;
  }

  return (
    txt.includes("semijoia") ||
      txt.includes("semi joia") ||
      txt.includes("semi-joia") ||
      txt.includes("dourado") ||
      txt.includes("banho") ||
      txt.includes("ouro")
  );
}

function ehBrinco(produto) {
  const categoria = textoCategoria(produto);
  if (categoria) {
    return categoria.includes("brinco") || categoria.includes("piercing") || categoria.includes("ear cuff");
  }
  return ["brinco", "argola", "ear cuff", "piercing"].some((termo) => textoCompleto(produto).includes(termo));
}

function ehColar(produto) {
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
  return ["colar", "corrente", "choker", "gargantilha", "pingente"].some((termo) => textoCompleto(produto).includes(termo));
}

function ehPulseira(produto) {
  const categoria = textoCategoria(produto);
  if (categoria) {
    return categoria.includes("pulseira") || categoria.includes("bracelete");
  }
  return textoCompleto(produto).includes("pulseira") || textoCompleto(produto).includes("bracelete");
}

function ehAnel(produto) {
  const categoria = textoCategoria(produto);
  if (categoria) {
    return categoria.includes("anel") || categoria.includes("alianca") || categoria.includes("alianca");
  }
  return ["anel", "alianca", "alianca", "solitario"].some((termo) => textoCompleto(produto).includes(termo));
}

function ehNovidade(produto) {
  return produto?.is_novidade === true;
}

function produtoCombinaComColecao(produto, colecaoAtual) {
  if (colecaoAtual === "Todos") return true;
  if (colecaoAtual === "Prata") return ehPrata(produto);
  if (colecaoAtual === "Semijoias") return ehSemijoia(produto);
  if (colecaoAtual === "Ródio") return ehRodio(produto);
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

function produtoCombinaComDestaque(produto, destaqueAtual) {
  if (destaqueAtual === "Novidades") return produto?.is_novidade === true;
  if (destaqueAtual === "Mais vendidos") return produto?.is_mais_vendido === true;
  if (destaqueAtual === "Em alta") return produto?.is_em_alta === true;
  return true;
}

function filtrarProdutos(produtosBase, filtros) {
  return produtosBase
    .filter((produto) => !ehItemTecnico(produto))
    .filter((produto) => produtoCombinaComColecao(produto, filtros.colecao))
    .filter((produto) => produtoCombinaComTipo(produto, filtros.tipo))
    .filter((produto) => produtoCombinaComBusca(produto, filtros.busca))
    .filter((produto) => produtoCombinaComDestaque(produto, filtros.destaqueComercial))
    .filter((produto) => (filtros.somenteNovidades ? ehNovidade(produto) : true));
}

const hoje = new Date().toISOString();
const antigo = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString();

const produtos = [
  { nome: "Brinco cristal dourado", categoria: "Brincos > Semijoia - Cód. 1001", preco_venda: 89, imported_at: hoje, is_novidade: true, is_mais_vendido: true },
  { nome: "Brinco ródio branco", categoria: "Brincos > Semijoia Ródio Branco - Cód. 7265", preco_venda: 89, imported_at: hoje, is_em_alta: true },
  { nome: "Brinco cravejado perola glamour rb", categoria: "Brincos > Semijoia - Cód. 7266", preco_venda: 89, imported_at: hoje, is_ultimas_unidades: true },
  { nome: "Brinco cristal prata 925", categoria: "Brincos > Prata 925 - Cód. 1004", preco_venda: 119, imported_at: hoje, is_novidade: true },
  { nome: "Anel solitario prata 925", categoria: "Anel > Prata 925 - Cód. 1005", preco_venda: 129, imported_at: hoje, is_novidade: true },
  { nome: "Anel dourado zirconia", categoria: "Anel > Semijoia - Cód. 1002", preco_venda: 99, imported_at: antigo },
  { nome: "Colar cristal dourado", categoria: "Correntes > Feminina Semijoia - Cód. 1003", preco_venda: 109, imported_at: hoje, is_novidade: true },
  { nome: "Colar coração liso zirconia na contra argola", categoria: "Correntes > Feminina Semijoia - Cód. 4092", preco_venda: 109, imported_at: hoje, is_novidade: true },
  { nome: "Pulseira prata 925 delicada", categoria: "Pulseira > Feminina Prata 925 - Cód. 1006", preco_venda: 139, imported_at: hoje, is_novidade: true },
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
    esperado: ["Brinco cristal dourado", "Colar coração liso zirconia na contra argola", "Colar cristal dourado"],
  },
  {
    nome: "Brincos + cristal",
    filtros: { colecao: "Todos", tipo: "Brincos", busca: "cristal", somenteNovidades: false },
    esperado: ["Brinco cristal dourado", "Brinco cristal prata 925"],
  },
  {
    nome: "Semijoias + Brincos + cristal nao inclui colar contra argola",
    filtros: { colecao: "Semijoias", tipo: "Brincos", busca: "cristal", somenteNovidades: false },
    esperado: ["Brinco cristal dourado"],
  },
  {
    nome: "Pulseiras + prata + novidades",
    filtros: { colecao: "Prata", tipo: "Pulseiras", busca: "", somenteNovidades: true },
    esperado: ["Pulseira prata 925 delicada"],
  },
  {
    nome: "Ródio + Brincos",
    filtros: { colecao: "Ródio", tipo: "Brincos", busca: "", somenteNovidades: false },
    esperado: ["Brinco cravejado perola glamour rb", "Brinco ródio branco"],
  },
  {
    nome: "Mais vendidos + Brincos",
    filtros: { colecao: "Todos", tipo: "Brincos", busca: "", destaqueComercial: "Mais vendidos", somenteNovidades: false },
    esperado: ["Brinco cristal dourado"],
  },
  {
    nome: "Em alta + Ródio",
    filtros: { colecao: "Ródio", tipo: "Todos", busca: "", destaqueComercial: "Em alta", somenteNovidades: false },
    esperado: ["Brinco ródio branco"],
  },
  {
    nome: "Novidades + busca cristal",
    filtros: { colecao: "Todos", tipo: "Todos", busca: "cristal", destaqueComercial: "Novidades", somenteNovidades: false },
    esperado: ["Brinco cristal dourado", "Brinco cristal prata 925", "Colar cristal dourado"],
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
