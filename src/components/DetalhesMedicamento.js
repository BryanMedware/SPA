import React, { useRef, useState, useEffect } from 'react';
import './DetalhesMedicamento.css';
import jsPDF from 'jspdf';
import ConfirmDialog from './ConfirmDialog';

const DetalhesMedicamento = ({
  nomeProduto,
  classeTerapeutica,
  principioAtivo,
  medicamentoReferencia,
  categoriaRegulatoria,
  nomeFabricante,
  fecharModal
}) => {
  const componentRef = useRef();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  let ultimoCodigo = parseInt(localStorage.getItem('ultimoCodigo')) || 0;

  const gerarProximoCodigo = () => {
    ultimoCodigo += 1;
    // Atualizar o último código no localStorage
    localStorage.setItem('ultimoCodigo', ultimoCodigo);
    return ultimoCodigo;
  };

  useEffect(() => {
    // Adiciona a classe ao body quando o componente é montado
    document.body.classList.add('modal-open');

    // Remove a classe quando o componente é desmontado
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  const handleSaveButtonClick = () => {
    setShowConfirmDialog(true);
  };

  const handleCancelSave = () => {
    setShowConfirmDialog(false);
  };

const handleConfirmSave = () => {
  setShowConfirmDialog(false);
  const pdf = new jsPDF('p', 'pt', 'a4');
  let lineHeight = 30; // Reduzi a altura da linha para melhor acomodar o texto
  const margin = 50;
  const maxWidth = pdf.internal.pageSize.getWidth() - 2 * margin;

  // Medir as dimensões do texto do nome do produto
  pdf.setFontSize(20);
  const productNameText = pdf.splitTextToSize(nomeProduto, maxWidth);
  const productNameTextHeight = productNameText.length * lineHeight;

  // Definir a altura do fundo azul com base nas dimensões do texto
  const blueBackgroundHeight = productNameTextHeight + 20; // Adicione algum espaço extra

  pdf.setFillColor(52, 152, 219);
  pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), blueBackgroundHeight, 'F');
  pdf.setFontSize(26);
  pdf.setTextColor(255);

  const yStartPosition = blueBackgroundHeight / 2 + lineHeight / 10;
  let currentY = yStartPosition;

  const addTextWithWrap = (text) => {
    const textLines = pdf.splitTextToSize(text, maxWidth);
    textLines.forEach((line) => {
      pdf.text(margin, currentY, line);
      currentY += lineHeight; // Avança para a próxima linha
    });
  };

  addTextWithWrap(nomeProduto);

  const splitText = (text, maxLength) => {
    const words = text.split(' ');
    let result = '';
    let currentLine = '';
  
    for (const word of words) {
      if (currentLine.length + word.length <= maxLength) {
        currentLine += (currentLine === '' ? '' : ' ') + word;
      } else {
        result += (result === '' ? '' : '\n') + currentLine;
        currentLine = word;
      }
    }
  
    if (currentLine.length > 0) {
      result += (result === '' ? '' : '\n') + currentLine;
    }
  
    return result;
  };
  
  const infoLines = [
    `Classe Terapêutica: ${splitText(classeTerapeutica, 60)}`,
    `Princípio Ativo: ${splitText(principioAtivo, 60)}`,
    `Medicamento de Referência: ${splitText(medicamentoReferencia || '', 60)}`,
    `Categoria Regulatória: ${splitText(categoriaRegulatoria, 60)}`,
    `Nome do Fabricante: ${splitText(nomeFabricante, 60)}`
  ];

  let yPosition = blueBackgroundHeight + 30; // Ajuste a posição inicial para as informações
  lineHeight = 50;

    infoLines.forEach((line) => {
      const [text, value] = line.split(':');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.setTextColor(0);

      const textLines = pdf.splitTextToSize(`${text}:`, pdf.internal.pageSize.getWidth() - 80);
      textLines.forEach((textLine, index) => {
        pdf.text(40, yPosition + index * lineHeight, textLine, { align: 'left' });
      });

      pdf.setFont('helvetica', 'normal');
      const valueLines = pdf.splitTextToSize(value.trim(), pdf.internal.pageSize.getWidth() - 100);
      valueLines.forEach((valueLine, index) => {
        pdf.text(180, yPosition + index * lineHeight, valueLine, { align: 'left' });
      });

      yPosition += Math.max(textLines.length, valueLines.length) * lineHeight;
    });

    const confirmSave = ('Deseja salvar o PDF?');
    if (confirmSave) {
      pdf.save(`detalhes_medicamento_${nomeProduto}.pdf`);
    }

    const proximoCodigo = gerarProximoCodigo();    
  
    const pdfURL = `http://localhost:3000/pdf?id=${proximoCodigo}`;
    window.history.pushState({}, '', pdfURL);
  };

  return (
    <div className="modal-overlay">
      <div id="detalhes-medicamento" className="DetalhesMedicamento" ref={componentRef}>
        <div className="DetalhesMedicamento-content">
          <div className="DetalhesMedicamento-header">
          <h2 className="limit-max-height">{nomeProduto}</h2>
          </div>
          <div className="DetalhesMedicamento-info">
            <p>
              <strong>Classe Terapêutica:<br /></strong> {classeTerapeutica}
            </p>
            <p>
              <strong>Princípio Ativo:<br /></strong> {principioAtivo}
            </p>
            <p>
              <strong>Medicamento de Referência:<br /></strong> {medicamentoReferencia}
            </p>
            <p>
              <strong>Categoria Regulatória:<br /></strong> {categoriaRegulatoria}
            </p>
            <p>
              <strong>Nome do Fabricante:<br /></strong> {nomeFabricante}
            </p>
          </div>
        </div>
        <div className="button-container">
          <button className="save-pdf-button" onClick={handleSaveButtonClick}>
            Salvar em PDF
          </button>
          {showConfirmDialog && (
            <ConfirmDialog onCancel={handleCancelSave} onConfirm={handleConfirmSave} />
          )}
          <button className="close-button" onClick={fecharModal}>
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalhesMedicamento;