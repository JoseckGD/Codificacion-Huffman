import React from "react";

export const Celda = ({ codigo, probabilidad, letra, elementoSuma }) => {
  return (
    <td className="celda">
      {codigo && <p className={`codigo `}>{codigo}</p>}
      {probabilidad && (
        <p className={`probabilidad ${elementoSuma ? "suma" : ""}`}>
          <sup>{probabilidad.split("/")[0]}</sup>/
          <sub>{probabilidad.split("/")[1]}</sub>
        </p>
      )}
      {letra && <p className="letra">{letra}</p>}
    </td>
  );
};
