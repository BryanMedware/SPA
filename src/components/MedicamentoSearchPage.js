import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import DetalhesMedicamento from './DetalhesMedicamento';
import './MedicamentoSearchPage.css';

const MedicamentoSearchPage = () => {
  const [nomeMedicamento, setNomeMedicamento] = useState('');
  const [resultados, setResultados] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [detalhesMedicamentoInfo, setDetalhesMedicamentoInfo] = useState(null);
  const [showDetalhesModal, setShowDetalhesModal] = useState(false);
  const scrollTopButton = document.getElementById('scrollTopButton');

  const handleBuscarMedicamentos = () => {
    Papa.parse('/DADOS_ABERTOS_MEDICAMENTOS.csv', {
      encoding: "UTF-8",
      download: true,
      complete: (result) => {
        if (result.data) {
          const medicamentosComNumeroProcesso = result.data.map(medicamento => ({
            ...medicamento,
          }));
          setMedicamentos(medicamentosComNumeroProcesso);
        } else {
          console.error('Erro ao processar o CSV.');
        }
      },
      header: true,
    });
  };

  const atualizarURL = (nomeMedicamento) => {
    const novaURL = nomeMedicamento
      ? `http://localhost:3000/pesquisar?nome=${nomeMedicamento}`
      : `http://localhost:3000`;
    window.history.pushState({}, '', novaURL);
  };  

  const atualizarURL_Detalhes = (numeroProcesso) => {
    const novaURL = `http://localhost:3000/medicamento/${numeroProcesso}`;
    window.history.pushState({}, '', novaURL);
  };  

  useEffect(() => {
    handleBuscarMedicamentos();
  }, []);

  const handleNomeMedicamentoChange = (event) => {
    const nome = event.target.value;
    setNomeMedicamento(nome);
  
    if (nome.length < 3) {
      setResultados([]);
      atualizarURL('');
      return;
    }
  
    const resultadosEncontrados = medicamentos.filter(item =>
      item['NOME_PRODUTO'] && item['NOME_PRODUTO'].toLowerCase().includes(nome.toLowerCase())
    );
  
    atualizarURL(nome);
    setResultados(resultadosEncontrados);
  };   

  const handleAbrirDetalhes = (item) => {
    const { NOME_PRODUTO, CLASSE_TERAPEUTICA, PRINCIPIO_ATIVO, MEDICAMENTO_DE_REFERENCIA, CATEGORIA_REGULATORIA, EMPRESA_DETENTORA_REGISTRO, NUMERO_PROCESSO } = item;
  
    setDetalhesMedicamentoInfo({
      nomeProduto: NOME_PRODUTO,
      classeTerapeutica: CLASSE_TERAPEUTICA,
      principioAtivo: PRINCIPIO_ATIVO,
      medicamentoReferencia: MEDICAMENTO_DE_REFERENCIA,
      categoriaRegulatoria: CATEGORIA_REGULATORIA,
      nomeFabricante: EMPRESA_DETENTORA_REGISTRO
    });
    atualizarURL_Detalhes(NUMERO_PROCESSO);
    setShowDetalhesModal(true);
  };
  
  const renderizarResultados = () => {
    return (
      <ul>
        {resultados.map((item, index) => (
          <li key={index}>
            <button onClick={() => handleAbrirDetalhes(item)}>
              {`${item['NOME_PRODUTO']} - ${item['NUMERO_REGISTRO_PRODUTO']} - ${item['NUMERO_PROCESSO']}`}
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="MedicamentoSearchPage">
      <input
        type="text"
        value={nomeMedicamento}
        onChange={handleNomeMedicamentoChange}
        placeholder="Digite o nome do medicamento"
        className="input-search"
      />

      {nomeMedicamento.length >= 3 && (
        <ul className="resultados-list">
          {renderizarResultados()}
        </ul>
      )}

      {showDetalhesModal && (
        <DetalhesMedicamento
          {...detalhesMedicamentoInfo}
          fecharModal={() => setShowDetalhesModal(false)}
        />
      )}
    </div>
  );
};

export default MedicamentoSearchPage;