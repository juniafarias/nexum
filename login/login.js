/* =========================================================
   SELEÇÃO DE ELEMENTOS
   Aqui guardamos, em variáveis, referências para os elementos
   do HTML que vamos precisar ler ou alterar depois.
   ========================================================= */
const form = document.getElementById("loginForm");        // o formulário inteiro
const emailInput = document.getElementById("email");        // campo de email
const senhaInput = document.getElementById("senha");        // campo de senha
const botaoEntrar = document.getElementById("botaoEntrar"); // botão "Entrar"

const errorEmail = document.getElementById("error-email");  // <span> de erro do email
const errorSenha = document.getElementById("error-senha");  // <span> de erro da senha

const card = document.querySelector(".card"); // o cartão inteiro (usado para o efeito de "shake")

/* =========================================================
   MOSTRAR / ESCONDER SENHA
   Mesmo comportamento usado na tela de cadastro: clicar no
   ícone de olho alterna entre texto visível e escondido.
   ========================================================= */
document.querySelectorAll(".toggle-password").forEach((icon) => {
  // Para cada ícone de "olho" encontrado na página (aqui só existe um: o da senha)
  icon.addEventListener("click", function () {
    // Pega o input relacionado a este ícone através do atributo data-target
    const target = document.getElementById(this.dataset.target);

    if (target.type === "password") {
      // Se a senha está escondida, revela o texto...
      target.type = "text";
      // ...e troca o ícone de "olho aberto" para "olho riscado"
      this.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      // Caso contrário, volta a esconder a senha...
      target.type = "password";
      // ...e troca o ícone de volta para "olho aberto"
      this.classList.replace("fa-eye-slash", "fa-eye");
    }
  });
});

/* =========================================================
   FUNÇÃO AUXILIAR: setFieldState
   Aplica a cor de borda (verde/vermelha) e escreve a mensagem
   de erro apenas para o e-mail. Para a senha, o estado visual
   em tempo real é ignorado conforme solicitado.
   ========================================================= */
function setFieldState(input, errorSpan, valido, mensagem) {
  if (input.value === "") {
    input.classList.remove("input-invalid", "input-valid");
    if (errorSpan) errorSpan.textContent = "";
    return;
  }

  if (valido) {
    input.classList.remove("input-invalid");
    input.classList.add("input-valid");
    if (errorSpan) errorSpan.textContent = "";
  } else {
    input.classList.remove("input-valid");
    input.classList.add("input-invalid");
    if (errorSpan) errorSpan.textContent = mensagem;
  }
}

/* =========================================================
   VALIDAÇÃO: EMAIL
   Regra idêntica à usada na tela de cadastro, garantindo que
   o email tenha um formato válido (usuario@dominio.tld).
   ========================================================= */
function validarEmail() {
  // Remove espaços nas pontas e converte para minúsculas antes de validar
  const email = emailInput.value.trim().toLowerCase();

  // Expressão regular: exige "algo@algo.algo", com o final (TLD) tendo pelo menos 2 letras
  const regexEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  // Verifica o formato e também impede pontos duplos ("..") e emails absurdamente longos
  const valido = regexEmail.test(email) && !email.includes('..') && email.length <= 254;

  // Aplica o resultado visualmente no campo de email
  setFieldState(
    emailInput,
    errorEmail,
    valido,
    "Digite um e-mail válido, exemplo: nome@dominio.com"
  );

  return valido; // devolve true/false para quem chamou a função
}

/* =========================================================
   VALIDAÇÃO: SENHA (Lógica interna mantida para checagem)
   Verifica os critérios de força sem alterar a cor da borda 
   do input e sem exibir mensagem de erro abaixo dele.
   ========================================================= */
function validarSenhaLogica() {
  const senha = senhaInput.value;

  const temTamanhoMinimo = senha.length >= 8;
  const temMaiuscula = /[A-Z]/.test(senha);
  const temMinuscula = /[a-z]/.test(senha);
  const temNumero = /[0-9]/.test(senha);
  const temEspecial = /[\W_]/.test(senha);

  return temTamanhoMinimo && temMaiuscula && temMinuscula && temNumero && temEspecial;
}

/* =========================================================
   VALIDAÇÃO GERAL DO FORMULÁRIO E CONTROLE DO BOTÃO "ENTRAR"
   Agora o botão só é ativado se o e-mail for válido E 
   a senha estiver preenchida (mesmo que fora do validador de força).
   ========================================================= */
