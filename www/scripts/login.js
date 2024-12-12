document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('formLogin').addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Coleta os dados do formulário
        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        // Cria uma nova solicitação AJAX
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/login', true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        // Define a função de callback para lidar com a resposta do servidor
        xhr.onload = function() {
            if (xhr.status === 200) {
                alert('Login bem-sucedido!');
                window.location.href = '/'; 
            } else {
                alert('Erro no login: ' + xhr.responseText);
            }
        };

        // Envia os dados do formulário como uma string JSON
        xhr.send(JSON.stringify(formData));
    });
});