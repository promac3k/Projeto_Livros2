// importar os módulos necessários
const mysql = require("mysql2");
const options = require("./connectionOptions.json");
const fs = require("fs");
const path = require("path");

// Cria a conexão com a base de dados
const connection = mysql.createConnection(options);

//---------------------------------------------------------
// ZONA DE GET - EM BAIXO
//---------------------------------------------------------
const getindex = (req, res) => {
    console.log("GET /index");

    const page = parseInt(req.query.page) || 1;
    const limit = 12; // Número de livros por página
    const offset = (page - 1) * limit;

    // Procura todos os livros
    connection.query("SELECT COUNT(*) AS count FROM books", (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Erro ao buscar livros');
        }

        const totalBooks = results[0].count;
        const totalPages = Math.ceil(totalBooks / limit);
        //console.log(totalBooks, totalPages);

        // Procura todos os livros
        connection.query("SELECT * FROM books LIMIT ? OFFSET ?", [limit, offset], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Erro ao buscar livros');
            }

            const livros = results.map(livro => {

                // Verifica se a imagem existe
                const imagePath = path.join(__dirname, '../www/images', livro.cover_image);
                if (!fs.existsSync(imagePath)) {
                    livro.cover_image = null;
                }

                return {
                    id: livro.id,
                    titulo: livro.title,
                    stock: livro.stock,
                    preço: livro.price,
                    imagem: livro.cover_image
                };
            });

            //console.log(livros);



            // Renderiza a página inicial com os livros encontrados
            res.render('index', { livros: livros, currentPage: page, totalPages: totalPages });

        });
    });
}
const getlogin = (req, res) => {
    console.log("GET /login");
    res.render("login");
}
const getregister = (req, res) => {
    console.log("GET /register");
    res.render("register");
}
const getperfil = (req, res) => {
    console.log("GET /perfil");

    const isLoggedIn = req.cookies.isLoggedIn;

    if (isLoggedIn !== 'true') {
        return res.redirect('/login');
    }

    const userId = req.cookies.id;

    const getUserProfile = (userId, callback) => {
        connection.query("SELECT * FROM users WHERE id = ?", [userId], (error, results) => {
            if (error) {
                return callback(error);
            }
            if (results.length === 0) {
                return callback(new Error('Utilizador não encontrado'));
            }
            callback(null, results[0]);
        });
    };

    const getUserFavorites = (userId, callback) => {
        connection.query(
            "SELECT books.id, books.title, books.price, books.cover_image AS imagem FROM favorites JOIN books ON favorites.book_id = books.id WHERE favorites.user_id = ?",
            [userId],
            (error, results) => {
                if (error) {
                    return callback(error);
                }
                callback(null, results);
            }
        );
    };

    const getUserAdmin = (req, res) => {
        connection.query(
            "SELECT id, username, email, password, telephone, birth_date, country FROM users",
            (error, results) => {
                if (error) {
                    return req(error);
                }
                req(null, results)
            }
        );
    };

    const getUserAccessLogs = (userId, callback) => {
        connection.query("SELECT * FROM access_logs WHERE user_id = ?", [userId], (error, results) => {
            if (error) {
                return callback(error);
            }
            if (results.length === 0) {
                return callback(null, { access_count: 0, timestamp_old: null });
            }
            callback(null, results[0]);
        });
    };

    const getUserRatings = (userId, bookIds, callback) => {
        if (bookIds.length === 0) {
            return callback(null, []);
        }
        connection.query(
            "SELECT book_id, rating FROM reviews WHERE user_id = ? AND book_id IN (?)",
            [userId, bookIds],
            (error, results) => {
                if (error) {
                    return callback(error);
                }
                callback(null, results);
            }
        );
    };

    getUserProfile(userId, (error, user) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Erro ao buscar utilizador');
        }

        const perfil = {
            name: user.username,
            email: user.email,
            telephone: user.telephone,
            birth_date: user.birth_date,
            country: user.country
        };

        getUserAdmin((error, adminUser) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Erro ao procurar utilizadores');
            }

            perfil.user = adminUser;

            getUserFavorites(userId, (error, favoritos) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send('Erro ao buscar favoritos');
                }

                perfil.favoritos = favoritos;

                getUserAccessLogs(userId, (error, accessLogs) => {



                    if (error) {
                        console.error(error);
                        return res.status(500).send('Erro ao buscar logs de acesso');
                    }

                    perfil.access_count = accessLogs.access_count;
                    perfil.timestamp_old = accessLogs.timestamp_old;

                    const bookIds = favoritos.map(livro => livro.id);

                    getUserRatings(userId, bookIds, (error, ratings) => {
                        if (error) {
                            console.error(error);
                            return res.status(500).send('Erro ao buscar classificação');
                        }

                        const ratingsMap = ratings.reduce((acc, review) => {
                            acc[review.book_id] = review.rating;
                            return acc;
                        }, {});

                        perfil.favoritos.forEach(livro => {
                            livro.rating = ratingsMap[livro.id] || 0;
                        });

                        res.render("perfil", { perfil: perfil });
                    });
                });
            });
        });
    });
}
const getlogout = (req, res) => {
    console.log("GET /logout");
    res.clearCookie('isLoggedIn');
    res.clearCookie('isLoggedInFrontend');
    res.clearCookie('id');
    res.redirect('/');
}
const getdashboard = (req, res) => {
    console.log("GET /dashboard");

    const isLoggedIn = req.cookies.isLoggedIn;
    const userId = req.cookies.id;

    const getUserProfile = (userId, callback) => {
        connection.query("SELECT * FROM users WHERE id = ?", [userId], (error, results) => {
            if (error) {
                return callback(error);
            }
            if (results.length === 0) {
                return callback(new Error('Utilizador não encontrado'));
            }
            callback(null, results[0]);
        });
    };

    const getUserStats = (userId, callback) => {
        connection.query(
            "SELECT COUNT(*) AS book_id FROM favorites WHERE user_id = ?",
            [userId],
            (error, results) => {
                if (error) {
                    return callback(error);
                }
                const booksfav = results[0].book_id;
                //console.log(booksfav + " favoritos");

                connection.query(
                    "SELECT COUNT(*) AS book_id FROM reviews WHERE user_id = ?",
                    [userId],
                    (error, results) => {
                        if (error) {
                            return callback(error);
                        }
                        const reviewsCount = results[0].book_id;
                        //onsole.log(reviewsCount + " reviews");
                        callback(null, { books_fav: booksfav, reviews_count: reviewsCount });
                    }
                );
            }
        );
    };

    const getAuthors = (callback) => {
        connection.query("SELECT * FROM author", (error, results) => {
            if (error) {
                return callback(error);
            }
            callback(null, results);
        });
    };

    const getGenres = (callback) => {
        connection.query("SELECT * FROM genres", (error, results) => {
            if (error) {
                return callback(error);
            }
            callback(null, results);
        });
    };

    if (isLoggedIn) {
        getUserProfile(userId, (error, user) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Erro ao buscar utilizador');
            }
            getUserStats(userId, (error, stats) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send('Erro ao buscar estatísticas');
                }
                getAuthors((error, autores) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).send('Erro ao buscar autores');
                    }
                    getGenres((error, generos) => {
                        if (error) {
                            console.error(error);
                            return res.status(500).send('Erro ao buscar gêneros');
                        }

                        const perfil = {
                            name: user.username,
                            books_fav: stats.books_fav,
                            reviews_count: stats.reviews_count,
                            autores: autores,
                            generos: generos
                        };

                        res.render("dashboard", { perfil: perfil });
                    });
                });
            });
        });
    } else {
        getAuthors((error, autores) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Erro ao buscar autores');
            }
            getGenres((error, generos) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send('Erro ao buscar gêneros');
                }

                const perfil = {
                    name: null,
                    books_fav: null,
                    reviews_count: null,
                    autores: autores,
                    generos: generos
                };

                res.render("dashboard", { perfil: perfil });
            });
        });
    }
};
const getranking = (req, res) => {
    console.log("GET /ranking");


    // Consulta para buscar os usuários com mais acessos
    connection.query(`
        SELECT users.username, access_logs.access_count 
        FROM users 
        INNER JOIN access_logs ON users.id = access_logs.user_id 
        ORDER BY access_logs.access_count DESC 
        LIMIT 10
        `, (error, userResults) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Erro ao buscar usuários');
        }

        // Consulta para buscar os livros com as melhores classificações
        connection.query("SELECT books.id, books.title, SUM(reviews.rating) AS total_rating FROM books JOIN reviews ON books.id = reviews.book_id GROUP BY books.id ORDER BY total_rating DESC LIMIT 10", (error, bookResults) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Erro ao buscar livros');
            }

            res.render("ranking", { usuarios: userResults, livros: bookResults });
        });
    });
}
const getdetalhes_dados = (req, res) => {
    const id = req.params.id;
    console.log("GET /detalhes/" + id);

    const userId = req.cookies.id || null;

    const getusercargo = (userId, callback) => {
        if (!userId) {
            return callback(null, 0); // Se não houver usuário, assume cargo 0 (não admin)
        }
        connection.query("SELECT * FROM users WHERE id = ?", [userId], (error, results) => {
            if (error) {
                return callback(error);
            }
            if (results.length === 0) {
                return callback(new Error('Utilizador não encontrado'));
            }

            const db = results[0];
            const cargo = db.cargo;

            callback(null, cargo);
        });
    };

    const getBookDetails = (bookId, callback) => {
        connection.query("SELECT * FROM books WHERE id = ?", [bookId], (error, results) => {
            if (error) {
                return callback(error);
            }
            if (results.length === 0) {
                return callback(new Error('Livro não encontrado'));
            }
            callback(null, results[0]);
        });
    };

    const getAuthorDetails = (authorId, callback) => {
        connection.query("SELECT * FROM author WHERE id = ?", [authorId], (error, results) => {
            if (error) {
                return callback(error);
            }
            if (results.length === 0) {
                return callback(new Error('Autor não encontrado'));
            }
            callback(null, results[0]);
        });
    };

    const getBookGenres = (bookId, callback) => {
        connection.query("SELECT * FROM book_genres WHERE book_id = ?", [bookId], (error, results) => {
            if (error) {
                return callback(error);
            }
            if (results.length === 0) {
                return callback(new Error('Genero do livro não encontrado'));
            }
            const genreIds = results.map(genero => genero.genre_id);
            connection.query('SELECT * FROM genres WHERE id IN (?)', [genreIds], (error, results) => {
                if (error) {
                    return callback(error);
                }
                callback(null, results.map(genero => genero.name));
            });
        });
    };

    const getUserRating = (userId, bookId, callback) => {
        connection.query("SELECT * FROM reviews WHERE user_id = ? AND book_id = ?", [userId, bookId], (error, results) => {
            if (error) {
                return callback(error);
            }
            const userRating = results.length > 0 ? results[0].rating : 0;
            callback(null, userRating);
        });
    };

    const getFavoriteStatus = (userId, bookId, callback) => {
        connection.query("SELECT * FROM favorites WHERE user_id = ? AND book_id = ?", [userId, bookId], (error, results) => {
            if (error) {
                return callback(error);
            }
            const isFavorite = results.length > 0;
            callback(null, isFavorite);
        });
    };

    getusercargo(userId, (error, cargo) => {
        if (error) {
            console.error(error);
            return res.status(500).send(error.message);
        }

        getBookDetails(id, (error, livro) => {
            if (error) {
                console.error(error);
                return res.status(500).send(error.message);
            }

            const detalhes = {
                id: livro.id,
                titulo: livro.title,
                descriçao: livro.description,
                data_publicação: livro.publication_year,
                editora: livro.publisher,
                sinopse: livro.synopsis,
                idioma: livro.language,
                páginas: livro.pages,
                stock: livro.stock,
                preço: livro.price,
                imagem: livro.cover_image,
                cargo: cargo
            };

            getAuthorDetails(livro.author_id, (error, autor) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send(error.message);
                }

                detalhes.autor = autor.name;
                detalhes.data_nascimento = autor.birth_date;
                detalhes.nacionalidade = autor.nationality;
                detalhes.biografia = autor.biography;

                getBookGenres(id, (error, generos) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).send(error.message);
                    }

                    detalhes.generos = generos;

                    getUserRating(userId, id, (error, userRating) => {
                        if (error) {
                            console.error(error);
                            return res.status(500).send(error.message);
                        }

                        detalhes.user_rating = userRating;

                        getFavoriteStatus(userId, id, (error, isFavorite) => {
                            if (error) {
                                console.error(error);
                                return res.status(500).send(error.message);
                            }

                            detalhes.is_favorite = isFavorite;

                            console.log(detalhes);

                            // Verifica se a imagem existe
                            const imagePath = path.join(__dirname, '../www/images', detalhes.imagem);
                            if (!fs.existsSync(imagePath)) {
                                detalhes.imagem = null;
                            }

                            // Renderiza a página de detalhes com todos os detalhes
                            res.render('detalhes', { detalhes: detalhes });
                        });
                    });
                });
            });
        });
    });
};
const geteditar = (req, res) => {
    console.log("GET /editar");

    const isLoggedIn = req.cookies.isLoggedIn;

    if (isLoggedIn === 'true') {
        connection.query("SELECT * FROM users WHERE id = ?", [req.cookies.id], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Erro ao buscar utilizador');
            }

            if (results.length === 0) {
                return res.status(404).send('Utilizador não encontrado');
            }

            const perfil = results[0];
            //console.log(perfil);

            res.render("editar", { perfil: perfil });
        });

    } else {
        res.redirect('/login');
    }
}
const geteditar_livro = (req, res) => {
    console.log("GET /editar-livro/" + req.params.id);

    const isLoggedIn = req.cookies.isLoggedIn;

    if (isLoggedIn === 'true') {
        const bookId = req.params.id;

        const getBookDetails = (bookId, callback) => {
            connection.query("SELECT * FROM books WHERE id = ?", [bookId], (error, results) => {
                if (error) {
                    return callback(error);
                }
                if (results.length === 0) {
                    return callback(new Error('Livro não encontrado'));
                }
                callback(null, results[0]);
            });
        };

        const getAuthors = (callback) => {
            connection.query("SELECT * FROM author", (error, results) => {
                if (error) {
                    return callback(error);
                }
                callback(null, results);
            });
        };

        const getGenres = (callback) => {
            connection.query("SELECT * FROM genres", (error, results) => {
                if (error) {
                    return callback(error);
                }
                callback(null, results);
            });
        };

        const getBookGenres = (bookId, callback) => {
            connection.query("SELECT * FROM book_genres WHERE book_id = ?", [bookId], (error, results) => {
                if (error) {
                    return callback(error);
                }
                const genreIds = results.map(genero => genero.genre_id);
                callback(null, genreIds);
            });
        };

        getBookDetails(bookId, (error, livro) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Erro ao buscar livro');
            }

            getAuthors((error, autores) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send('Erro ao buscar autor');
                }

                getGenres((error, generos) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).send('Erro ao buscar gêneros');
                    }

                    getBookGenres(bookId, (error, generosLivro) => {
                        if (error) {
                            console.error(error);
                            return res.status(500).send('Erro ao buscar gêneros do livro');
                        }

                        res.render("editar_livro", { livro: livro, autores: autores, generos: generos, generosLivro: generosLivro });
                    });
                });
            });
        });
    } else {
        res.redirect('/login');
    }
};

