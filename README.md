# Meu Ponto SP
Global Solution 2026.2  Application Development
Aplicativo web em HTML, CSS e JavaScript que mostra quanto tempo falta para cada ônibus chegar ao seu ponto, com dados em tempo real da API Olho Vivo da SPTrans.

- App no Vercel: https://meu-ponto-sp-alpha.vercel.app/index.html


## Problema que o app resolve

Quem anda de ônibus em São Paulo muitas vezes sai de casa sem saber se o ônibus acabou de passar ou se ainda vai demorar, e espera no ponto sem informação. O Meu Ponto SP mostra a previsão de chegada de todas as linhas de um ponto, atualizada sozinha, para a pessoa decidir a hora certa de sair. Os ônibus acessíveis aparecem com ♿.

## O que o app faz

- Busca de pontos pelo nome ou pela rua, com validação do campo de busca.
- Painel do ponto com os próximos ônibus de cada linha, mostrando quantos minutos faltam e o horário previsto. A linha com o ônibus mais próximo aparece primeiro, os ônibus que chegam em até 2 minutos ficam em amarelo e o painel se atualiza sozinho a cada 30 segundos.
- Pontos favoritos salvos no `localStorage`, que aparecem na página inicial para abrir o painel com um toque.
- Mensagens de erro para busca vazia, ponto não encontrado, falha de conexão e token inválido.
- Layout responsivo, que funciona no celular e no computador.


## Como executar

O app está publicado em https://meu-ponto-sp-alpha.vercel.app e abre direto no navegador do computador ou do celular.

Para publicar uma cópia, crie um token na área de desenvolvedores da SPTrans, importe este repositório no Vercel e cadastre o token na variável de ambiente SPTRANS_TOKEN antes do deploy.

## Arquivos

- index.html e script.js - página inicial com a busca de pontos e os favoritos
- ponto.html e ponto.js - painel com os próximos ônibus do ponto
- comum.js - código usado pelas duas páginas
- style.css - estilos e versão para celular
- api/olhovivo.js - função do Vercel que consulta a API Olho Vivo
- vercel.json e package.json - configuração do Vercel

