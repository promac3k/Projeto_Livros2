document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star');
    const userRatingElement = document.getElementById('user-rating');
    const favoriteHeart = document.getElementById('favorite-heart');
    const bookId = window.location.pathname.split('/').pop(); // Assume que o ID do livro está na URL

    // Função para colorir as estrelas com base na classificação
    function colorStars(rating) {
        stars.forEach(s => s.classList.remove('selected'));
        for (let i = 0; i < rating; i++) {
            stars[i].classList.add('selected');
        }
    }

    // Obter a classificação do usuário ao carregar a página
    const userRating = userRatingElement.getAttribute('data-user-rating');
    if (userRating) {
        colorStars(userRating);
    }

    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-value');

            // Cria uma nova solicitação AJAX
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', '/rating', true);
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

            // Define a função de callback para lidar com a resposta do servidor
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    if (data.success) {
                        userRatingElement.textContent = `Sua classificação: ${rating} / 5`;
                        colorStars(rating);
                    } else {
                        alert('Erro ao atualizar classificação');
                    }
                } else if (xhr.status === 401) {
                    const data = JSON.parse(xhr.responseText);
                    alert(data.message);
                } else {
                    alert('Erro ao enviar classificação');
                }
            };

            // Envia os dados do formulário como uma string JSON
            xhr.send(JSON.stringify({ bookId: bookId, rating: rating }));
        });
    });

    // Lidar com o clique no ícone de coração
    favoriteHeart.addEventListener('click', function() {
        const isFavorite = favoriteHeart.classList.contains('favorited');

        // Cria uma nova solicitação AJAX
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', '/favorite', true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        // Define a função de callback para lidar com a resposta do servidor
        xhr.onload = function() {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                if (data.success) {
                    favoriteHeart.classList.toggle('favorited', !isFavorite);
                } else {
                    alert('Erro ao atualizar favorito');
                }
            } else if (xhr.status === 401) {
                const data = JSON.parse(xhr.responseText);
                alert(data.message);
            } else {
                alert('Erro ao enviar favorito');
            }
        };

        // Envia os dados do formulário como uma string JSON
        xhr.send(JSON.stringify({ bookId: bookId, favorite: !isFavorite }));
    });

    // Lidar com o clique no botão de editar
    const editButton = document.getElementById('edit-button');
    editButton.addEventListener('click', function() {
        window.location.href = `/detalhes/${bookId}/editar`;
    });
});