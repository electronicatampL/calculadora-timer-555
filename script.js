document.addEventListener("DOMContentLoaded", () => cambiarModo('monoestable'));

function cambiarModo(modo) {
    const formula = document.getElementById("formula");
    const astableFields = document.getElementById("astable-fields");

    if (modo === "monoestable") {
        formula.innerHTML = `\\( T = 1.1 R_1 C \\)`;
        astableFields.style.display = "none";
    } else {
        formula.innerHTML = `\\( T_H = 0.693 (R_1 + R_2) C \\), \\( T_L = 0.693 R_2 C \\), \\( f = \\frac{1.44}{(R_1 + 2R_2)C} \\)`;
        astableFields.style.display = "block";
    }

    document.getElementById("btnMonoestable").classList.toggle("active", modo === "monoestable");
    document.getElementById("btnAstable").classList.toggle("active", modo === "astable");

    MathJax.typesetPromise(); // Recargar fórmula en MathJax
}

function calcular() {
    const modo = document.querySelector(".nav-link.active").id === "btnMonoestable" ? "monoestable" : "astable";
    const unidad = document.getElementById("unidad").value;

    const r1 = obtenerValor("r1") * obtenerUnidad("r1Unidad");
    const c = obtenerValor("c") * obtenerUnidad("cUnidad");

    if (r1 <= 0 || c <= 0) {
        alert("⚠️ Ingrese valores válidos.");
        return;
    }

    let resultadoHTML = "";

    if (modo === "monoestable") {
        let t = 1.1 * r1 * c;
        let f = 1 / t;

        resultadoHTML += `<tr><td>Tiempo Alto (TH)</td><td>${formatoTiempo(t, unidad)}</td></tr>`;
        resultadoHTML += `<tr><td>Tiempo Bajo (TL)</td><td>N/A</td></tr>`;
        resultadoHTML += `<tr><td>Frecuencia</td><td>${formatoNumero(f)} Hz</td></tr>`;
    } else {
        const r2 = obtenerValor("r2") * obtenerUnidad("r2Unidad");

        if (r2 <= 0) {
            alert("⚠️ Ingrese valores válidos.");
            return;
        }

        let tHigh = 0.693 * (r1 + r2) * c;
        let tLow = 0.693 * r2 * c;
        let freq = 1.44 / ((r1 + 2 * r2) * c);

        resultadoHTML += `<tr><td>Tiempo Alto (TH)</td><td>${formatoTiempo(tHigh, unidad)}</td></tr>`;
        resultadoHTML += `<tr><td>Tiempo Bajo (TL)</td><td>${formatoTiempo(tLow, unidad)}</td></tr>`;
        resultadoHTML += `<tr><td>Frecuencia</td><td>${formatoNumero(freq)} Hz</td></tr>`;
    }

    document.getElementById("resultado-table").innerHTML = resultadoHTML;
}

function obtenerValor(id) {
    return parseFloat(document.getElementById(id).value) || 0;
}

function obtenerUnidad(id) {
    return parseFloat(document.getElementById(id).value) || 1;
}

function formatoNumero(num) {
    return num.toFixed(6).replace(/\.?0+$/, "");
}

function formatoTiempo(valor, unidad) {
    return unidad === "ms" ? formatoNumero(valor * 1000) + " ms" : formatoNumero(valor) + " s";
}
