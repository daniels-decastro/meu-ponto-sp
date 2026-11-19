// Página inicial: busca de pontos e lista de favoritos

const campoBusca = document.querySelector("#busca");
const resultados = document.querySelector(".resultados");
const listaFavoritos = document.querySelector(".favoritos");

// Quantos pontos mostrar no máximo depois de uma busca
const LIMITE_RESULTADOS = 30;

// Monta os cards dos pontos favoritos salvos no localStorage
function renderizarFavoritos() {
  listaFavoritos.innerHTML = "";

  if (favoritos.length === 0) {
    listaFavoritos.innerHTML = `<p class="vazio">Abra um ponto e toque em "Salvar nos favoritos" para ele aparecer aqui.</p>`;
    return;
  }

  favoritos.forEach((favorito) => {
    listaFavoritos.innerHTML += `
      <a class="card" href="ponto.html?codigo=${favorito.codigo}">
        <h3>★ ${favorito.nome}</h3>
        <p>Ver próximos ônibus</p>
      </a>
    `;
  });
}

// Chamada pelo onsubmit do formulário de busca
async function buscarParadas(event) {
  event.preventDefault();
  const termo = campoBusca.value.trim();

  if (termo === "") {
    mostrarMensagem("Digite o nome do ponto ou da rua.", "erro");
    return;
  }

  if (termo.length < 3) {
    mostrarMensagem("Digite pelo menos 3 letras.", "erro");
    return;
  }

  mostrarMensagem("Buscando pontos...", "");
  resultados.innerHTML = "";

  // Endpoint usado no servidor: GET /Parada/Buscar?termosBusca=...
  const paradas = await consultarApi(API_URL + "?busca=" + termo);
  if (paradas === null) {
    return;
  }

  if (paradas.length === 0) {
    mostrarMensagem(`Nenhum ponto encontrado para "${termo}". Tente só o nome da rua, sem número.`, "erro");
    return;
  }

  const primeiras = paradas.slice(0, LIMITE_RESULTADOS);

  primeiras.forEach((parada) => {
    resultados.innerHTML += `
      <a class="card" href="ponto.html?codigo=${parada.cp}">
        <h3>${parada.np || "Ponto sem nome"}</h3>
        <p>${parada.ed || ""}</p>
      </a>
    `;
  });

  if (paradas.length > LIMITE_RESULTADOS) {
    mostrarMensagem(`Mostrando ${LIMITE_RESULTADOS} de ${paradas.length} pontos. Detalhe mais a busca para achar o seu.`, "sucesso");
  } else {
    mostrarMensagem(`${paradas.length} ponto(s) encontrado(s). Toque em um ponto para ver os próximos ônibus.`, "sucesso");
  }
}

renderizarFavoritos();
