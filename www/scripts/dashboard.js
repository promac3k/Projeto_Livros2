document.addEventListener('DOMContentLoaded', function() {
    const addBookForm = document.getElementById('add-book-form');
    const booksList = document.getElementById('books');

    addBookForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(addBookForm);
        const coverImage = formData.get('cover_image');

        // Validação para garantir que a URL da imagem de capa termine com .jpg
        if (!coverImage.endsWith('.jpg')) {
            alert('A URL da imagem de capa deve terminar com .jpg');
            return;
        }

        const genres = Array.from(formData.getAll('genres')).join(',');
        const book = {
            title: formData.get('title'),
            description: formData.get('description'),
            publication: formData.get('publication'),
            author: formData.get('author'),
            genres: genres,
            publisher: formData.get('publisher'),
            synopsis: formData.get('synopsis'),
            language: formData.get('language'),
            pages: formData.get('pages'),
            price: formData.get('price'),
            cover_image: formData.get('cover_image')
        };

        // Cria uma nova solicitação AJAX
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/add-book', true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        // Define a função de callback para lidar com a resposta do servidor
        xhr.onload = function() {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                if (data.success) {
                   alert('Livro adicionado com sucesso');
                   window.location.href = '/'; 
                }
            } else if (xhr.status === 401) {
                const data = JSON.parse(xhr.responseText);
                alert(data.message);
            } else {
                alert('Erro ao adicionar livro');
            }
        };

        // Envia os dados do formulário como uma string JSON
        xhr.send(JSON.stringify(book));
    });
});