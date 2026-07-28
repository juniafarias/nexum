/*SELEÇÃO DE ELEMENTOS*/
const form = document.getElementById("cadastroForm");

const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const confirmarSenhaInput = document.getElementById("confirmarSenha");
const botaoCriar = document.getElementById("botaoCriar");

const errorNome = document.getElementById("error-nome");
const errorEmail = document.getElementById("error-email");
const errorSenha = document.getElementById("error-senha");
const errorConfirmarSenha = document.getElementById("error-confirmarSenha");

/*UPLOAD / PREVIEW DA FOTO*/
const fotoInput = document.getElementById("fotoInput");
const photoCircle = document.getElementById("photoCircle");
const cameraIcon = document.getElementById("cameraIcon");
const photoRemove = document.getElementById("photoRemove");

fotoInput.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    photoCircle.style.backgroundImage = `url('${e.target.result}')`;
    cameraIcon.style.display = "none";
    photoCircle.classList.add("has-image");
  };
  reader.readAsDataURL(file);
});

/*REMOVER FOTO (lixeira dentro do círculo)*/
photoRemove.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  fotoInput.value = "";
  photoCircle.style.backgroundImage = "";
  photoCircle.classList.remove("has-image");
  cameraIcon.style.display = "inline-block";
});

/*MOSTRAR / ESCONDER SENHA*/
document.querySelectorAll(".toggle-password").forEach((icon) => {
  icon.addEventListener("click", function () {
    const target = document.getElementById(this.dataset.target);
    if (target.type === "password") {
      target.type = "text";
      this.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      target.type = "password";
      this.classList.replace("fa-eye-slash", "fa-eye");
    }
  });
});

/*FUNÇÃO AUXILIAR: aplica estado visual de um campo*/
function setFieldState(input, errorSpan, valido, mensagem) {
  if (input.value === "") {
    input.classList.remove("input-invalid", "input-valid");
    errorSpan.textContent = "";
    return;
  }
  if (valido) {
    input.classList.remove("input-invalid");
    input.classList.add("input-valid");
    errorSpan.textContent = "";
  } else {
    input.classList.remove("input-valid");
    input.classList.add("input-invalid");
    errorSpan.textContent = mensagem;
  }
}

/*FORMATA NOME PARA TITLE CASE, RESPEITANDO PREPOSIÇÕES COMUNS EM PT-BR
   Ex: "MARIA DA silva SOUZA" -> "Maria da Silva Souza"
   Também trata nomes com hífen ou apóstrofo, ex: jean-pierre, d'ávila */
