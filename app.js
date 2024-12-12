// Inicie o projeto com 'npm run dev' ou 'npm start' ou 'node app.js'

// Importações
const express = require("express");
const cookieParser = require('cookie-parser');
const requestHandlers = require("./scripts/request-handlers.js");
const bodyParser = require("body-parser");
const app = express();

// Middlewares
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// Routing
//------------------------------------------------------
// Rotas - GET
//------------------------------------------------------
app.get("/", requestHandlers.getindex);
app.get("/login", requestHandlers.getlogin);
app.get("/register", requestHandlers.getregister);
app.get("/perfil", requestHandlers.getperfil);
app.get("/logout", requestHandlers.getlogout);
app.get("/dashboard", requestHandlers.getdashboard);
app.get("/ranking", requestHandlers.getranking);
app.get("/detalhes/:id", requestHandlers.getdetalhes_dados);
app.get("/editar", requestHandlers.geteditar);

//------------------------------------------------------
// Rotas - POST
//------------------------------------------------------
app.post("/register", requestHandlers.postregister);
app.post("/login", requestHandlers.postlogin);
app.post("/search", requestHandlers.postsearch);
app.post("/add-book", requestHandlers.postaddbook);

//------------------------------------------------------
// Rotas - PUT
//------------------------------------------------------
app.put("/rating", requestHandlers.putrating);
app.put("/favorite", requestHandlers.putfavorite);
app.put("/editar", requestHandlers.puteditar);

//------------------------------------------------------
// Rotas - DELETE
//------------------------------------------------------
app.delete("/favorite", requestHandlers.deletefavorite);

// Servir arquivos estáticos
app.use(express.static("www"));

// Iniciar o servidor
app.listen(8081, (error) => {
    if (error) {
        console.log("Erro ao iniciar o servidor");
    } else {
        console.log("Servidor iniciado na porta 8081");
    }
});