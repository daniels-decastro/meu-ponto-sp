// Página do ponto: painel com os próximos ônibus, atualizado sozinho

const titulo = document.querySelector("#nome-ponto");
const botaoFavorito = document.querySelector("#botao-favorito");
const atualizacao = document.querySelector(".atualizacao");
const listaLinhas = document.querySelector(".linhas");

// le o código do ponto da URL: ponto.html?codigo=340015329
const parametros = new URLSearchParams(window.location.search);
const codigo = parametros.get("codigo");

// Se o ponto já é favorito, o nome salvo aparece enquanto a API responde
const favoritoSalvo = favoritos.find((favorito) => favorito.codigo === codigo);
let nomePonto = "Ponto " + codigo;
if (favoritoSalvo) {
  nomePonto = favoritoSalvo.nome;
}

function mostrarNomePonto() {
  titulo.textContent = nomePonto;
  document.title = nomePonto + " — Meu Ponto SP";
}

// Converte 
function paraMinutos(horario) {
  const partes = horario.split(":");
  return Number(partes[0]) * 60 + Number(partes[1]);
}

// Quantos minutos faltam entre a hora da consulta e a hora prevista 
function minutosAte(horarioPrevisto, horarioConsulta) {
  let diferenca = paraMinutos(horarioPrevisto) - paraMinutos(horarioConsulta);

  // Virada da meia-noite - de 23:58 para 00:05 a conta dá -1433, ou 7 minutos 
  if (diferenca < -720) {
    diferenca = diferenca + 1440;
  }

  // Ônibus atrasado em relação à previsão
  if (diferenca < 0) {
    diferenca = 0;
  }

  return diferenca;
}

function textoMinutos(minutos) {
  if (minutos === 0) {
    return "chegando";
  }
  return minutos + " min";
}

// A API manda os dois terminais da linha (lt0 e lt1) e o sentido (sl)
// sl = 1 - vai do terminal principal (lt0) para o secundário (lt1) - sl = 2: o contrário.
function destinoDaLinha(linha) {
  if (linha.sl === 1) {
    return linha.lt1;
  }
  return linha.lt0;
}

// Monta um card para cada linha, com até 3 ônibus a caminho
function renderizarLinhas(linhas, horarioConsulta) {
  // Ordena os ônibus de cada linha e guarda os minutos do primeiro
  linhas.forEach((linha) => {
    linha.vs.sort((a, b) => minutosAte(a.t, horarioConsulta) - minutosAte(b.t, horarioConsulta));
    linha.minutos = minutosAte(linha.vs[0].t, horarioConsulta);
  });

  // A linha com o ônibus mais próximo aparece primeiro
  linhas.sort((a, b) => a.minutos - b.minutos);

  listaLinhas.innerHTML = "";

  linhas.forEach((linha) => {
    let chegadas = "";

    linha.vs.slice(0, 3).forEach((onibus) => {
      const minutos = minutosAte(onibus.t, horarioConsulta);

      let classe = "chegada";
      if (minutos <= 2) {
        classe = "chegada chegando";
      }

      let acessivel = "";
      if (onibus.a) {
        acessivel = " ♿";
      }

      chegadas += `<span class="${classe}">${textoMinutos(minutos)}${acessivel} <small>${onibus.t}</small></span>`;
    });

    listaLinhas.innerHTML += `
      <div class="linha">
        <div class="linha-topo">
          <span class="letreiro">${linha.c}</span>
          <span class="destino">Para ${destinoDaLinha(linha)}</span>
        </div>
        <div class="chegadas">${chegadas}</div>
      </div>
    `;
  });
}

// Busca a previsão de chegada e atualiza o painel
async function carregarPrevisao() {
  // Endpoint usado no servidor GET /Previsao/Parada?codigoParada=...
  const dados = await consultarApi(API_URL + "?parada=" + codigo);
  if (dados === null) {
    return;
  }

  mostrarMensagem("", "");
  atualizacao.textContent = `Previsão das ${dados.hr} · atualiza sozinho a cada ${INTERVALO_ATUALIZACAO / 1000} segundos`;

  // p vem null quando a API não tem prevsão para o ponto
  if (dados.p === null) {
    mostrarNomePonto();
    listaLinhas.innerHTML = `<p class="vazio">Nenhum ônibus previsto para este ponto agora.</p>`;
    return;
  }

  nomePonto = dados.p.np;
  mostrarNomePonto();

  // Só as linhas que temalgum ônibus a caminho
  const linhas = dados.p.l.filter((linha) => linha.vs.length > 0);

  if (linhas.length === 0) {
    listaLinhas.innerHTML = `<p class="vazio">Nenhum ônibus previsto para este ponto agora.</p>`;
    return;
  }

  renderizarLinhas(linhas, dados.hr);
}

//  Favorito 

function alternarFavorito() {
  const posicao = favoritos.findIndex((favorito) => favorito.codigo === codigo);

  if (posicao === -1) {
    favoritos.push({ codigo: codigo, nome: nomePonto }); // ainda não era favorito -adiciona
  } else {
    favoritos.splice(posicao, 1); // já era favorito - remove
  }

  salvarFavoritos();
  atualizarBotaoFavorito();
}

function atualizarBotaoFavorito() {
  const posicao = favoritos.findIndex((favorito) => favorito.codigo === codigo);

  if (posicao === -1) {
    botaoFavorito.textContent = "☆ Salvar nos favoritos";
    botaoFavorito.className = "";
  } else {
    botaoFavorito.textContent = "★ Salvo nos favoritos";
    botaoFavorito.className = "salvo";
  }
}

// Início

if (codigo) {
  if (favoritoSalvo) {
    mostrarNomePonto();
  }
  atualizarBotaoFavorito();
  atualizacao.textContent = "Carregando a previsão...";
  carregarPrevisao();

  // Consulta a API de novo a cada 30 segundos, sem precisar recarregar a página
  setInterval(carregarPrevisao, INTERVALO_ATUALIZACAO);
} else {
  titulo.textContent = "Nenhum ponto escolhido";
  botaoFavorito.style.display = "none";
  mostrarMensagem("Volte para a busca e escolha um ponto.", "erro");
}
