import React from 'react';
import { useParams } from 'react-router-dom';

const DownloadBula = () => {
  const { codigoBula } = useParams();

  return (
    <div>
      <h2>Download da Bula em PDF</h2>
      <a href={`https://bula.vercel.app/pdf?id=${codigoBula}`} target="_blank" download>
        Download Bula (PDF)
      </a>
    </div>
  );
};

export default DownloadBula;