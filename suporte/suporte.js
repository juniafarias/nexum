/*FUNÇÕES DE AUXÍLIO (MENSAGENS DE ERRO)*/

// Exibe uma mensagem de erro visual em um campo específico do formulário
function mostrarErro(idCampo, mensagem) {
    // Busca o elemento do campo (input/select/textarea) pelo id informado
    const campo = document.getElementById(idCampo);
    // Busca o <span> que exibirá o texto do erro, seguindo o padrão de id "error-<idCampo>"
    const spanErro = document.getElementById(`error-${idCampo}`);

    // Se o campo existir na página...
    if (campo) {
        campo.classList.add("invalid"); // Estilo CSS de borda vermelha
    }
    // Se o span de erro existir na página...
    if (spanErro) {
        spanErro.textContent = mensagem; // Texto explicativo do erro
    }
}

// Remove todos os erros visuais e limpa as mensagens antes de uma nova validação
function limparErros() {
    // Reseta todos os campos para o estado visual padrão
    // Para cada elemento com classe "error-message", apaga o texto exibido
    document.querySelectorAll(".error-message").forEach(s => s.textContent = "");
    // Para cada input, select ou textarea, remove a classe "invalid" (borda vermelha)
    document.querySelectorAll("input, select, textarea").forEach(i => i.classList.remove("invalid"));
}

/*VALIDADORES ESPECÍFICOS*/

/* Mesma validação de nome completo usada no formulário de cadastro:
   exige nome e sobrenome, apenas letras/acentos, aceita hífen e apóstrofo */
// Valida se o nome digitado é um nome completo válido
function validarNomeReal(nome) {
    // Expressão regular: exige ao menos duas palavras (nome + sobrenome), só letras/acentos, aceitando hífen e apóstrofo
    const regexNome = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(['-][A-Za-zÀ-ÖØ-öø-ÿ]+)*(\s[A-Za-zÀ-ÖØ-öø-ÿ]+(['-][A-Za-zÀ-ÖØ-öø-ÿ]+)*)+$/;
    // Testa o valor (sem espaços nas pontas); retorna true se válido, ou a mensagem de erro se inválido
    return regexNome.test(nome.trim())
        ? true
        : "Digite seu nome completo (nome e sobrenome, apenas letras).";
}

/* Mesma validação de e-mail usada no formulário de cadastro:
   estrutura básica + bloqueio de domínios descartáveis */
// Valida se o e-mail digitado tem formato correto e não é de um provedor descartável
function validarEmailReal(email) {
    // Remove espaços nas pontas e converte tudo para minúsculas
    const valor = email.trim().toLowerCase();
    // Expressão regular com a estrutura básica de um e-mail (usuário@dominio.extensão)
    const regexEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    // Conjunto (Set) com domínios de e-mail temporários/descartáveis conhecidos
    const descartaveis = new Set([
        'mailinator.com', '10minutemail.com', 'yopmail.com',
        'tempmail.com', 'guerrillamail.com', 'trashmail.com'
    ]);

    // Extrai o domínio do e-mail (o que vem depois do "@"); usa string vazia se não houver "@"
    const dominio = valor.split('@')[1] || '';
    // Verifica: formato bate com o regex, não tem pontos duplos seguidos, e não excede o tamanho máximo de e-mail
    const formatoOk = regexEmail.test(valor) && !valor.includes('..') && valor.length <= 254;
    // Verifica se o domínio está na lista de descartáveis
    const ehDescartavel = descartaveis.has(dominio);

    // Se for um domínio descartável, retorna mensagem específica de erro
    if (ehDescartavel) return "E-mails temporários/descartáveis não são aceitos.";
    // Caso contrário, retorna true se o formato estiver ok, ou a mensagem padrão de erro
    return formatoOk ? true : "Digite um e-mail válido, exemplo: nome@dominio.com";
}

