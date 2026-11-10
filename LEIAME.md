# Murilo Zennaro — site + painel de projetos

## Estrutura
- `index.html` — página
- `css/style.css` — estilos
- `js/main.js` — scripts (idioma, hero, animações, projetos e detalhe)
- `data/projetos.json` — **lista de projetos** (o painel edita este arquivo)
- `img/projetos/` — imagens dos projetos (as enviadas pelo painel caem aqui)
- `img/hero/` e `img/sobre.jpg` — fotos do hero e da seção Sobre
- `.pages.yml` — configuração do painel (Pages CMS)

## Publicar (GitHub Pages)
1. Suba todos os arquivos para o repositório (inclusive `.pages.yml`, que começa com ponto).
2. Settings → Pages → Branch `main` / pasta `/ (root)`.

## Ativar o painel para o Murilo
1. Acesse https://app.pagescms.org e entre com a sua conta do GitHub.
2. Instale o app do Pages CMS no GitHub e dê acesso a este repositório.
3. Abra o repositório no Pages CMS → aparece **Projetos** no menu.
4. Em **Collaborators**, convide o e-mail do Murilo. Ele entra pelo convite, sem precisar de conta no GitHub.

## Como ele usa
Em **Projetos**, cada projeto tem:
- **Mostrar no site** — esconde sem apagar.
- **Nome** e **Capa** — os únicos obrigatórios.
- **Categoria**, **descrição** — opcionais, com versão em inglês opcional.
- **Imagens do projeto** — sem limite; arrasta para ordenar.
- **Layout das imagens** — duas colunas ou uma por linha.
- **Informações** — quantas quiser (Cliente, Ano, Ferramentas…).
- **Links** — nenhum, um ou vários (Behance, Instagram, site…), com texto do botão personalizável.

Tudo que ficar vazio simplesmente não aparece no site.
Arrastar os projetos muda a ordem no site. **Salvar** → o GitHub Pages atualiza em 1–2 minutos.

Obs.: as capas atuais vieram do Behance em tamanho pequeno — vale trocar pelos arquivos originais pelo painel.
