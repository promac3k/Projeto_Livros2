drop database if exists biblioteca;

create database if not exists biblioteca;
use biblioteca;

-- Criação da tabela de usuários
CREATE TABLE `users`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(40) NOT NULL,
    `email` VARCHAR(40) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `telephone` VARCHAR(14) NOT NULL,	
    `birth_date` DATE NOT NULL,
    `country` VARCHAR(40) NOT NULL,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL,
	`cargo` INT NOT NULL default(0)
);



-- Criação da tabela de autores
CREATE TABLE `author`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(40) NOT NULL,
    `birth_date` DATE NOT NULL,
    `nationality` VARCHAR(40) NOT NULL,
    `biography` TEXT NOT NULL,
    `created_at` DATETIME NOT NULL
);
-- Criação da tabela de gêneros
CREATE TABLE `genres`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(40) NOT NULL
);
-- Criação da tabela de livros
CREATE TABLE `books`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(60) NOT NULL,
    `description` TEXT NOT NULL,
    `publication_year` DATE NOT NULL,
    `author_id` INT UNSIGNED NOT NULL,
    `publisher` VARCHAR(40) NOT NULL,
    `synopsis` TEXT NOT NULL,
    `language` VARCHAR(40) NOT NULL,
    `pages` INT NOT NULL,
    `price` DECIMAL(8, 2) NOT NULL,
    `stock` INT NOT NULL,
    `cover_image` VARCHAR(255) NOT NULL,
    `created_at` DATETIME NOT NULL,

    CONSTRAINT `books_author_foreign` FOREIGN KEY(`author_id`) REFERENCES `author`(`id`)
);
ALTER TABLE
    `books` ADD INDEX `books_author_id_index`(`author_id`);

-- Criação da tabela de reviews
CREATE TABLE `reviews`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `book_id` INT UNSIGNED NOT NULL,
    `rating` TINYINT NOT NULL,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL,

    UNIQUE KEY unique_user_book (`user_id`, `book_id`),
    CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `users`(`id`),
    CONSTRAINT `reviews_book_id_foreign` FOREIGN KEY(`book_id`) REFERENCES `books`(`id`)
);
ALTER TABLE
    `reviews` ADD INDEX `reviews_user_id_index`(`user_id`);
ALTER TABLE
    `reviews` ADD INDEX `reviews_book_id_index`(`book_id`);