// Valida o campo de telefone/celular, garantindo que tenha números suficientes
function validarApenasNumeros(valor) {
    // Se o campo estiver vazio (só espaços), retorna erro de campo obrigatório
    if (!valor.trim()) return "Este campo é obrigatório.";
    // Remove tudo que não for dígito (parênteses, traços, espaços etc.)
    const limpo = valor.replace(/\D/g, "");
    // Se sobrarem menos de 10 dígitos, o número é considerado muito curto
    if (limpo.length < 10) return "Número muito curto.";
    // Caso contrário, o número é válido
    return true;
}

/*LÓGICA DO POP-UP (MODAL)*/

// Referência ao elemento do pop-up de sucesso
const popup = document.getElementById("success-popup");
// Referência ao botão que fecha o pop-up
const closePopup = document.getElementById("close-popup");

// Abre o pop-up de sucesso adicionando a classe "active" (que o CSS usa para exibi-lo)
function openModal() {
    // Só tenta abrir se o elemento popup realmente existir na página
    if (popup) popup.classList.add("active");
}

// Se o botão de fechar existir na página...
if (closePopup) {
    // Adiciona um evento de clique que remove a classe "active", escondendo o pop-up
    closePopup.addEventListener("click", () => {
        popup.classList.remove("active");
    });
}

// Se o popup existir na página...
if (popup) {
    // Adiciona um evento de clique no overlay (fundo escurecido)
    popup.addEventListener("click", (e) => {
        // Se o clique foi exatamente no fundo (fora da caixa de conteúdo)...
        if (e.target === popup) {
            // ...fecha o pop-up, removendo a classe "active"
            popup.classList.remove("active");
        }
    });
}

/*LÓGICA DE SUBMISSÃO E VALIDAÇÃO FINAL*/

// Referência ao formulário de suporte
const form = document.getElementById("suporteForm");

// Se o formulário existir na página...
if (form) {
    // Escuta o evento de envio (submit) do formulário
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Impede o envio real para validar primeiro
        // Limpa quaisquer erros exibidos de uma tentativa anterior
        limparErros();
        // Flag que indica se algum erro foi encontrado durante a validação
        let temErro = false;

        // 1. Validação de Nome
        // Pega o valor digitado no campo de nome
        const nomeVal = document.getElementById("nome").value;
        // Executa a validação do nome
        const resNome = validarNomeReal(nomeVal);
        // Se o resultado não for "true" (ou seja, é uma mensagem de erro), exibe o erro e marca a flag
        if (resNome !== true) { mostrarErro("nome", resNome); temErro = true; }

        // 2. Validação de E-mail
        // Pega o valor digitado no campo de e-mail
        const emailVal = document.getElementById("email").value;
        // Executa a validação do e-mail
        const resEmail = validarEmailReal(emailVal);
        // Se inválido, exibe o erro correspondente e marca a flag
        if (resEmail !== true) { mostrarErro("email", resEmail); temErro = true; }

        // 3. Validação de Telefone
        // Pega o valor digitado no campo de número/telefone
        const numVal = document.getElementById("numero").value;
        // Executa a validação do telefone
        const resNum = validarApenasNumeros(numVal);
        // Se inválido, exibe o erro correspondente e marca a flag
        if (resNum !== true) { mostrarErro("numero", resNum); temErro = true; }

        // 4. Validação de Assunto
        // Pega o valor selecionado no campo de assunto
        const assuntoVal = document.getElementById("assunto").value;
        // Se nenhum assunto foi selecionado (valor vazio), exibe erro e marca a flag
        if (!assuntoVal) { mostrarErro("assunto", "Selecione um assunto."); temErro = true; }

        // 5. Validação da Mensagem
        // Pega o valor digitado na área de mensagem
        const msgVal = document.getElementById("msg").value;
        // Se a mensagem (sem espaços nas pontas) tiver menos de 10 caracteres, exibe erro e marca a flag
        if (msgVal.trim().length < 10) { mostrarErro("msg", "Mensagem muito curta (mín. 10 letras)."); temErro = true; }

        // Resposta Final
        // Se nenhum erro foi encontrado em todas as validações acima...
        if (!temErro) {
            // ...abre o pop-up de sucesso...
            openModal();
            // ...e reseta o formulário, limpando todos os campos
            form.reset();
        }
    });
}