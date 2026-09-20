const PERIODOS_POR_DIA = {
    0: 0,  // Domingo - não letivo
    1: 5,  // Segunda
    2: 5,  // Terça
    3: 5,  // Quarta
    4: 5,  // Quinta
    5: 10, // Sexta - turno inverso
    6: 0,  // Sábado - não letivo
};

const LIMITE_DIAS_SIMULACAO = 365; // proteção contra loop infinito

// Alvo Móvel: calcula quantos períodos e dias são necessários para atingir o percentual mínimo de presença
function calcularPeriodosParaRecuperar(
    totalAulasAtual,
    presencasAtual,
    percentualMinimo,
    diaSemanaAtual = new Date().getDay()
) {
    let total = totalAulasAtual;
    let presencas = presencasAtual;
    let periodosAcumulados = 0;
    let dia = diaSemanaAtual;
    let diasSimulados = 0;

    // Se já está aprovado, não precisa simular nada
    if (total > 0 && (presencas / total) * 100 >= percentualMinimo) {
        return {
            jaAprovado: true,
            periodosNecessarios: 0,
            diasNecessarios: 0,
            totalFinal: total,
            presencasFinal: presencas,
            percentualFinal: (presencas / total) * 100,
        };
    }

    while (
        total === 0 ||
        (presencas / total) * 100 < percentualMinimo
    ) {
        if (diasSimulados >= LIMITE_DIAS_SIMULACAO) {
            // Meta inatingível dentro do limite de segurança
            return {
                jaAprovado: false,
                inatingivel: true,
                periodosNecessarios: periodosAcumulados,
                diasNecessarios: diasSimulados,
                totalFinal: total,
                presencasFinal: presencas,
                percentualFinal: total > 0 ? (presencas / total) * 100 : 0,
            };
        }

        dia = (dia + 1) % 7; // avança para o próximo dia da semana
        const periodosDoDia = PERIODOS_POR_DIA[dia] ?? 0;

        if (periodosDoDia > 0) {
            total += periodosDoDia;
            presencas += periodosDoDia; // assume presença integral daqui pra frente
            periodosAcumulados += periodosDoDia;
        }

        diasSimulados++;
    }

    return {
        jaAprovado: false,
        inatingivel: false,
        periodosNecessarios: periodosAcumulados,
        diasNecessarios: diasSimulados,
        totalFinal: total,
        presencasFinal: presencas,
        percentualFinal: (presencas / total) * 100,
    };
}

// ======================================================
// MAIN FUNCTION
// ======================================================
function calcular() {
    const totalAulas = parseInt(document.getElementById('total-aulas').value, 10);
    const presencas = parseInt(document.getElementById('presencas').value, 10);
    const percentualMinimo = parseFloat(document.getElementById('percentual-minimo').value.replace(',', '.'));

    OcultarAprovado();
    OcultarInatingivel(); // clear the "unreachable" state before recalculating

    if (
        isNaN(totalAulas) || isNaN(presencas) || isNaN(percentualMinimo) ||
        totalAulas <= 0 || presencas < 0 || percentualMinimo <= 0 || percentualMinimo > 100
    ) {
        ExibirErro('Please enter valid values.');
        document.getElementById('resultado').innerText = '';
        return;
    }

    const percentualPresenca = totalAulas > 0 ? (presencas / totalAulas) * 100 : 0;
    const aprovado = percentualPresenca >= percentualMinimo;

    const resultadoDiv = document.getElementById('resultado');
    let htmlResultado = `<p><strong>Attendance:</strong> ${percentualPresenca.toFixed(2)}%</p>`;

    if (!aprovado) {
        const simulacao = calcularPeriodosParaRecuperar(totalAulas, presencas, percentualMinimo);

        if (simulacao.inatingivel) {
            htmlResultado += `<p id="Small"><strong>Warning:</strong> it is not possible to reach ${percentualMinimo}% within the simulated period.</p>`;
            MostrarInatingivel(); // activates the persistent red state (no timeout)
        } else {
            htmlResultado +=
                `<p id="Small"><strong>Periods needed:</strong> ${simulacao.periodosNecessarios}</p>` +
                `<p id="Small"><strong>Days needed:</strong> ${simulacao.diasNecessarios}</p>`;
        }
    }

    resultadoDiv.innerHTML = htmlResultado;
    resultadoDiv.className = 'resultado ' + (aprovado ? 'aprovado' : 'reprovado');

    if (aprovado) {
        Aprovado();
    }

    document.getElementById('erro').innerText = '';
}

