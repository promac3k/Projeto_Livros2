document.addEventListener('DOMContentLoaded', function() {
    // Atualiza o campo de telefone com o código do país selecionado
    const countrySelect = document.getElementById('country');
    const countryCodeInput = document.getElementById('countryCode');
    const phoneInput = document.getElementById('phone');

    countrySelect.addEventListener('change', function() {
        const selectedOption = countrySelect.options[countrySelect.selectedIndex];
        const countryCode = selectedOption.getAttribute('data-code');
        countryCodeInput.value = countryCode ? countryCode : '';
        phoneInput.focus();
    });

    // Limita o número de dígitos no campo de telefone
    phoneInput.addEventListener('input', function() {
        const maxLength = 9; // Limite de 9 caracteres para o número de telefone
        if (phoneInput.value.length > maxLength) {
            phoneInput.value = phoneInput.value.slice(0, maxLength);
        }
    });

    // Envia uma solicitação AJAX para registrar um novo usuário
    document.getElementById('formRegistro').addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const country = document.getElementById('country').value;
        const phone = document.getElementById('phone').value;
        const countryCode = document.getElementById('countryCode').value;
        const birthdate = document.getElementById('birthdate').value;

        console.log(countryCode + " " + phone);
        
        // Coleta os dados do formulário
        const formData = {
            name: name,
            email: email,
            password: password,
            country: country,
            phone: countryCode + " " + phone,
            birthdate: birthdate
        };

        // Cria uma nova solicitação AJAX
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/register', true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        // Define a função de callback para lidar com a resposta do servidor
        xhr.onload = function() {
            if (xhr.status === 200) {
                alert('Registro bem-sucedido!');
                window.location.href = '/';
            } else {
                alert('Erro no registro: ' + xhr.responseText);
            }
        };
        // Envia os dados do formulário como uma string JSON
        xhr.send(JSON.stringify(formData));
    });
});