-- Criação da tabela de favoritos
CREATE TABLE `favorites`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `book_id` INT UNSIGNED NOT NULL,

    CONSTRAINT `favorites_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `users`(`id`),
    CONSTRAINT `favorites_book_id_foreign` FOREIGN KEY(`book_id`) REFERENCES `books`(`id`)
);
ALTER TABLE
    `favorites` ADD INDEX `favorites_user_id_index`(`user_id`);
ALTER TABLE
    `favorites` ADD INDEX `favorites_book_id_index`(`book_id`);

-- Criação da tabela de access_logs
CREATE TABLE `access_logs`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `access_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `timestamp_new` DATETIME NOT NULL,
    `timestamp_old` DATETIME NOT NULL,

    CONSTRAINT `access_logs_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
);
ALTER TABLE
    `access_logs` ADD INDEX `access_logs_user_id_index`(`user_id`);

-- Criação da tabela de book_genres
CREATE TABLE `book_genres`(
    book_id INT UNSIGNED NOT NULL,
    genre_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (book_id, genre_id),
    CONSTRAINT `book_genres_book_id_foreign` FOREIGN KEY(`book_id`) REFERENCES `books`(`id`),
    CONSTRAINT `book_genres_genre_id_foreign` FOREIGN KEY(`genre_id`) REFERENCES `genres`(`id`)
);

-- Inserir Utilizador
INSERT INTO `users` (username, email, password, telephone, birth_date, country, created_at, updated_at, cargo) VALUES
("admin","admin@gmail.com","1234567!","+351 986257754", "2005-06-23", "Portugal", "2024-12-11 14:37:08", "2024-12-11 14:37:08", 1),
("user","user@gmail.com","1234567!","+351 986257754", "2005-06-23", "Portugal", "2024-12-11 14:37:08", "2024-12-11 14:37:08", 0);

-- Inserir access_logs
INSERT INTO `access_logs` (user_id, access_count, timestamp_new, timestamp_old) VALUES
(1, 0, NOW(), NOW()),
(2, 0, NOW(), NOW());

-- Inserir Gêneros
INSERT INTO `genres` (name) VALUES 
('Ação'), ('Aventura'), ('Fantasia'), ('Artes Marciais'), ('Shonen'), 
('Comédia'), ('Suspense'), ('Mistério'), ('Sobrenatural'), ('Psicológico'), 
('Seinen'), ('Terror');

-- Inserir Autores
INSERT INTO `author` (name, birth_date, nationality, biography, created_at) VALUES 
('Masashi Kishimoto', '1974-11-08', 'Japonesa', 'Criador de Naruto.', NOW()),
('Eiichiro Oda', '1975-01-01', 'Japonesa', 'Criador de One Piece.', NOW()),
('Tsugumi Ohba', '1960-08-17', 'Japonesa', 'Criador de Death Note.', NOW()),
('Hajime Isayama', '1986-08-29', 'Japonesa', 'Criador de Attack on Titan.', NOW()),
('Tite Kubo', '1977-06-26', 'Japonesa', 'Criador de Bleach.', NOW()),
('Akira Toriyama', '1955-04-05', 'Japonesa', 'Criador de Dragon Ball.', NOW()),
('Hiromu Arakawa', '1973-05-08', 'Japonesa', 'Criadora de Fullmetal Alchemist.', NOW()),
('Sui Ishida', '1986-12-28', 'Japonesa', 'Criador de Tokyo Ghoul.', NOW()),
('Yūki Tabata', '1984-07-30', 'Japonesa', 'Criador de Black Clover.', NOW()),
('Yoshihiro Togashi', '1966-04-27', 'Japonesa', 'Criador de Hunter x Hunter.', NOW()),
('Koyoharu Gotouge', '1988-05-01', 'Japonesa', 'Criador de Demon Slayer.', NOW()),
('Tatsuki Fujimoto', '1993-10-10', 'Japonesa', 'Criador de Chainsaw Man.', NOW()),
('Kōhei Horikoshi', '1986-11-20', 'Japonesa', 'Criador de My Hero Academia.', NOW());

-- Inserir Livros
INSERT INTO `books` (title, description, publication_year, author_id, publisher, synopsis, language, pages, price, stock, cover_image, created_at) VALUES 
('Naruto', 'Um ninja jovem que sonha em se tornar Hokage.', '1999-01-01', 1, 'Shueisha', 'A história de Naruto Uzumaki.', 'Japonês', 220, 19.90, 50, 'naruto_cover.jpg', NOW()),
('One Piece', 'A jornada de Luffy para se tornar o Rei dos Piratas.', '1997-07-22', 2, 'Shueisha', 'A história de Monkey D. Luffy.', 'Japonês', 1045, 29.90, 100, 'one_piece_cover.jpg', NOW()),
('Death Note', 'Um caderno que concede o poder de matar.', '2003-12-01', 3, 'Shueisha', 'Light Yagami e o Death Note.', 'Japonês', 240, 24.90, 75, 'death_note_cover.jpg', NOW()),
('Attack on Titan', 'A luta da humanidade contra os titãs.', '2009-09-09', 4, 'Kodansha', 'Eren Yeager e os segredos dos titãs.', 'Japonês', 192, 22.90, 80, 'attack_on_titan_cover.jpg', NOW()),
('Bleach', 'Um jovem com poderes sobrenaturais enfrenta criaturas chamadas Hollows.', '2001-08-20', 5, 'Shueisha', 'Ichigo Kurosaki e sua jornada como shinigami substituto.', 'Japonês', 366, 21.90, 60, 'bleach_cover.jpg', NOW()),
('Dragon Ball', 'Um garoto com um rabo de macaco treina artes marciais e busca as Esferas do Dragão.', '1984-11-20', 6, 'Shueisha', 'A saga de Goku em batalhas épicas.', 'Japonês', 519, 25.90, 90, 'dragon_ball_cover.jpg', NOW()),
('Fullmetal Alchemist', 'Dois irmãos alquimistas buscam a Pedra Filosofal.', '2001-07-12', 7, 'Square Enix', 'Edward e Alphonse Elric enfrentam desafios alquímicos.', 'Japonês', 160, 23.90, 70, 'fma_cover.jpg', NOW()),
('Tokyo Ghoul', 'Um jovem meio-humano e meio-ghoul luta para sobreviver em um mundo perigoso.', '2011-09-08', 8, 'Shueisha', 'Ken Kaneki e o mundo dos ghouls.', 'Japonês', 143, 26.90, 65, 'tokyo_ghoul_cover.jpg', NOW()),
('Black Clover', 'Dois jovens órfãos buscam se tornar o Rei Mago.', '2015-02-16', 9, 'Shueisha', 'Asta e Yuno enfrentam aventuras mágicas.', 'Japonês', 220, 19.90, 80, 'black_clover_cover.jpg', NOW()),
('Hunter x Hunter', 'Caçadores profissionais enfrentam perigos em busca de objetivos.', '1998-03-03', 10, 'Shueisha', 'A jornada de Gon Freecss para encontrar seu pai.', 'Japonês', 380, 22.90, 75, 'hunterxhunter_cover.jpg', NOW()),
('Demon Slayer', 'Um jovem luta contra demônios para salvar sua irmã.', '2016-02-15', 11, 'Shueisha', 'Tanjiro Kamado enfrenta desafios sobrenaturais.', 'Japonês', 205, 24.90, 100, 'demon_slayer_cover.jpg', NOW()),
('Chainsaw Man', 'Um jovem com poderes de motosserra luta contra demônios.', '2018-12-03', 12, 'Shueisha', 'Denji enfrenta batalhas intensas em um mundo sombrio.', 'Japonês', 192, 26.90, 85, 'chainsaw_man_cover.jpg', NOW()),
('My Hero Academia', 'Estudantes treinam para se tornarem super-heróis.', '2014-07-07', 13, 'Shueisha', 'Izuku Midoriya luta para alcançar seu sonho de ser herói.', 'Japonês', 224, 20.90, 95, 'mha_cover.jpg', NOW());

-- Relacionar Livros e Gêneros
INSERT INTO `book_genres` (book_id, genre_id) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), -- Naruto: Ação, Aventura, Fantasia, Artes Marciais, Shonen
(2, 1), (2, 2), (2, 3), (2, 5), (2, 6), -- One Piece: Ação, Aventura, Comédia, Fantasia, Shonen
(3, 7), (3, 8), (3, 9), (3, 10), (3, 11), -- Death Note: Suspense, Mistério, Sobrenatural, Psicológico, Seinen
(4, 1), (4, 3), (4, 12), (4, 7), (4, 5), -- Attack on Titan: Ação, Fantasia, Terror, Suspense, Shonen
(5, 1), (5, 3), (5, 9), (5, 4), (5, 5), -- Bleach: Ação, Fantasia, Sobrenatural, Artes Marciais, Shonen
(6, 1), (6, 3), (6, 4), (6, 5), -- Dragon Ball: Ação, Fantasia, Artes Marciais, Shonen
(7, 3), (7, 8), (7, 9), (7, 11), -- Fullmetal Alchemist: Fantasia, Mistério, Sobrenatural, Psicológico
(8, 9), (8, 12), (8, 7), (8, 10), -- Tokyo Ghoul: Sobrenatural, Terror, Suspense, Seinen
(9, 3), (9, 4), (9, 5), (9, 1), -- Black Clover: Fantasia, Artes Marciais, Shonen, Ação
(10, 1), (10, 2), (10, 3), (10, 5), -- Hunter x Hunter: Ação, Aventura, Fantasia, Shonen
(11, 1), (11, 3), (11, 9), (11, 12), -- Demon Slayer: Ação, Fantasia, Sobrenatural, Terror
(12, 1), (12, 12), (12, 9), (12, 7), -- Chainsaw: Ação, Terror, Sobrenatural, Suspense
(13, 1), (13, 5), (13, 6), (13, 3); -- My Hero Academia: Ação, Shonen, Comédia, Fantasia