let AprovadoBool = false;

function Aprovado() {
    AprovadoBool = true;
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => input.classList.add('green'));
    document.querySelector('.container').classList.add('green');
    document.querySelector('button').classList.add('green');
}

function OcultarAprovado() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => input.classList.remove('green'));
    document.querySelector('.container').classList.remove('green');
    document.querySelector('button').classList.remove('green');
    AprovadoBool = false;
}

function MostrarInatingivel() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => input.classList.add('inatingivel'));
    document.querySelector('.container').classList.add('inatingivel');
    document.querySelector('button').classList.add('inatingivel');
}

function OcultarInatingivel() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => input.classList.remove('inatingivel'));
    document.querySelector('.container').classList.remove('inatingivel');
    document.querySelector('button').classList.remove('inatingivel');
}

function ExibirErro(mensagem) {
    if (erroBloqueado) return;
    erroBloqueado = true;
    document.querySelector('button').disabled = true;
    const erroElement = document.getElementById('erro');
    erroElement.innerText = mensagem || '';
    erroElement.classList.add('erro');

    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => input.classList.add('red'));
    document.querySelector('.container').classList.add('red');
    document.querySelector('button').classList.add('red');

    setTimeout(() => {
        OcultarErro();
        erroBloqueado = false;
    }, 5000);
}

function OcultarErro() {
    document.querySelector('button').disabled = false;
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => input.classList.remove('red'));
    document.querySelector('.container').classList.remove('red');
    document.querySelector('button').classList.remove('red');
    document.getElementById('erro').innerText = '';
}

function OcultarResultado() {
    document.getElementById('resultado').innerText = '';
}

// Funções de validação
const maxvalor = 100;
const maxDigitos = 5;
const maxDecimais = 2;
let erroBloqueado = false;

function validarNumerosInteiros(campo) {
    OcultarInatingivel();
    OcultarAprovado();
    campo.value = campo.value.replace(/[^0-9]/g, '');
}

function LimitarNumeros(campo) {
    OcultarInatingivel();
    OcultarAprovado();
    let valor = campo.value.replace(',', '.');
    let partes = valor.split('.');
    if (partes.length > 2) {
        valor = partes.shift() + '.' + partes.join('');
        campo.value = valor;
    }
    if (partes[1] && partes[1].length > maxDecimais) {
        partes[1] = partes[1].slice(0, maxDecimais);
        valor = partes.join('.');
        campo.value = valor;
    }
    if (valor.length > maxDigitos) {
        campo.value = valor.slice(0, maxDigitos);
    }
}

function validarvalorMaximo(campo) {
    let valor = parseFloat(campo.value.replace(',', '.'));
    if (valor < 0) {
        campo.value = '';
        ExibirErro('Attendance cannot be negative. Corrected to 0.');
    } else if (valor > maxvalor) {
        campo.value = maxvalor;
        ExibirErro(
            `Attendance corrected to the maximum allowed value of ${maxvalor}.`
        );
    } else {
        OcultarErro();
    }
}

function CheckChar(e) {
    const char = e.key;
    if (/[\d,.]/.test(char)) {
        return true;
    } else {
        e.preventDefault();
        return false;
    }
}

function atualizarPresencas() {
    validarPresencas();
}

function validarPresencas() {
    const totalAulas = parseInt(
        document.getElementById('total-aulas').value,
        10
    );
    const presencas = parseInt(document.getElementById('presencas').value, 10);
    if (!isNaN(totalAulas) && !isNaN(presencas) && presencas > totalAulas) {
        ExibirErro(
            'The number of classes attended cannot be greater than the total number of classes.'
        );
        document.getElementById('presencas').value = totalAulas;
    } else {
        document.getElementById('erro').innerText = '';
        OcultarErro();
    }
}