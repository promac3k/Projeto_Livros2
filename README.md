# 📚 Sistema de Gestão de Biblioteca

Um sistema completo de gestão de biblioteca desenvolvido em **Node.js puro** como projeto universitário, demonstrando conceitos fundamentais de desenvolvimento web backend sem frameworks adicionais.

## 🎯 Objetivo do Projeto

Este projeto foi desenvolvido como trabalho acadêmico com foco em:

-   Implementação de servidor web usando Node.js puro
-   Manipulação de bases de dados MySQL
-   Criação de sistema de autenticação
-   Desenvolvimento de interface web responsiva
-   Gestão de estado e sessões

## ✨ Funcionalidades

### 👤 Sistema de Utilizadores

-   **Registo e Login** de utilizadores
-   **Perfil pessoal** com dados do utilizador
-   **Sistema de favoritos** para livros
-   **Avaliações e classificações** de livros
-   **Diferentes níveis de acesso** (utilizador/administrador)

### 📖 Gestão de Livros

-   **Catálogo completo** com paginação
-   **Pesquisa avançada** por título, autor, género
-   **Detalhes completos** de cada livro
-   **Sistema de stock** e preços
-   **Capas personalizadas** para cada livro

### 🔧 Funcionalidades Administrativas

-   **Adicionar novos livros** ao catálogo
-   **Editar informações** de livros existentes
-   **Remover livros** do sistema
-   **Gestão de utilizadores**
-   **Sistema de ranking** de livros mais populares

## 🛠️ Tecnologias Utilizadas

### Backend

-   **Node.js** - Runtime JavaScript
-   **Express.js** - Framework web minimalista
-   **MySQL2** - Driver para base de dados MySQL
-   **EJS** - Motor de templates
-   **Cookie-Parser** - Gestão de cookies
-   **Body-Parser** - Parser de requisições HTTP

### Frontend

-   **HTML5** - Estrutura das páginas
-   **CSS3** - Estilização e design responsivo
-   **JavaScript** - Interatividade do lado cliente
-   **EJS Templates** - Renderização dinâmica

### Base de Dados

-   **MySQL** - Sistema de gestão de base de dados

## 📁 Estrutura do Projeto

```
Projeto_Livros2/
├── app.js                      # Servidor principal
├── package.json               # Dependências e scripts
├── scripts/
│   ├── connectionOptions.json # Configuração da BD (sensível)
│   └── request-handlers.js    # Handlers das rotas
├── views/                     # Templates EJS
│   ├── index.ejs             # Página inicial
│   ├── login.ejs             # Login
│   ├── register.ejs          # Registo
│   ├── dashboard.ejs         # Painel admin
│   ├── perfil.ejs            # Perfil do utilizador
│   ├── detalhes.ejs          # Detalhes do livro
│   ├── search.ejs            # Resultados de pesquisa
│   ├── ranking.ejs           # Ranking de livros
│   ├── editar.ejs            # Editar perfil
│   ├── editar_livro.ejs      # Editar livro
│   └── header.ejs            # Cabeçalho comum
├── www/                       # Recursos estáticos
│   ├── images/               # Capas dos livros
│   ├── scripts/              # JavaScript cliente
│   └── styles/               # Folhas de estilo CSS
└── Documentos/
    ├── projetoBiblioteca.sql # Script da base de dados
    └── DB-image.png          # Diagrama da BD
```

## 🚀 Como Executar

### Pré-requisitos

-   **Node.js** (versão 14 ou superior)
-   **MySQL** Server
-   **npm** (incluído com Node.js)

### Configuração da Base de Dados

1. **Instalar MySQL** e criar a base de dados:

```sql
-- Execute o ficheiro projetoBiblioteca.sql
source Documentos/projetoBiblioteca.sql
```

2. **Configurar a ligação à base de dados**:

```bash
# Copiar o ficheiro de exemplo
cp scripts/connectionOptions.example.json scripts/connectionOptions.json
```

3. **Editar as credenciais** em `scripts/connectionOptions.json`:

```json
{
    "host": "localhost",
    "user": "seu_usuario",
    "database": "biblioteca",
    "password": "sua_senha"
}
```

### Instalação e Execução

1. **Clonar o repositório**:

```bash
git clone https://github.com/promac3k/Projeto_Livros2.git
cd Projeto_Livros2
```

2. **Instalar dependências**:

```bash
npm install
```

3. **Executar o projeto**:

```bash
# Modo desenvolvimento (com nodemon)
npm run dev

# Modo produção
npm start
```

4. **Aceder à aplicação**:
   Abrir o navegador em `http://localhost:8081`

## 📊 Estrutura da Base de Dados

O sistema utiliza as seguintes tabelas principais:

-   **users** - Dados dos utilizadores
-   **books** - Catálogo de livros
-   **author** - Informações dos autores
-   **genres** - Géneros literários
-   **favorites** - Livros favoritos dos utilizadores
-   **reviews** - Avaliações e comentários
-   **access_logs** - Logs de acesso ao sistema

## 🎨 Capturas de Ecrã

O sistema inclui uma interface moderna e responsiva com:

-   Página inicial com catálogo paginado
-   Sistema de login/registo
-   Painel de administração
-   Perfis de utilizador personalizados
-   Páginas de detalhes de livros com avaliações

## 🔐 Segurança

-   **Autenticação** baseada em cookies
-   **Validação** de dados de entrada
-   **Sanitização** de queries SQL
-   **Controlo de acesso** por níveis de utilizador

## 📈 Funcionalidades Avançadas

-   **Paginação** eficiente para grandes catálogos
-   **Sistema de pesquisa** com filtros múltiplos
-   **Upload e gestão** de imagens de capas
-   **Sistema de favoritos** e avaliações
-   **Ranking dinâmico** de popularidade

## 🚧 Melhorias Futuras

-   Implementação de API RESTful
-   Sistema de empréstimos
-   Notificações em tempo real
-   Integração com APIs externas de livros
-   Sistema de reservas

## 👥 Contribuição

Este é um projeto académico, mas sugestões e melhorias são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para a feature (`git checkout -b feature/AmazingFeature`)
3. Commit as mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais como parte do curriculum universitário.

## 📞 Contacto

**Desenvolvedor**: Gustavo  
**GitHub**: [@promac3k](https://github.com/promac3k)

---

⭐ Se este projeto foi útil para você, considere dar uma estrela!
