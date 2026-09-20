function calcularNotas() {
    ocultarResultado(); // Limpa resultados anteriores
    OcultarAprovado();

    // Converte valores do formulário para pontos e depois para números
    var nota1 = parseFloat(
        document.getElementById('nota1').value.replace(',', '.')
    );
    var nota2 = parseFloat(
        document.getElementById('nota2').value.replace(',', '.')
    );
    var nota3 = parseFloat(
        document.getElementById('nota3').value.replace(',', '.')
    );

    if (isNaN(nota1) || isNaN(nota2) || isNaN(nota3)) {
        ExibirErro('Por favor, insira valores válidos.');
        document.getElementById('resultado').innerText = '';
        return;
    }

    var resultado = (nota1 * 3 + nota2 * 3 + nota3 * 4) / 10;

    var status = resultado >= 6 ? 'Aprovado!' : 'Reprovado.';
    var statusClass = resultado >= 6 ? 'aprovado' : 'reprovado';

    if (resultado >= 6 && !AprovadoBool) {
        Aprovado();
    } else if (resultado < 6 && AprovadoBool) {
        OcultarAprovado();
    }

    document.getElementById('resultado').innerText = `Resultado: ${resultado
        .toFixed(2)
        .replace(',', '.')}\n${status}`;
    document.getElementById('resultado').className = 'resultado ' + statusClass;
}

function LimitarNumeros(campo, maxDigitos, MaxDecimais) {
    let valor = campo.value;

    valor = valor.replace(',', '.');

    // Verifica se o valor já contém um ponto decimal
    let partes = valor.split('.');
    if (partes.length > 2) {
        // Se houver mais de um ponto decimal, remova os extras
        valor = partes.shift() + '.' + partes.join('');
        campo.value = valor;
    }

    // Limita o número de dígitos decimais a 1
    if (partes[1] && partes[1].length > MaxDecimais) {
        partes[1] = partes[1].slice(0, MaxDecimais);
        valor = partes.join('.');
        campo.value = valor;
    }

    // Limita o comprimento total do valor (contando ponto decimal)
    if (valor.length > maxDigitos) {
        campo.value = valor.slice(0, maxDigitos);
    }
}

function validarvalorMaximo(campo, maxvalor) {
    let valor = parseFloat(campo.value.replace(',', '.'));
    if (valor < 0) {
        campo.value = '';
        ExibirErro('Nota não pode ser negativa. Corrigida para 0.');
    } else if (valor > maxvalor) {
        campo.value = maxvalor;
        ExibirErro(`Não é possivel colocar notas maiores que ${maxvalor}!!!`);
    } else {
        document.getElementById('erro').innerText = '';
        OcultarErro();
    }
}

function CheckChar(e) {
    const char = e.key;

    // Permite apenas números
    if (/[\d]/.test(char)) {
        return true; // Aceita números
    }

    // Permite a vírgula ou ponto apenas se o input já contém um número
    const input = e.target.value;
    if (
        (char === ',' || char === '.') &&
        input.length > 0 &&
        /\d/.test(input)
    ) {
        return true; // Aceita vírgula ou ponto se já houver um número
    }

    // Previne a entrada de qualquer outro caractere
    e.preventDefault();
    return false;
}

let AprovadoBool = false;

function Aprovado() {
    AprovadoBool = true;

    const inputs = document.querySelectorAll('input');

    inputs.forEach((input) => input.classList.add('green'));
    document.querySelector('.container').classList.add('green');
    document.querySelector('button').classList.add('green');

    /*setTimeout(() => {
                            AprovadoBool = false;
                            OcultarAprovado();
                        }, 5000); */
}

function OcultarAprovado() {
    const inputs = document.querySelectorAll('input');

    inputs.forEach((input) => input.classList.remove('green'));
    document.querySelector('.container').classList.remove('green');
    document.querySelector('button').classList.remove('green');

    AprovadoBool = false;
}

function ocultarResultado() {
    document.getElementById('resultado').innerText = '';
    document.getElementById('resultado').className = 'resultado';
}

let erroBloqueado = false;

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

    // Ocultar erro automaticamente após 5 segundos
    setTimeout(() => {
        OcultarErro();
        erroBloqueado = false; // Libera a função
    }, 5000); // 5000 ms = 5 segundos
}

function OcultarErro(mensagem) {
    document.querySelector('button').disabled = false;
    var inputs = document.querySelectorAll('input');
    inputs.forEach((input) => input.classList.remove('red'));
    document.querySelector('.container').classList.remove('red');
    document.querySelector('button').classList.remove('red');

    document.getElementById('erro').innerText = '';
    erroBloqueado = false;
}
