function calcularNotas() {
    ocultarResultado(); // Clears previous results
    OcultarAprovado();

    // Converts form values to points, then to numbers
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
        ExibirErro('Please enter valid values.');
        document.getElementById('resultado').innerText = '';
        return;
    }

    var resultado = (nota1 * 3 + nota2 * 3 + nota3 * 4) / 10;

    var status = resultado >= 6 ? 'Passed!' : 'Failed.';
    var statusClass = resultado >= 6 ? 'aprovado' : 'reprovado';

    if (resultado >= 6 && !AprovadoBool) {
        Aprovado();
    } else if (resultado < 6 && AprovadoBool) {
        OcultarAprovado();
    }

    document.getElementById('resultado').innerText = `Result: ${resultado
        .toFixed(2)
        .replace(',', '.')}\n${status}`;
    document.getElementById('resultado').className = 'resultado ' + statusClass;
}

function LimitarNumeros(campo, maxDigitos, MaxDecimais) {
    let valor = campo.value;

    valor = valor.replace(',', '.');

    // Checks whether the value already contains a decimal point
    let partes = valor.split('.');
    if (partes.length > 2) {
        // If there is more than one decimal point, remove the extras
        valor = partes.shift() + '.' + partes.join('');
        campo.value = valor;
    }

    // Limits the number of decimal digits
    if (partes[1] && partes[1].length > MaxDecimais) {
        partes[1] = partes[1].slice(0, MaxDecimais);
        valor = partes.join('.');
        campo.value = valor;
    }

    // Limits the total length of the value (counting the decimal point)
    if (valor.length > maxDigitos) {
        campo.value = valor.slice(0, maxDigitos);
    }
}

function validarvalorMaximo(campo, maxvalor) {
    let valor = parseFloat(campo.value.replace(',', '.'));
    if (valor < 0) {
        campo.value = '';
        ExibirErro('Grade cannot be negative. Corrected to 0.');
    } else if (valor > maxvalor) {
        campo.value = maxvalor;
        ExibirErro(`Grades higher than ${maxvalor} are not allowed!!!`);
    } else {
        document.getElementById('erro').innerText = '';
        OcultarErro();
    }
}

function CheckChar(e) {
    const char = e.key;

    // Allows only digits
    if (/[\d]/.test(char)) {
        return true; // Accepts digits
    }

    // Allows a comma or period only if the input already contains a digit
    const input = e.target.value;
    if (
        (char === ',' || char === '.') &&
        input.length > 0 &&
        /\d/.test(input)
    ) {
        return true; // Accepts comma or period if a digit is already present
    }

    // Prevents entering any other character
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

    // Automatically hides the error after 5 seconds
    setTimeout(() => {
        OcultarErro();
        erroBloqueado = false; // Releases the function
    }, 5000); // 5000 ms = 5 seconds
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