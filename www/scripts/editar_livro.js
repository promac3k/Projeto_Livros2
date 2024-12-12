document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('formEditarLivro');
    const bookId = window.location.pathname.split('/').filter(segment => !isNaN(segment)).pop(); // Assume que o ID do livro está na URL

    console.log(bookId);

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Obtém os dados do formulário
        const formData = new FormData(form);

        const data = {
            title: formData.get('title'),
            description: formData.get('description'),
            author: formData.get('author'),
            genres: formData.getAll('genres'),
            publication_year: formData.get('publication_year'),
            publisher: formData.get('publisher'),
            synopsis: formData.get('synopsis'),
            language: formData.get('language'),
            pages: formData.get('pages'),
            stock: formData.get('stock'),
            price: formData.get('price'),
            cover_image: formData.get('cover_image')
        };

        console.log(data);

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
        xhr.send(JSON.stringify({ data }));
    });
});