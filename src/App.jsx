import { useRef, useState } from "react";
import "./App.css";
import { Celda } from "./components/Celda";

let resultadosOrdenar = [];

function App() {
  const [palabra, setPalabra] = useState("");
  const [letrasDataTable, setLetrasDataTable] = useState([]);
  const [ordenamiento, setOrdenamiento] = useState([]);
  const [palabraCodificada, setPalabraCodificada] = useState("");
  const [compactacion, setCompactacion] = useState("");
  const [bitsFile, setBitsFile] = useState(null);

  const inputPalabra = useRef();
  const inputArchivo = useRef();

  const ObtenerCodigo = () => {
    if (palabra.length <= 2) {
      inputPalabra.current.focus();
      return;
    }

    const letras = new Set();
    let objetosLetras = [];

    for (let i = 0; i < palabra.length; i++) {
      letras.add(palabra[i]);
    }

    let cont = 0;
    letras.forEach((letra) => {
      cont++;
      objetosLetras.push({
        index: cont.toString(),
        letra: letra,
        probabilidad: getPropabilidad(letra),
      });
    });

    setLetrasDataTable(objetosLetras);

    let ordenarObj = ordenar(objetosLetras);

    resultadosOrdenar = [];

    resultadosOrdenar.push(ordenarObj.slice());

    while (ordenarObj.length > 2) {
      ordenarObj = sumarUltimos2(ordenarObj);
      ordenarObj = ordenar(ordenarObj);
      resultadosOrdenar.push(ordenarObj);
      ordenarObj = ordenarObj.map((item) => {
        const newItem = { ...item }; // Copia profunda del objeto
        delete newItem.suma; // Eliminar la propiedad "suma"
        return newItem;
      });
    }

    codificar(
      resultadosOrdenar[resultadosOrdenar.length - 1],
      resultadosOrdenar[resultadosOrdenar.length - 2]
    );

    getCodigoLetras(objetosLetras, resultadosOrdenar[0]);

    setOrdenamiento(resultadosOrdenar);

    console.log(resultadosOrdenar);
  };

  const getCodigoLetras = (letras, codigo) => {
    // console.log(resultadosOrdenar);
    let resultadoPalabraCodificada = "";

    for (let i = 0; i < letras.length; i++) {
      for (let j = 0; j < codigo.length; j++) {
        if (letras[i].letra === codigo[j].letra) {
          letras[i].codigo = codigo[j].codigo;
        }
      }
    }

    for (let j = 0; j < palabra.length; j++) {
      let indexLetra = letras.findIndex((item) => item.letra === palabra[j]);
      resultadoPalabraCodificada += letras[indexLetra].codigo;
    }

    getCompactacion(resultadoPalabraCodificada);

    setPalabraCodificada(resultadoPalabraCodificada);
  };

  const getCompactacion = (palabraCodificada) => {
    const bits = palabra.length * 8;
    const bitsCodificados = palabraCodificada.length;
    const compactacion = (bitsCodificados * 100) / bits;

    setCompactacion(100 - compactacion);
  };

  const codificar = (obj1, obj2) => {
    // let arreglo1 = obj1.map((item) => ({ ...item }));
    // let arreglo2 = obj2.map((item) => ({ ...item }));
    let arreglo1 = obj1;
    let arreglo2 = obj2;

    let indexOfArreglo2 = resultadosOrdenar.indexOf(obj2);

    if (arreglo1.length === 2) {
      arreglo1[0].codigo = "1";
      arreglo1[1].codigo = "0";
    }

    // Arreglo de abajo
    for (let i = 0; i < arreglo2.length; i++) {
      // Arreglo de arriba
      for (let j = 0; j < arreglo1.length; j++) {
        //Checar si el arreglo de arriba contiene el index del arreglo de abajo
        // arreglo1[j].index.includes(arreglo2[i].index) &&
        //   (arreglo2[i].codigo = arreglo1[j].codigo);

        // let indexSeparator = arreglo1[j].index.split(",");
        // // console.log(indexSeparator);

        // for (let k = 0; k < indexSeparator.length - 1; k++) {
        //   if (indexSeparator[k] === arreglo2[i].index) {
        //     arreglo2[i].codigo = arreglo1[j].codigo;
        //   }
        // }

        if (arreglo1[j].index.includes(arreglo2[i].index)) {
          arreglo2[i].codigo = arreglo1[j].codigo;
        }
      }
    }

    if (
      arreglo2[arreglo2.length - 1].codigo ===
      arreglo2[arreglo2.length - 2].codigo
    ) {
      arreglo2[arreglo2.length - 2].codigo += "1";
      arreglo2[arreglo2.length - 1].codigo += "0";
    }

    console.log(arreglo1);
    console.log(arreglo2);

    if (resultadosOrdenar[indexOfArreglo2 - 1]) {
      codificar(arreglo2, resultadosOrdenar[indexOfArreglo2 - 1]);
    }
  };

  const getPropabilidad = (letra) => {
    let probabilidad = 0;

    for (let i = 0; i < palabra.length; i++) {
      palabra[i] === letra && probabilidad++;
    }

    return `${probabilidad}/${palabra.length}`;
  };

  const sumarUltimos2 = (obj) => {
    let arreglo = obj.map((item) => ({ ...item })); // Copia profunda del arreglo

    const penultimoElemento = arreglo[arreglo.length - 2];
    const ultimoElemento = arreglo[arreglo.length - 1];

    const probabilidadPenultimo = penultimoElemento.probabilidad.split("/")[0];
    const probabilidadUltimo = ultimoElemento.probabilidad.split("/")[0];

    const sumaProbabilidades =
      parseInt(probabilidadPenultimo) + parseInt(probabilidadUltimo);

    const fraccionSuma = `${sumaProbabilidades}/${palabra.length}`;

    if (arreglo.length !== 2) {
      penultimoElemento.suma = true;
      ultimoElemento.suma = true;
    }

    penultimoElemento.probabilidad = fraccionSuma;

    // let a ="a";
    // a.endsWith
    // console.log(penultimoElemento.index.endsWith(","));

    // if (penultimoElemento.index.endsWith(",")) {
    // penultimoElemento.index += "," + ultimoElemento.index;
    // } else {
    penultimoElemento.index += ultimoElemento.index;
    // }

    arreglo.pop(); // Eliminar el último elemento

    return arreglo;
  };

  const ordenar = (obj) => {
    let copiaObj = obj.map((item) => ({ ...item })); // Copia profunda del arreglo

    const arregloOrdenado = copiaObj.sort((a, b) => {
      const probabilidadA = eval(a.probabilidad);
      const probabilidadB = eval(b.probabilidad);

      return probabilidadB - probabilidadA;
    });

    if (arregloOrdenado.length !== 2) {
      const penultimoElemento = arregloOrdenado[arregloOrdenado.length - 2];
      const ultimoElemento = arregloOrdenado[arregloOrdenado.length - 1];
      penultimoElemento.suma = true;
      ultimoElemento.suma = true;
    }

    return arregloOrdenado;
  };

  const handleInputPalabra = (e) => {
    const { value } = e.target;
    setPalabra(value);
  };

  const handleInputReiniciar = () => {
    setPalabra("");
    setLetrasDataTable([]);
    setOrdenamiento([]);
    setPalabraCodificada("");
    setCompactacion("");
    setBitsFile(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.includes("text/plain")) {
      setBitsFile(file.size);

      const reader = new FileReader();
      reader.onload = handleFileRead;
      reader.readAsText(file);
    }
  };

  const handleFileRead = (event) => {
    const content = event.target.result;
    // console.log(content);
    setPalabra(content);
  };

  return (
    <>
      <nav>
        <h1>Codificación Huffman</h1>

        <div className="barra">
          <div className="container" style={{ gap: "1.5em" }}>
            <input
              style={{ width: "70%", cursor: "pointer" }}
              type="file"
              onChange={handleFileChange}
              ref={inputArchivo}
            />

            <div className="compactacion">
              <h2>{" Tamaño:"}</h2>
              <p className="palabraCodificada">{bitsFile} bytes</p>
            </div>
          </div>

          <input
            style={{ width: "70%", cursor: "text" }}
            type="text"
            value={palabra}
            onChange={handleInputPalabra}
            ref={inputPalabra}
            placeholder="Escribe un palabra"
          />

          <button type="button" onClick={() => ObtenerCodigo()}>
            Obtener Codigo
          </button>

          <button
            type="button"
            className="btn-reiniciar"
            onClick={() => handleInputReiniciar()}
          >
            Reiniciar
          </button>
        </div>
      </nav>

      {palabraCodificada.length !== 0 && (
        <div className="barra-resultado">
          <div className="container">
            <div className="codificada">
              <h2>Palabra codificada: </h2>
              <p className="palabraCodificada num_codigo">
                {palabraCodificada}
              </p>
            </div>

            <div className="bits">
              <h2>{"="}</h2>
              <p className="palabraCodificada">
                {palabraCodificada.length} bits
              </p>
              <h2>{"="}</h2>
              <p className="palabraCodificada">
                {palabraCodificada.length / 8} bytes
              </p>
            </div>
          </div>

          <div className="container">
            <div className="compactacion">
              <h2>Compactación:</h2>
              <p className="palabraCodificada">
                {compactacion.toString().substring(0, 10)} %
              </p>
            </div>
          </div>
        </div>
      )}

      {letrasDataTable.length !== 0 && (
        <section>
          <table cellSpacing="0" cellPadding="0">
            <thead>
              <tr>
                <td>#</td>
                <td>Letras</td>
                <td>Probabilidad</td>
                {ordenamiento &&
                  ordenamiento.map((item, i) => <td key={i}>{i}°</td>)}
              </tr>
            </thead>
            <tbody>
              {[...Array(letrasDataTable.length)].map((_, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: "bold" }} className="num">
                    {i + 1}
                  </td>
                  <Celda letra={letrasDataTable[i]?.letra} />
                  <Celda
                    codigo={letrasDataTable[i]?.codigo}
                    elementoSuma={letrasDataTable[i]?.suma}
                    probabilidad={letrasDataTable[i]?.probabilidad}
                  />
                  {ordenamiento.map((itemOrdenado, j) => (
                    <Celda
                      key={`${i}_${j}`}
                      codigo={itemOrdenado[i]?.codigo}
                      elementoSuma={itemOrdenado[i]?.suma}
                      probabilidad={itemOrdenado[i]?.probabilidad}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </>
  );
}

export default App;