function formatarNomeTitleCase(nome) {
  const preposicoes = new Set(["de", "da", "do", "das", "dos", "e"]);

  return nome
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((palavra, index) => {
      if (index > 0 && preposicoes.has(palavra)) {
        return palavra;
      }
      return palavra
        .split(/([-'])/)
        .map((parte) =>
          parte === "-" || parte === "'"
            ? parte
            : parte.charAt(0).toUpperCase() + parte.slice(1)
        )
        .join("");
    })
    .join(" ");
}

/*VALIDAÇÃO: NOME COMPLETO
   Exige pelo menos duas palavras, letras/acentos, aceita hífen e apóstrofo
   (cobre casos como Maria-Clara, D'Ávila, Jean-Pierre, "da Silva" etc.)*/
function validarNome() {
  const regexNome = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(['-][A-Za-zÀ-ÖØ-öø-ÿ]+)*(\s[A-Za-zÀ-ÖØ-öø-ÿ]+(['-][A-Za-zÀ-ÖØ-öø-ÿ]+)*)+$/;
  const valido = regexNome.test(nomeInput.value.trim());
  setFieldState(
    nomeInput,
    errorNome,
    valido,
    "Digite seu nome completo (nome e sobrenome, apenas letras)."
  );
  return valido;
}

/*APLICA O TITLE CASE QUANDO O USUÁRIO SAI DO CAMPO NOME*/
nomeInput.addEventListener("blur", function () {
  if (this.value.trim() !== "") {
    this.value = formatarNomeTitleCase(this.value);
    validarFormulario();
  }
});

/*VALIDAÇÃO: EMAIL */
function validarEmail() {
  const email = emailInput.value.trim().toLowerCase();

  // Estrutura básica + exige TLD com no mínimo 2 letras
  const regexEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  // Domínios descartáveis mais comuns
  const descartaveis = new Set([
    'mailinator.com', '10minutemail.com', 'yopmail.com',
    'tempmail.com', 'guerrillamail.com', 'trashmail.com'
  ]);

  const dominio = email.split('@')[1] || '';
  const formatoOk = regexEmail.test(email) && !email.includes('..') && email.length <= 254;
  const ehDescartavel = descartaveis.has(dominio);
  const valido = formatoOk && !ehDescartavel;

  const mensagem = ehDescartavel
    ? "E-mails temporários/descartáveis não são aceitos."
    : "Digite um e-mail válido, exemplo: nome@dominio.com ou nome@dominio.com.br";

  setFieldState(emailInput, errorEmail, valido, mensagem);
  return valido;
}

/*VALIDAÇÃO: SENHA (com checklist visual)*/
function validarSenha() {
  const senha = senhaInput.value;

  const regras = {
    length: senha.length >= 8,
    upper: /[A-Z]/.test(senha),
    lower: /[a-z]/.test(senha),
    number: /[0-9]/.test(senha),
    special: /[!@#$%&*]/.test(senha),
  };

  // Atualiza visualmente cada item da checklist
  document.getElementById("rule-length").classList.toggle("rule-ok", regras.length);
  document.getElementById("rule-upper").classList.toggle("rule-ok", regras.upper);
  document.getElementById("rule-lower").classList.toggle("rule-ok", regras.lower);
  document.getElementById("rule-number").classList.toggle("rule-ok", regras.number);
  document.getElementById("rule-special").classList.toggle("rule-ok", regras.special);

  const valido = Object.values(regras).every(Boolean);

  setFieldState(
    senhaInput,
    errorSenha,
    valido,
    "A senha não atende a todos os requisitos listados acima."
  );

  return valido;
}

/*VALIDAÇÃO: CONFIRMAR SENHA*/
function validarConfirmarSenha() {
  const valido =
    confirmarSenhaInput.value !== "" &&
    confirmarSenhaInput.value === senhaInput.value;

  setFieldState(
    confirmarSenhaInput,
    errorConfirmarSenha,
    valido,
    "As senhas não coincidem."
  );

  return valido;
}

/*VALIDAÇÃO GERAL DO FORMULÁRIO
   Controla se o botão "Criar conta" fica habilitado*/
function validarFormulario() {
  const nomeOk = validarNome();
  const emailOk = validarEmail();
  const senhaOk = validarSenha();
  const confirmarOk = validarConfirmarSenha();

  const tudoValido = nomeOk && emailOk && senhaOk && confirmarOk;

  if (tudoValido) {
    botaoCriar.classList.add("valid-btn");
  } else {
    botaoCriar.classList.remove("valid-btn");
  }

  return tudoValido;
}

/*EVENTOS DE INPUT (validação em tempo real)*/
nomeInput.addEventListener("input", validarFormulario);
emailInput.addEventListener("input", validarFormulario);
senhaInput.addEventListener("input", () => {
  validarFormulario();
  // Reavalia a confirmação sempre que a senha principal mudar
  if (confirmarSenhaInput.value !== "") validarConfirmarSenha();
});
confirmarSenhaInput.addEventListener("input", validarFormulario);

/*SUBMISSÃO DO FORMULÁRIO*/
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Garante que o nome saia formatado em Title Case mesmo que o
  // evento "blur" não tenha disparado por algum motivo
  if (nomeInput.value.trim() !== "") {
    nomeInput.value = formatarNomeTitleCase(nomeInput.value);
  }

  // Força a exibição de todos os erros, mesmo em campos vazios,
  // caso o usuário tente enviar sem preencher nada.
  if (nomeInput.value === "") errorNome.textContent = "Preencha seu nome completo.";
  if (emailInput.value === "") errorEmail.textContent = "Preencha seu e-mail.";
  if (senhaInput.value === "") errorSenha.textContent = "Crie uma senha.";
  if (confirmarSenhaInput.value === "") errorConfirmarSenha.textContent = "Confirme sua senha.";

  if (!validarFormulario()) return;

  document.getElementById("custom-popup").style.display = "flex";
  form.reset();
  botaoCriar.classList.remove("valid-btn");
  document.querySelectorAll("#rules-list li").forEach((li) => li.classList.remove("rule-ok"));
  photoCircle.style.backgroundImage = "";
  photoCircle.classList.remove("has-image");
  cameraIcon.style.display = "inline-block";
});

/*TOOLTIP DO BOTÃO "CRIAR CONTA"
   Mostra o aviso ao passar o cursor sobre o botão enquanto o
   formulário não estiver totalmente válido (inclusive campos vazios)*/
const botaoTooltip = document.getElementById("botaoTooltip");

botaoCriar.addEventListener("mouseenter", function () {
  if (!botaoCriar.classList.contains("valid-btn")) {
    botaoTooltip.classList.add("show");
  }
});

botaoCriar.addEventListener("mouseleave", function () {
  botaoTooltip.classList.remove("show");
});

function closePopup() {
  document.getElementById("custom-popup").style.display = "none";
}

window.onclick = function (event) {
  const popup = document.getElementById("custom-popup");
  if (event.target === popup) closePopup();
};