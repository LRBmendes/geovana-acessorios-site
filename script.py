import requests
import re
import json
import time
import os
from bs4 import BeautifulSoup

# =====================================================
# GEOVANA ACESSÓRIOS - ROBÔ V5 FINAL
# PAGINAÇÃO REAL ASP.NET WEBFORMS
# =====================================================

SUPABASE_URL = "https://kcydlzerrhezpcxkqonx.supabase.co"
SUPABASE_KEY = os.environ["SUPABASE_KEY"]

BASE_URL = "https://catalogo.innosystem.com.br/atacadoaj_g2/"

TOTAL_PAGINAS = 18

HEADERS_SUPABASE = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

HEADERS_SITE = {
    "User-Agent": "Mozilla/5.0"
}

TOTAL_OK = 0
TOTAL_ERRO = 0


# =====================================================
# FUNÇÕES
# =====================================================

def limpar_preco(txt):
    txt = re.sub(r"[^0-9,\.]", "", txt)
    txt = txt.replace(".", "").replace(",", ".")
    try:
        return float(txt)
    except:
        return 0


def preco_psicologico(valor):
    inteiro = int(valor)
    return float(f"{inteiro}.90")


def calcular_venda(custo):
    return preco_psicologico(custo * 2.33)


def pegar_hidden(soup, nome):
    campo = soup.find("input", {"name": nome})
    if campo:
        return campo.get("value", "")
    return ""


def salvar_produto(payload):
    global TOTAL_OK, TOTAL_ERRO

    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/produtos?on_conflict=codigo",
        headers=HEADERS_SUPABASE,
        data=json.dumps(payload),
        timeout=30
    )

    if r.status_code in [200, 201]:
        TOTAL_OK += 1
        return True
    else:
        TOTAL_ERRO += 1
        print("ERRO:", r.status_code, r.text[:300])
        return False


def extrair_produtos(html, pagina):
    soup = BeautifulSoup(html, "html.parser")
    cards = soup.select("div.margem")

    print(f"Produtos encontrados página {pagina}: {len(cards)}")

    for card in cards:
        try:
            nome = ""
            preco = 0
            categoria = ""
            codigo = ""
            imagem = ""

            n = card.select_one(".tnom")
            if n:
                nome = n.get_text(" ", strip=True)

            if not nome:
                continue

            p = card.select_one(".tprc")
            if p:
                preco = limpar_preco(p.get_text(" ", strip=True))

            c = card.select_one(".tcat")
            if c:
                categoria = c.get_text(" ", strip=True)

            texto_total = card.get_text(" ", strip=True).lower()

            m = re.search(r'c[oó]d\.?\s*(\d+)', texto_total)
            if m:
                codigo = m.group(1)

            if not codigo:
                continue

            img = card.select_one("img")
            if img:
                imagem = img.get("src", "")
                if imagem.startswith("/"):
                    imagem = "https://catalogo.innosystem.com.br" + imagem

            payload = {
                "nome": nome,
                "codigo": codigo,
                "categoria": categoria,
                "preco_custo": preco,
                "preco_venda": calcular_venda(preco),
                "imagem_url": imagem,
                "produto_url": BASE_URL,
                "ativo": True
            }

            salvar_produto(payload)
            print("OK:", codigo, "-", nome[:50])

        except Exception as e:
            print("FALHA:", e)


# =====================================================
# PÁGINA 1
# =====================================================

print("===================================")
print("ROBÔ V5 INICIADO")
print("===================================")

sessao = requests.Session()

r = sessao.get(BASE_URL, headers=HEADERS_SITE, timeout=30)
html = r.text

extrair_produtos(html, 1)

# =====================================================
# PÁGINAS 2 até 18
# =====================================================

for pagina in range(2, TOTAL_PAGINAS + 1):

    print("\n----------------------------")
    print("LENDO PÁGINA", pagina)
    print("----------------------------")

    soup = BeautifulSoup(html, "html.parser")

    viewstate = pegar_hidden(soup, "__VIEWSTATE")
    generator = pegar_hidden(soup, "__VIEWSTATEGENERATOR")
    validation = pegar_hidden(soup, "__EVENTVALIDATION")

    indice = pagina - 1
    ctl = f"ctl{str(indice).zfill(2)}"

    payload = {
        "__EVENTTARGET": f"ctl00$conteudo$DataPager1$ctl00${ctl}",
        "__EVENTARGUMENT": "",
        "__LASTFOCUS": "",
        "__VIEWSTATE": viewstate,
        "__VIEWSTATEGENERATOR": generator,
        "__EVENTVALIDATION": validation
    }

    r = sessao.post(
        BASE_URL,
        headers=HEADERS_SITE,
        data=payload,
        timeout=30
    )

    html = r.text

    extrair_produtos(html, pagina)

    time.sleep(1)

# =====================================================
# FINAL
# =====================================================

print("\n===================================")
print("ROBÔ FINALIZADO")
print("Sucesso:", TOTAL_OK)
print("Erros:", TOTAL_ERRO)
print("===================================")
