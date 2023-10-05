// server.js
const express = require('express');
const axios = require('axios');

const app = express();
const port = 5000;  // Escolha uma porta para o servidor

app.use(express.json());

app.get('/buscar-medicamentos', async (req, res) => {
  const { nomeProduto } = req.query;

  try {
    const url = `https://consultas.anvisa.gov.br/#/medicamentos/q/?nomeProduto=${nomeProduto}`;
    const response = await axios.get(url);

    // Retorna os dados da consulta
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar medicamentos:', error);
    res.status(500).json({ error: 'Erro ao buscar medicamentos' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});