const API_URL = '/api';
const CATEGORIAS_ORDEM = ["Pizza", "Pizza Doce", "Crepe", "Crepe Doce", "Prato", "Refrigerante", "Água", "Suco"];

let cardapioGlobal = [];
let comandaAtual = { itens: [], subtotal: 0 };
let modoMeio = false;
let primeiraMetade = null;

// --- UTILS ---
function normalizar(str) { return str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() : ""; }
function ehPizza(tipo) { return normalizar(tipo).includes("pizza"); }

function atualizarDataHora() {
    const agora = new Date();
    const el = document.getElementById('data-hora');
    if (el) el.innerText = `${agora.toLocaleDateString()} ${agora.toLocaleTimeString().slice(0,5)}`;
    const elPed = document.getElementById('numero-pedido');
    if (elPed && elPed.innerText === 'NOVO') elPed.innerText = Math.floor(Math.random() * 8999) + 1000;
}

// --- API ---
async function init() {
    try {
        const res = await fetch(`${API_URL}/cardapio`);
        cardapioGlobal = await res.json();
        renderizarMenu();
        atualizarComanda();
    } catch (e) { console.error("Erro na API", e); }
}

async function atualizarComanda() {
    const res = await fetch(`${API_URL}/comanda`);
    comandaAtual = await res.json();
    renderizarComandaDOM();
}

async function enviar(payload) {
    await fetch(`${API_URL}/comanda/adicionar`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    atualizarComanda();
}

async function deletar(uid) {
    await fetch(`${API_URL}/comanda/${uid}`, { method: 'DELETE' });
    atualizarComanda();
}

async function salvarObservacao(uid, texto) {
    await fetch(`${API_URL}/comanda/${uid}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ observacao: texto }) });
    // Não recarrega para manter foco
}

async function limparMesa() {
    if(confirm("Limpar pedido da mesa?")) {
        await fetch(`${API_URL}/comanda/limpar`, { method: 'POST' });
        document.getElementById('chkServico').checked = false;
        document.getElementById('numero-pedido').innerText = 'NOVO';
        atualizarComanda();
    }
}

// --- IMPRESSÃO ESPECIAL ---
function imprimirCozinha() {
    document.body.classList.add('modo-cozinha'); // Ativa CSS da cozinha
    window.print();
    document.body.classList.remove('modo-cozinha'); // Desativa ao voltar
}

// --- INTERFACE ---
function renderizarMenu(filtro = "") {
    const area = document.getElementById('menu-area');
    if(!area) return;
    area.innerHTML = "";
    const termo = normalizar(filtro);

    CATEGORIAS_ORDEM.forEach(cat => {
        const itens = cardapioGlobal.filter(i => i.tipo === cat && normalizar(i.nome).includes(termo));
        if (itens.length > 0) {
            const section = document.createElement('div');
            section.className = 'categoria-box';
            section.innerHTML = `<h3 class="cat-titulo">${cat}</h3>`;
            const grid = document.createElement('div');
            grid.className = 'grid-items';
            
            itens.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                card.id = `card-produto-${item.id}`;
                card.onclick = () => clicarItem(item);
                card.innerHTML = `<div class="card-info"><strong>${item.nome}</strong>${ehPizza(item.tipo) ? '<span class="badge-div">½</span>' : ''}</div><div class="card-price">R$ ${item.preco.toFixed(2)}</div>`;
                grid.appendChild(card);
            });
            section.appendChild(grid);
            area.appendChild(section);
        }
    });
}

function clicarItem(item) {
    if (modoMeio) {
        if (ehPizza(item.tipo)) processarMeioAMeio(item);
        else alert(`"${item.nome}" não pode ser dividido.`);
    } else {
        enviar({ id: item.id });
    }
}

function processarMeioAMeio(item) {
    const aviso = document.getElementById('aviso-meio');
    if (!primeiraMetade) {
        primeiraMetade = item;
        document.getElementById('nome-primeira').textContent = item.nome;
        document.getElementById(`card-produto-${item.id}`).classList.add('selecionado-verde');
        aviso.classList.add('visible');
    } else {
        document.getElementById(`card-produto-${primeiraMetade.id}`).classList.remove('selecionado-verde');
        const precoFinal = (primeiraMetade.preco + item.preco) / 2;
        enviar({ itemPersonalizado: { nome: `½ ${primeiraMetade.nome} / ½ ${item.nome}`, preco: precoFinal, tipo: 'Pizza Mista' } });
        toggleModoMeio();
    }
}

function toggleModoMeio() {
    modoMeio = !modoMeio;
    if (!modoMeio && primeiraMetade) {
        document.getElementById(`card-produto-${primeiraMetade.id}`).classList.remove('selecionado-verde');
        primeiraMetade = null;
    }
    document.getElementById('btn-meio').classList.toggle('active');
    const aviso = document.getElementById('aviso-meio');
    if(modoMeio) aviso.classList.remove('visible'); // Limpa aviso anterior
    else aviso.classList.remove('visible');
}

function renderizarComandaDOM() {
    const lista = document.getElementById('lista-pedidos');
    if (!lista) return;

    lista.innerHTML = "";
    atualizarDataHora();

    comandaAtual.itens.forEach(item => {
        const li = document.createElement('li');
        li.className = 'pedido-item';
        
        // Garante que se não tiver nada, é string vazia
        const obsValor = item.observacao || "";
        
        li.innerHTML = `
            <div style="flex:1">
                <div style="display:flex; gap:6px; align-items:center;">
                    <span style="font-weight:bold; font-size:1.1em; min-width:25px;">
                        ${item.quantidade}x
                    </span>
                    <span style="font-weight:bold;">${item.nome}</span>
                </div>
                
                <input type="text" 
                    class="input-obs" 
                    placeholder="Obs: (ex: sem cebola)..." 
                    value="${obsValor}" 
                    oninput="this.nextElementSibling.innerText = this.value ? '** ' + this.value : ''"
                    onchange="salvarObservacao(${item.uid}, this.value)"
                >
                
                <div class="print-obs">${obsValor ? '** ' + obsValor : ''}</div>
            </div>
            
            <div class="pedido-actions">
                <span class="preco-texto">R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
                <button onclick="deletar(${item.uid})">&minus;</button>
            </div>
        `;
        lista.appendChild(li);
    });

    const sub = comandaAtual.subtotal;
    const serv = document.getElementById('chkServico').checked ? sub * 0.1 : 0;
    const tot = sub + serv;
    
    document.getElementById('val-subtotal').textContent = `R$ ${sub.toFixed(2)}`;
    document.getElementById('val-servico').textContent = `R$ ${serv.toFixed(2)}`;
    document.getElementById('val-total').textContent = `R$ ${tot.toFixed(2)}`;
    
    const fab = document.getElementById('fab-total');
    if(fab) fab.innerText = `R$ ${tot.toFixed(2)}`;
}

// --- DRAWER MOBILE ---
function toggleDrawer() {
    const el = document.querySelector('.comanda-section');
    const over = document.getElementById('drawer-overlay');
    if (!el.classList.contains('open')) {
        history.pushState({ drawer: true }, "", "#pedido");
        el.classList.add('open');
        over.classList.add('open');
    } else {
        history.back();
    }
}
function fecharDrawerComHistorico() { history.back(); }

window.addEventListener('popstate', () => {
    document.querySelector('.comanda-section').classList.remove('open');
    document.getElementById('drawer-overlay').classList.remove('open');
});

// --- INIT ---
document.getElementById('busca').addEventListener('input', (e) => renderizarMenu(e.target.value));
init();