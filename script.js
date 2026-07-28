// Aguarda o documento HTML estar totalmente pronto
document.addEventListener("DOMContentLoaded", function() {

    // Procura o botão hambúrguer pelo seletor de classe
    const menuToggle = document.querySelector('.menu-toggle');
    // Procura o header pelo seletor de classe
    const header = document.querySelector('.topbar');

    // Verifica se os elementos foram encontrados antes de adicionar o evento
    if (menuToggle && header) {

        menuToggle.addEventListener('click', function() {
            // Alterna a classe 'active' no header (abre/fecha menu mobile)
            header.classList.toggle('active');

            // Opcional: Log no console para depuração (pressione F12 no navegador)
            console.log("Menu clicado! Classe active: " + header.classList.contains('active'));
        });

    } else {
        console.error("Erro: Não encontrei os elementos '.menu-toggle' ou '.topbar'. Verifique se o nome das classes no HTML é exatamente esse.");
    }

    // ===== Header só aparece bem no topo da página, some assim que rolar pra baixo =====
    if (header) {

        function atualizarHeader() {
            if (window.pageYOffset <= 0) {
                // Está no topo absoluto da página -> mostra o header
                header.classList.remove('header--hidden');
            } else {
                // Rolou pra baixo, mesmo que pouco -> esconde o header
                header.classList.add('header--hidden');
            }
        }

        window.addEventListener('scroll', atualizarHeader, { passive: true });
        atualizarHeader(); // roda uma vez ao carregar a página
    }

});