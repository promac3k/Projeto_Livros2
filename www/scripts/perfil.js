document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('logout').addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/logout';
    });

    const DeleteFavsButtons = document.querySelectorAll('.DeleteFav');

    DeleteFavsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookId = this.getAttribute('data-product');

            // Cria uma nova solicitação AJAX
            const xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/favorite', true);
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

        //console.log(rating);
        const stars = starsContainer.querySelectorAll('.star');
        //console.log(stars);

        stars.forEach(star => {
            star.classList.remove('selected');
            if (star.getAttribute('data-value') <= rating) {
                star.classList.add('selected');
            }
        });
    }

    //ober a classificação de todos os livros que estas na tabela de favoritos
    const ratings = document.querySelectorAll('.user-rating');
    //console.log(ratings);

    ratings.forEach(rating => {

        const userRating = rating.getAttribute('data-user-rating');
        //console.log(userRating);
        const starsContainer = rating.previousElementSibling;
        //console.log(starsContainer);

        colorStars(starsContainer, userRating);
    });

});