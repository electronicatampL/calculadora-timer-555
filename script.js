document.addEventListener("DOMContentLoaded", () => cambiarModo('monoestable'));

function cambiarModo(modo) {
    document.getElementById("astable-fields").style.display = (modo === "astable") ? "block" : "none";
    document.getElementById("formula").innerHTML = modo === "monoestable"
        ? "\\( T = 1.1 R_1 C \\), \\( f = \\frac{1}{T} \\)"
        : "\\( f = \\frac{1.44}{(R_1 + 2 R_2) C} \\)";
    MathJax.typesetPromise(); // Renderiza la fórmula con MathJax
}

function calcular() {
    const modo = document.querySelector(".nav-link.active").id === "btnMonoestable" ? "monoestable" : "astable";
    const unidad = document.getElementById("unidad").value;
    const resultadoTable = document.getElementById("resultado-table");

    const r1 = obtenerValor("r1") * obtenerUnidad("r1Unidad");
    const c = obtenerValor("c") * obtenerUnidad("cUnidad");

    if (c <= 0 || r1 <= 0) {
        mostrarError(resultadoTable, "⚠️ Ingrese valores válidos.");
        return;
    }

    let resultados = [];

    if (modo === "monoestable") {
        let t = 1.1 * r1 * c;
        let f = 1 / t; // Frecuencia en Hz

        resultados.push(["⏱ Tiempo de Pulso", formatoTiempo(t, unidad)]);
        resultados.push(["🎵 Frecuencia", formatoNumero(f) + " Hz"]);
    } else {
        const r2 = obtenerValor("r2") * obtenerUnidad("r2Unidad");

        if (r2 <= 0) {
            mostrarError(resultadoTable, "⚠️ Ingrese valores válidos.");
            return;
        }

        let tHigh = 0.693 * (r1 + r2) * c;
        let tLow = 0.693 * r2 * c;
        let freq = 1.44 / ((r1 + 2 * r2) * c);

        resultados.push(["⏱ Tiempo en Alto", formatoTiempo(tHigh, unidad)]);
        resultados.push(["⏳ Tiempo en Bajo", formatoTiempo(tLow, unidad)]);
        resultados.push(["🎵 Frecuencia", formatoNumero(freq) + " Hz"]);
    }

    mostrarResultados(resultadoTable, resultados);
}

function obtenerValor(id) {
    return parseFloat(document.getElementById(id).value) || 0;
}

function obtenerUnidad(id) {
    return parseFloat(document.getElementById(id).value) || 1;
}

function mostrarError(tabla, mensaje) {
    tabla.innerHTML = `<tr><td colspan="2" class="text-center text-danger">${mensaje}</td></tr>`;
}

function mostrarResultados(tabla, datos) {
    tabla.innerHTML = datos.map(([parametro, valor]) =>
        `<tr><td>${parametro}</td><td>${valor}</td></tr>`
    ).join("");
}

function formatoNumero(num) {
    return num.toFixed(6).replace(/\.?0+$/, "");
}

function formatoTiempo(valor, unidad) {
    return unidad === "ms" ? formatoNumero(valor * 1000) + " ms" : formatoNumero(valor) + " s";
}
