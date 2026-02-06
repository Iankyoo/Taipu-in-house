const cardapio = require('./database.json');

// Banco em memória
let comanda = [];

module.exports = {
    listarCardapio: (req, res) => {
        res.json(cardapio);
    },

    listarComanda: (req, res) => {
        const subtotal = comanda.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
        res.json({ itens: comanda, subtotal });
    },

    adicionarItem: (req, res) => {
        const { id, itemPersonalizado } = req.body;
        
        if (id) {
            // Item Normal
            const itemMenu = cardapio.find(i => i.id === id);
            if (itemMenu) {
                const existente = comanda.find(i => i.id === id);
                if (existente) {
                    existente.quantidade += 1;
                } else {
                    comanda.push({ ...itemMenu, quantidade: 1, uid: Date.now(), observacao: "" });
                }
            }
        } 
        else if (itemPersonalizado) {
            // Meio a Meio
            const existente = comanda.find(i => i.nome === itemPersonalizado.nome);
            if (existente) {
                existente.quantidade += 1;
            } else {
                comanda.push({ ...itemPersonalizado, quantidade: 1, uid: Date.now(), observacao: "" });
            }
        }
        res.json({ success: true });
    },

    removerItem: (req, res) => {
        const uid = Number(req.params.uid);
        const index = comanda.findIndex(item => item.uid === uid);

        if (index !== -1) {
            if (comanda[index].quantidade > 1) {
                comanda[index].quantidade -= 1;
            } else {
                comanda.splice(index, 1);
            }
        }
        res.json({ success: true });
    },

    // --- SALVAR OBSERVAÇÃO ---
    atualizarObservacao: (req, res) => {
        const uid = Number(req.params.uid);
        const { observacao } = req.body;
        
        const item = comanda.find(i => i.uid === uid);
        if (item) {
            item.observacao = observacao;
        }
        res.json({ success: true });
    },

    limparComanda: (req, res) => {
        comanda = [];
        res.json({ success: true });
    }
};