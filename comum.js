// Código usado pelas duas páginas (index.html e ponto.html)

// O app não chama a SPTrans direto, chama a nossa função no Vercel
// pasta api, que guarda o token e conversa com a API Olho Vivo
const API_URL = "/api/olhovivo";

// O painel do ponto se atualiza em 30 segundos
const INTERVALO_ATUALIZACAO = 30000;

const mensagem = document.querySelector(".mensagem");

// Mostra um aviso na página e o tipo define a cor no CSS
function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
}

// Faz a requisição e confere o status antes de usar os dados
// Devolve os dados, ou null se algo deu errado
async function consultarApi(url) {
  try {
    const resposta = await fetch(url);

    if (resposta.status === 401) {
      mostrarMensagem("Token da SPTrans inválido. Confira a configuração no Vercel.", "erro");
      return null;
    }

    if (resposta.status !== 200) {
      mostrarMensagem("A SPTrans não respondeu. Tente de novo em instantes.", "erro");
      return null;
    }

    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    mostrarMensagem("Não foi possível conectar. Verifique a sua internet.", "erro");
    return null;
  }
}

// Favoritos salvos no localStorage

let favoritos = [];

function carregarFavoritos() {
  const salvos = localStorage.getItem("favoritos");
  if (salvos) {
    favoritos = JSON.parse(salvos);
  }
}

function salvarFavoritos() {
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

carregarFavoritos();
