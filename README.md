# Meu Ponto SP

Aplicativo web em HTML, CSS e JavaScript que mostra quanto tempo falta para cada ônibus chegar ao seu ponto, com dados em tempo real da API Olho Vivo da SPTrans.

- **App no Vercel:** https://SEU-PROJETO.vercel.app
- **Global Solution 2026.2** · Application Development · Prof. Rodrigo Moraes
- **Integrantes:** veja o arquivo [INTEGRANTES.txt](INTEGRANTES.txt)

## Problema que o app resolve

Quem anda de ônibus em São Paulo muitas vezes sai de casa sem saber se o ônibus acabou de passar ou se ainda vai demorar, e espera no ponto sem informação. O Meu Ponto SP mostra a previsão de chegada de todas as linhas de um ponto, atualizada sozinha, para a pessoa decidir a hora certa de sair. Os ônibus acessíveis aparecem com ♿.

## O que o app faz

- **Busca de pontos** pelo nome ou pela rua, com validação do campo de busca.
- **Painel do ponto** com os próximos ônibus de cada linha, mostrando quantos minutos faltam e o horário previsto. A linha com o ônibus mais próximo aparece primeiro, os ônibus que chegam em até 2 minutos ficam em amarelo e o painel se atualiza sozinho a cada 30 segundos.
- **Pontos favoritos** salvos no `localStorage`, que aparecem na página inicial para abrir o painel com um toque.
- **Mensagens de erro** para busca vazia, ponto não encontrado, falha de conexão e token inválido.
- Layout responsivo, que funciona no celular e no computador.

## Endpoints da API Olho Vivo usados

| Endpoint | Para que serve no app |
| --- | --- |
| `POST /Login/Autenticar?token=` | Login com o token da SPTrans |
| `GET /Parada/Buscar?termosBusca=` | Buscar pontos pelo nome ou endereço |
| `GET /Previsao/Parada?codigoParada=` | Previsão de chegada de todas as linhas em um ponto |

## Como o app acessa a API

```
Navegador (index.html / ponto.html)  →  /api/olhovivo (função no Vercel)  →  API Olho Vivo
```

A API Olho Vivo não aceita chamadas feitas direto do navegador e o token da SPTrans não pode ficar visível no código do site. Por isso o app chama a função `api/olhovivo.js`, que roda no servidor do Vercel. Ela lê o token da variável de ambiente `SPTRANS_TOKEN`, faz o login, faz a consulta pedida e devolve o JSON para o app.

## Como publicar no Vercel

1. Crie o token na [área de desenvolvedores da SPTrans](https://www.sptrans.com.br/desenvolvedores/), em "Meus Aplicativos".
2. Entre em [vercel.com](https://vercel.com) com **Sign Up com GitHub**, clique em **Add New → Project** e importe este repositório.
3. Se o projeto estiver em uma pasta do repositório, informe a pasta em **Root Directory**.
4. Em **Environment Variables**, crie a variável `SPTRANS_TOKEN` com o token da SPTrans.
5. Clique em **Deploy** e abra o endereço `.vercel.app` que aparecer.

Se a variável for criada depois do primeiro deploy, faça um novo deploy (**Deployments → Redeploy**). O arquivo `vercel.json` coloca a função na região de São Paulo (`gru1`).

## Como rodar no computador

Como o app depende da função do Vercel, abrir o `index.html` com o Live Server não basta. Instale a Vercel CLI (`npm i -g vercel`), crie um arquivo `.env` com `SPTRANS_TOKEN=seu_token` e rode `vercel dev` na pasta do projeto.

## Arquivos

| Arquivo | O que tem |
| --- | --- |
| `index.html` / `script.js` | Página inicial: busca de pontos e lista de favoritos |
| `ponto.html` / `ponto.js` | Painel com os próximos ônibus do ponto escolhido |
| `comum.js` | Código usado pelas duas páginas: chamada à API, mensagens e favoritos |
| `style.css` | Estilos e responsividade |
| `api/olhovivo.js` | Função do Vercel que faz o login e consulta a API Olho Vivo |
| `vercel.json` e `package.json` | Configuração do Vercel |

## Créditos

Dados de ônibus: **SPTrans — API Olho Vivo**.
