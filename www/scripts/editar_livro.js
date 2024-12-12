document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('formEditarLivro');
    const bookId = window.location.pathname.split('/').pop(); // Assume que o ID do livro está na URL

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        console.log('Formulário enviado');
        console.log(form);

        const formData = new FormData(form);

        console.log(formData.get('title'));

        // Cria uma nova solicitação AJAX
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', `/editar_livro/${bookId}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        // Define a função de callback para lidar com a resposta do servidor
        xhr.onload = function() {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                if (data.success) {
                    alert('Livro atualizado com sucesso');
                    window.location.href = `/detalhes/${bookId}`;
                } else {
                    alert('Erro ao atualizar livro');
                }
            } else if (xhr.status === 401) {
                const data = JSON.parse(xhr.responseText);
                alert(data.message);
            } else {
                alert('Erro ao enviar dados do livro');
            }
        };

        // Envia os dados do formulário como uma string JSON
        xhr.send(JSON.stringify({
            title: formData.get('title'),
        }));
    }
    );
});