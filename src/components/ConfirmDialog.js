import React, { useState } from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ onCancel, onConfirm }) => {
  return (
    <div className="confirm-dialog">
      <div className="confirm-dialog-content">
        <p>Deseja salvar o PDF?</p>
        <button onClick={onCancel} className="cancel-button">
          Cancelar
        </button>
        <button onClick={onConfirm} className="confirm-button">
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default ConfirmDialog;