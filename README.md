# Sistema PDV para Pizzaria (Web & Mobile)

Um sistema de Ponto de Venda (PDV) Full-Stack desenvolvido em JavaScript, focado na agilidade de atendimento para pizzarias. O projeto apresenta uma interface responsiva que se adapta de desktops para dispositivos móveis (com navegação estilo app nativo) e possui um módulo avançado de impressão térmica.

![NodeJS](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)

## 📋 Sobre o Projeto

Este sistema foi desenvolvido para resolver problemas reais de operação em uma pizzaria delivery/balcão. Diferente de sistemas genéricos, ele foca em:
1.  **Velocidade:** Interface otimizada para poucos cliques.
2.  **Mobilidade:** Operação completa via celular para garçons.
3.  **Controle de Produção:** Separação automática de informações para o cliente (cupom fiscal) e para a cozinha (comanda de produção).

## 🛠 Funcionalidades Principais

### Gestão de Pedidos
* **Lógica "Meio a Meio":** Sistema visual para seleção de pizzas com dois sabores, calculando automaticamente a média de preço e agrupando na comanda.
* **Agrupamento Inteligente:** Itens repetidos são automaticamente agrupados e quantificados (ex: "3x Coca-Cola").
* **Observações em Tempo Real:** Campo de texto para instruções especiais (ex: "Sem cebola") que sincroniza instantaneamente com o backend.

### Interface & UX
* **Design Responsivo Híbrido:**
    * *Desktop:* Layout de colunas fixas para monitores POS.
    * *Mobile:* Menu em tela cheia com "Drawer" (gaveta lateral) deslizante para o carrinho, simulando a experiência de um aplicativo nativo.
* **Navegação Mobile:** Integração com a API de Histórico do navegador (`history.pushState`), permitindo que o botão "Voltar" do celular feche o menu lateral ao invés de sair da página.

### Módulo de Impressão Térmica
Utilização avançada de **CSS Media Queries (`@media print`)** para controle total da impressora térmica (80mm):
* **Modo Cliente:** Cupom fiscal padrão com valores, taxas e totais.
* **Modo Cozinha:** Layout exclusivo de alto contraste, fontes ampliadas, sem preços e com destaque para observações e itens modificados.

## 🏗 Arquitetura do Projeto

O projeto segue uma arquitetura MVC simplificada utilizando JavaScript em ambas as pontas (Full Stack JS).

```text
/
├── public/              # Frontend (Cliente)
│   ├── index.html       # Estrutura DOM
│   ├── style.css        # Estilos, Responsividade e Regras de Impressão
│   └── app.js           # Lógica de Interface e Comunicação com API
│
├── src/                 # Backend (Servidor)
│   ├── server.js        # Entry point e rotas Express
│   ├── controller.js    # Regras de negócio e manipulação de dados
│   └── database.json    # Persistência de dados (JSON)
│
└── INICIAR_SISTEMA.bat  # Script de inicialização automática (Windows)

🚀 Como Executar
Pré-requisitos
Node.js instalado.

Navegador moderno (Chrome/Edge/Safari).

(Opcional) Impressora Térmica configurada no SO.

Instalação
Clone o repositório:

Bash

git clone [https://github.com/SEU-USUARIO/NOME-DO-PROJETO.git](https://github.com/SEU-USUARIO/NOME-DO-PROJETO.git)
Instale as dependências:

Bash

npm install
Inicie o servidor:

Bash

node src/server.js
Ou utilize o arquivo INICIAR_SISTEMA.bat no Windows.

Acesse http://localhost:3000 no navegador.

🖨 Configuração de Impressão
Para garantir a formatação correta em impressoras térmicas de 80mm:

Ao clicar em "Imprimir", selecione a impressora térmica.

Defina o Tamanho do Papel para 80mm Roll (ou 72mm).

Defina Margens como Nenhuma ou Mínima.

Desmarque a opção Cabeçalhos e Rodapés.

💻 Tecnologias Utilizadas
Backend: Node.js, Express.

Frontend: HTML5, CSS3 (Flexbox, Grid, Media Queries), Vanilla JavaScript (ES6+).

Dados: JSON (Armazenamento local leve).

Desenvolvido por Ian Kiyoshi