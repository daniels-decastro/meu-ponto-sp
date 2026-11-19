// Função que roda no servidor do Vercel, e não no navegador.
//
// Como visto na Aula 11, em sistemas reais a chave fica no servidor: o app
// chama esta função e só ela chama a API Olho Vivo. Aqui isso é obrigatório,
// porque a SPTrans não aceita chamadas feitas direto do navegador e porque o
// token não pode aparecer no código do site. O token fica guardado na
// variável de ambiente SPTRANS_TOKEN, configurada no painel do Vercel.
//
// O app usa dois endereços:
//   /api/olhovivo?busca=Paulista     → GET /Parada/Buscar?termosBusca=Paulista
//   /api/olhovivo?parada=340015329   → GET /Previsao/Parada?codigoParada=340015329

const SPTRANS_URL = "https://api.olhovivo.sptrans.com.br/v2.1";

export default async function handler(req, res) {
  // 1. Descobre qual consulta o app pediu
  let endpoint = "";

  if (req.query.busca) {
    endpoint = "/Parada/Buscar?termosBusca=" + encodeURIComponent(req.query.busca);
  } else if (req.query.parada) {
    endpoint = "/Previsao/Parada?codigoParada=" + encodeURIComponent(req.query.parada);
  } else {
    res.status(400).json({ erro: "Consulta inválida." });
    return;
  }

  try {
    // 2. Faz o login na SPTrans com o token (POST /Login/Autenticar)
    const login = await fetch(SPTRANS_URL + "/Login/Autenticar?token=" + process.env.SPTRANS_TOKEN, {
      method: "POST",
    });
    const autenticado = await login.json();

    if (autenticado !== true) {
      res.status(401).json({ erro: "Token da SPTrans inválido." });
      return;
    }

    // 3. O login devolve um cookie de sessão, que precisa ir junto na consulta.
    //    Guardamos só a parte "apiCredentials=..." do cookie.
    const cookie = login.headers.get("set-cookie").split(";")[0];

    // 4. Faz a consulta pedida e devolve o JSON para o app
    const resposta = await fetch(SPTRANS_URL + endpoint, {
      headers: { Cookie: cookie },
    });

    if (resposta.status !== 200) {
      res.status(502).json({ erro: "A SPTrans respondeu com erro " + resposta.status + "." });
      return;
    }

    const dados = await resposta.json();
    res.status(200).json(dados);
  } catch (erro) {
    res.status(500).json({ erro: "Não foi possível conectar à SPTrans." });
  }
}