//---------------------------------------------------------
// ZONA DE POST - EM BAIXO
//---------------------------------------------------------
const postregister = (req, res) => {
    console.log("POST /register");
    console.log(req.body);

    const { name, email, password, country, phone, birthdate } = req.body;

    const checkEmailExists = (email, callback) => {
        connection.query(
            "SELECT * FROM users WHERE email = ?",
            [email],
            (error, results) => {
                if (error) {
                    return callback(error);
                }
                if (results.length > 0) {
                    return callback(new Error("O email já está registado"));
                }
                callback(null);
            }
        );
    };

    const registerUser = (name, email, password, phone, birthdate, country, callback) => {
        connection.query(
            "INSERT INTO users (username, email, password, telephone, birth_date, country, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())",
            [name, email, password, phone, birthdate, country],
            (error, results) => {
                if (error) {
                    return callback(error);
                }
                callback(null, results.insertId);
            }
        );
    };

    const createAccessLog = (userId, callback) => {
        connection.query(
            "INSERT INTO access_logs (user_id, access_count, timestamp_old, timestamp_new) VALUES (?, 1, NOW(), NOW())",
            [userId],
            (error, results) => {
                if (error) {
                    return callback(error);
                }
                callback(null);
            }
        );
    };

    const setLoginCookies = (res, userId) => {
        res.cookie('id', userId, { httpOnly: true });
        res.cookie('isLoggedIn', 'true', { httpOnly: true });
        res.cookie('isLoggedInFrontend', 'true', { httpOnly: false });
    };

    checkEmailExists(email, (error) => {
        if (error) {
            console.error(error);
            if (error.message === "O email já está registado") {
                return res.status(400).send(error.message);
            }
            return res.status(500).send("Erro ao tentar registar o utilizador");
        }

        registerUser(name, email, password, phone, birthdate, country, (error, userId) => {
            if (error) {
                console.error(error);
                return res.status(500).send("Erro ao tentar registar o utilizador");
            }

            createAccessLog(userId, (error) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send("Erro ao registar o acesso");
                }

                setLoginCookies(res, userId);
                res.json({ success: "Registro efetuado com sucesso!" });
            });
        });
    });
}
const postlogin = (req, res) => {
    console.log("POST /login");
    console.log(req.body);

    const { email, password } = req.body;

    const verifyUserCredentials = (email, password, callback) => {
        connection.query(
            "SELECT * FROM users WHERE email = ? AND password = ?",
            [email, password],
            (error, results) => {
                if (error) {
                    return callback(error);
                }
                if (results.length === 0) {
                    return callback(new Error("Email ou password incorretos"));
                }
                callback(null, results[0]);
            }
        );
    };

    const updateAccessLogs = (userId, callback) => {
        connection.query(
            "UPDATE access_logs SET access_count = access_count + 1, timestamp_old = timestamp_new, timestamp_new = NOW() WHERE user_id = ?",
            [userId],
            (error, results) => {
                if (error) {
                    return callback(error);
                }
                callback(null, results);
            }
        );
    };

    const setLoginCookies = (res, userId) => {
        res.cookie('isLoggedIn', 'true', { httpOnly: true });
        res.cookie('isLoggedInFrontend', 'true', { httpOnly: false });
        res.cookie('id', userId, { httpOnly: true });
    };

    verifyUserCredentials(email, password, (error, user) => {
        if (error) {
            console.error(error);
            if (error.message === "Email ou password incorretos") {
                return res.status(401).send(error.message);
            }
            return res.status(500).send("Erro ao tentar fazer login");
        }

        updateAccessLogs(user.id, (error) => {
            if (error) {
                console.error(error);
                return res.status(500).send("Erro ao atualizar contagem de acessos");
            }

            setLoginCookies(res, user.id);
            res.json({ success: "Login efetuado com sucesso!" });
        });
    });
}
const postsearch = (req, res) => {
    console.log("POST /search");
    console.log(req.body);

    const { query, page = 1 } = req.body; // Adicione a página ao corpo da requisição
    const limit = 81; // 9x9
    const offset = (page - 1) * limit;
    const searchQuery = `%${query.toLowerCase()}%`;

    // Conta o número total de livros que correspondem à consulta de pesquisa
    connection.query(
        "SELECT COUNT(*) AS count FROM books WHERE LOWER(title) LIKE ?",
        [searchQuery],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Erro ao buscar livros');
            }

            const totalBooks = results[0].count;
            const totalPages = Math.ceil(totalBooks / limit);

            // Procura livros que contenham a query no título com paginação
            connection.query(
                "SELECT * FROM books WHERE LOWER(title) LIKE ? LIMIT ? OFFSET ?",
                [searchQuery, limit, offset],
                (error, results) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).send('Erro ao buscar livros');
                    }

                    const livros = results.map(livro => {

                        // Verifica se a imagem existe
                        const imagePath = path.join(__dirname, '../www/images', livro.cover_image);
                        if (!fs.existsSync(imagePath)) {
                            livro.cover_image = null;
                        }

                        return {
                            id: livro.id,
                            titulo: livro.title,
                            stock: livro.stock,
                            preço: livro.price,
                            imagem: livro.cover_image
                        };
                    });

                    // Renderiza a página de resultados de pesquisa com os livros encontrados
                    res.render('search', { livros: livros, currentPage: page, totalPages: totalPages, query: query });
                }
            );
        }
    );
}
const postaddbook = (req, res) => {
    const { title, description, publication, author, genres, publisher, synopsis, language, pages, price, cover_image } = req.body;

    // Verifica se o livro já existe
    connection.query(
        "SELECT * FROM books WHERE title = ? AND author_id = ?",
        [title, author],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Erro ao verificar existência do livro');
            }

            if (results.length > 0) {
                return res.status(401).json({ message: 'Livro já existe' });
            }

            // Adiciona o livro se não existir
            connection.query(
                "INSERT INTO books (title, description, publication_year, author_id, publisher, synopsis, language, pages, price, stock, cover_image, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())",
                [title, description, publication, author, publisher, synopsis, language, pages, price, 0, cover_image],
                (error, results) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).send('Erro ao adicionar livro');
                    }

                    const bookId = results.insertId;

                    const genreValues = genres.split(',').map(genreId => [bookId, genreId]);
                    connection.query(
                        "INSERT INTO book_genres (book_id, genre_id) VALUES ?",
                        [genreValues],
                        (error, results) => {
                            if (error) {
                                console.error(error);
                                return res.status(500).send('Erro ao adicionar gêneros do livro');
                            }
                            res.json({ success: true });
                        }
                    );
                }
            );
        }
    );
}