function validarFormulario() {
  const emailOk = validarEmail();
  const senhaPreenchida = senhaInput.value !== "";
  
  // O botão libera se o email for válido e a senha não estiver vazia
  const liberarBotao = emailOk && senhaPreenchida;

  if (liberarBotao) {
    botaoEntrar.classList.add("valid-btn");
  } else {
    botaoEntrar.classList.remove("valid-btn");
  }

  return liberarBotao;
}

/* =========================================================
   EVENTOS DE INPUT (validação em tempo real e controle do botão)
   ========================================================= */
emailInput.addEventListener("input", validarFormulario);

senhaInput.addEventListener("input", function() {
  if (senhaInput.value === "") {
    senhaInput.classList.remove("input-invalid", "input-valid");
    errorSenha.textContent = "";
  }
  validarFormulario();
});

/* =========================================================
   SUBMISSÃO DO FORMULÁRIO
   ========================================================= */
form.addEventListener("submit", function (e) {
  // Impede o comportamento padrão do navegador (recarregar a página)
  e.preventDefault();

  // Se o botão não estiver liberado (campos vazios/incompletos), bloqueia o envio e exibe o tooltip explicativo
  if (!botaoEntrar.classList.contains("valid-btn")) {
    if (botaoTooltip) {
      botaoTooltip.textContent = "Você precisa preencher os campos acima corretamente para conseguir entrar.";
      botaoTooltip.classList.add("show");
    }
    return;
  }

  // Verifica se a senha atende aos critérios complexos do validador
  const emailOk = validarEmail();
  const senhaForteOk = validarSenhaLogica();
  const tudoPerfeito = emailOk && senhaForteOk;

  if (!tudoPerfeito) {
    // Se o email está ok mas a senha não passou no validador (ou vice-versa), 
    // chacoalha o card e mostra o pop-up de dados incorretos
    card.classList.remove("shake"); 
    void card.offsetWidth;          
    card.classList.add("shake");

    const popupMensagem = document.getElementById("popup-mensagem");
    const popupTitle = document.getElementById("popup-title");
    const popupIcon = document.getElementById("popup-icon");

    if (popupTitle) popupTitle.textContent = "Dados incorretos";
    if (popupMensagem) popupMensagem.textContent = "Senha ou email incorreto, verifique se os dados estão corretos de acordo com os dados fornecidos no cadastro.";
    if (popupIcon) {
      popupIcon.className = "fa-solid fa-triangle-exclamation";
      popupIcon.style.color = "#e74c3c"; // cor vermelha para alerta
    }

    document.getElementById("custom-popup").style.display = "flex";
    return; // interrompe aqui
  }

  // Se passou em todas as validações com sucesso perfeito
  const popupMensagem = document.getElementById("popup-mensagem");
  const popupTitle = document.getElementById("popup-title");
  const popupIcon = document.getElementById("popup-icon");

  if (popupTitle) popupTitle.textContent = "Login realizado com sucesso!";
  if (popupMensagem) popupMensagem.textContent = "Bem-vindo de volta à Nexum.";
  if (popupIcon) {
    popupIcon.className = "fa-solid fa-circle-check";
    popupIcon.style.color = "#2ecc71"; // cor verde para sucesso
  }

  document.getElementById("custom-popup").style.display = "flex";

  // Limpa o formulário e o estado visual dos campos
  form.reset();
  emailInput.classList.remove("input-valid", "input-invalid");
  senhaInput.classList.remove("input-valid", "input-invalid");
  botaoEntrar.classList.remove("valid-btn");
});

/* =========================================================
   TOOLTIP DO BOTÃO "ENTRAR"
   Mostra o aviso logo abaixo do botão ao passar o cursor ou tentar 
   clicar enquanto os campos estiverem vazios ou incompletos
   ========================================================= */
const botaoTooltip = document.getElementById("botaoTooltip");

if (botaoTooltip) {
  botaoEntrar.addEventListener("mouseenter", function () {
    if (!botaoEntrar.classList.contains("valid-btn")) {
      botaoTooltip.textContent = "Você precisa preencher os campos acima corretamente para conseguir entrar.";
      botaoTooltip.classList.add("show");
    }
  });

  botaoEntrar.addEventListener("mouseleave", function () {
    botaoTooltip.classList.remove("show");
  });
}

/* =========================================================
   FUNÇÕES DO POP-UP
   ========================================================= */

// Fecha o pop-up (chamada pelo botão "Ok" no HTML via onclick)
function closePopup() {
  document.getElementById("custom-popup").style.display = "none";
}

// Fecha o pop-up também se o usuário clicar fora da caixinha (no fundo escurecido)
window.onclick = function (event) {
  const popup = document.getElementById("custom-popup");
  if (event.target === popup) closePopup();
};