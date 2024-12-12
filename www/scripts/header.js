document.addEventListener('DOMContentLoaded', function() {
    // Função para obter o valor de um cookie
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Verifica se o usuário está logado
    const isLoggedIn = getCookie('isLoggedInFrontend');

    if (isLoggedIn === 'true') {
        document.getElementById('menuPerfil').style.display = 'block';
        document.getElementById('menuLogin').style.display = 'none';
    } else {
        document.getElementById('menuPerfil').style.display = 'none';
        document.getElementById('menuLogin').style.display = 'block';
    }
});