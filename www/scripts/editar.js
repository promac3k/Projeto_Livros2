document.addEventListener('DOMContentLoaded', function() {
    const formEditar = document.getElementById('formEditar');
    const countrySelect = document.getElementById('country');
    const countryCodeInput = document.getElementById('countryCode');

    // Atualiza o código do país quando o país é selecionado
    countrySelect.addEventListener('change', function() {
        const selectedOption = countrySelect.options[countrySelect.selectedIndex];
        const countryCode = selectedOption.getAttribute('data-code');
        countryCodeInput.value = countryCode;
    });

    // Define o código do país inicial com base no país selecionado
    const initialCountryCode = countrySelect.options[countrySelect.selectedIndex].getAttribute('data-code');
    countryCodeInput.value = initialCountryCode;

    formEditar.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(formEditar);
        const countryCode = countryCodeInput.value;
        const phone = formData.get('phone');
        const fullPhone = countryCode + ' ' + phone;

        const data = {
            name: formData.get('name'),
            country: formData.get('country'),
            phone: fullPhone,
            birthdate: formData.get('birthdate'),
            oldPassword: formData.get('oldPassword'),
            newPassword: formData.get('newPassword')
        };

        console.log(data);

        // Cria uma nova solicitação AJAX
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', '/editar', true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        // Define a função de callback para lidar com a resposta do servidor
        xhr.onload = function() {
            if (xhr.status === 200) {
                alert('Perfil atualizado com sucesso!');
                window.location.href = '/perfil';
            } else if (xhr.status === 401) {
                const data = JSON.parse(xhr.responseText);
                alert(data.message);
            } else {
                alert('Erro ao enviar classificação');
            }
        };

        // Envia os dados do formulário como uma string JSON
        xhr.send(JSON.stringify(data));
    });
});