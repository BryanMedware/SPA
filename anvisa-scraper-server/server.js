const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/buscar-medicamento/:nome', async (req, res) => {
  const nomeMedicamento = req.params.nome;
  try {
    const response = await axios.get(`https://consultas.anvisa.gov.br/#/medicamentos/q/?nomeProduto=${nomeMedicamento}`);
    const html = response.data;
    const $ = cheerio.load(html);
    
    // Aqui, você pode usar técnicas de scraping para extrair as informações desejadas
    // Vamos apenas enviar o título da página como exemplo
    const tituloPagina = $('title').text();

    res.json({ tituloPagina });
  } catch (error) {
    console.error('Erro ao buscar informações do medicamento:', error);
    res.status(500).json({ error: 'Erro ao buscar informações do medicamento.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});