//---------------------------------------------------------
// ZONA DE PUT - EM BAIXO
//---------------------------------------------------------
const putrating = (req, res) => {
    console.log("PUT /rating");
    console.log(req.body);

    const { bookId, rating } = req.body;
    const userId = req.cookies.id;

    if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado - Por favor faça login' });
    }

    // Insere ou atualiza a classificação do usuário para o livro
    connection.query(
        "INSERT INTO reviews (user_id, book_id, rating, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW()) ON DUPLICATE KEY UPDATE rating = VALUES(rating), updated_at = NOW()",
        [userId, bookId, rating],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Erro ao registrar classificação');
            }
            res.json({ success: true, userRating: rating });
        }
    );
}
const putfavorite = (req, res) => {

    console.log("PUT /favorite");

    const { bookId, favorite } = req.body;
    const userId = req.cookies.id;

    if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado - Por favor faça login' });
    }

    if (favorite) {

        console.log("Adicionando favorito");

        // Insere o livro na lista de favoritos
        connection.query(
            "INSERT INTO favorites (user_id, book_id) VALUES (?, ?)",
            [userId, bookId],
            (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send('Erro ao adicionar favorito');
                }
                res.json({ success: true });
            }
        );
    } else {

        console.log("Removendo favorito");

        // Remove o livro da lista de favoritos
        connection.query(
            "DELETE FROM favorites WHERE user_id = ? AND book_id = ?",
            [userId, bookId],
            (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send('Erro ao remover favorito');
                }
                res.json({ success: true });
            }
        );
    }
}
const puteditar = (req, res) => {
    console.log("PUT /editar");
    console.log(req.body);

    const { name, country, phone, birthdate, oldPassword, newPassword } = req.body;
    const userId = req.cookies.id;

    if (!userId) {
        return res.status(401).send('Usuário não autenticado');
    }

    // Verifica se a senha antiga está correta
    connection.query("SELECT password FROM users WHERE id = ?", [userId], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Erro ao verificar senha antiga');
        }

        const user = results[0];
        if (oldPassword && user.password !== oldPassword) {
            return res.status(401).json({ message: 'Senha antiga incorreta' });
        }

        // Atualiza os dados do usuário
        let updateQuery = "UPDATE users SET username = ?, country = ?, telephone = ?, birth_date = ?";
        const updateParams = [name, country, phone, birthdate];

        if (newPassword) {
            updateQuery += ", password = ?";
            updateParams.push(newPassword);
        }

        updateQuery += " WHERE id = ?";
        updateParams.push(userId);

        connection.query(updateQuery, updateParams, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Erro ao atualizar perfil');
            }

            res.json({ success: true });
        });
    });
}
const puteditar_livro = (req, res) => {
    console.log("PUT /editar-livro/" + req.params.id);
    console.log(req.body);

    const { title, description, publication, author, genres, publisher, synopsis, language, pages, price, cover_image } = req.body;
    const bookId = req.params.id;

    // Atualiza os detalhes do livro
    connection.query(
        "UPDATE books SET title = ?, description = ?, publication_year = ?, author_id = ?, publisher = ?, synopsis = ?, language = ?, pages = ?, price = ?, cover_image = ? WHERE id = ?",
        [title, description, publication, author, publisher, synopsis, language, pages, price, cover_image, bookId],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Erro ao atualizar livro');
            }

            // Atualiza os gêneros do livro
            connection.query("DELETE FROM book_genres WHERE book_id = ?", [bookId], (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send('Erro ao remover gêneros do livro');
                }

                const genreValues = genres.split(',').map(genreId => [bookId, genreId]);
                connection.query(
                    "INSERT INTO book_genres (book_id, genre_id) VALUES ?",
                    [genreValues],
                    (error, results) => {
                        if (error) {
                            console.error(error);
                            return res.status(500).send('Erro ao adicionar gêneros do livro');
                        }
                        res.json({ success: true });
                    }
                );
            });
        }
    );
}

//---------------------------------------------------------
// ZONA DE DELETE - EM BAIXO
//---------------------------------------------------------
const deletefavorite = (req, res) => {

    console.log("DELETE /favorite");
    console.log(req.body);

    const { bookId } = req.body;
    const userId = req.cookies.id;

    if (!userId) {
        return res.status(401).send('Usuário não autenticado');
    }

    // Remove o livro da lista de favoritos
    connection.query(
        "DELETE FROM favorites WHERE user_id = ? AND book_id = ?",
        [userId, bookId],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Erro ao remover favorito');
            }
            res.json({ success: true });
        }
    );
}

module.exports = {
    getindex,
    getlogin,
    getregister,
    getperfil,
    getlogout,
    postregister,
    postlogin,
    getdashboard,
    getranking,
    postsearch,
    getdetalhes_dados,
    putrating,
    putfavorite,
    deletefavorite,
    geteditar,
    puteditar,
    postaddbook,
    geteditar_livro,
    puteditar_livro
}