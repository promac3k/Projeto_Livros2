document.addEventListener('DOMContentLoaded', function() {
    // Logout
    document.getElementById('logout').addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/logout';
    });

    // Remover Favoritos
    const deleteFavButtons = document.querySelectorAll('.DeleteFav');
    deleteFavButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookId = this.getAttribute('data-product');

            // Cria uma nova solicitação AJAX
            const xhr = new XMLHttpRequest();
            xhr.open('DELETE', `/favorite/${bookId}`, true);
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

            // Define a função de callback para lidar com a resposta do servidor
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    if (data.success) {
                        // Remove a linha da tabela
                        const row = button.closest('tr');
                        row.parentNode.removeChild(row);
                    } else {
                        alert('Erro ao remover favorito');
                    }
                } else {
                    alert('Erro ao remover favorito');
                }
            };

            // Envia os dados do formulário como uma string JSON
            xhr.send(JSON.stringify({ bookId: bookId }));
        });
    });

    // Função para colorir as estrelas com base na classificação
    function colorStars(starsContainer, rating) {
        const stars = starsContainer.querySelectorAll('.star');
        stars.forEach(star => {
            star.classList.remove('selected');
            if (star.getAttribute('data-value') <= rating) {
                star.classList.add('selected');
            }
        });
    }

    // Obter a classificação de todos os livros que estão na tabela de favoritos
    const ratings = document.querySelectorAll('.user-rating');
    ratings.forEach(rating => {
        const userRating = rating.getAttribute('data-user-rating');
        const starsContainer = rating.previousElementSibling;
        colorStars(starsContainer, userRating);
    });

    // Eliminar User
    const deleteUserButtons = document.querySelectorAll('.DeleteUser');
    deleteUserButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user');

            //console.log(userId);

            // Cria uma nova solicitação AJAX
            const xhr = new XMLHttpRequest();
            xhr.open('DELETE', `/delete_User/${userId}`, true);
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

            // Define a função de callback para lidar com a resposta do servidor
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    if (data.success) {
                        window.location.href = '/perfil';
                    } else {
                        alert('Erro ao remover utilizador');
                    }
                } else {
                    alert('Erro ao remover utilizador');
                }
            };

            // Envia os dados do formulário como uma string JSON
            xhr.send();
        });
    });
});