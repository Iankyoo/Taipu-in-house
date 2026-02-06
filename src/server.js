const express = require('express');
const cors = require('cors');
const path = require('path');
const controller = require('./controller');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

// Rotas da API
app.get('/api/cardapio', controller.listarCardapio);
app.get('/api/comanda', controller.listarComanda);
app.post('/api/comanda/adicionar', controller.adicionarItem);
app.delete('/api/comanda/:uid', controller.removerItem);
app.patch('/api/comanda/:uid', controller.atualizarObservacao); // <--- Nova rota
app.post('/api/comanda/limpar', controller.limparComanda);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});