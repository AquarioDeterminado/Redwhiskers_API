const { Run } = require("./configs/MongoDB.js");
require('dotenv').config();
const exp = require('express');
const app = exp();
const FS = require('./FS.js');
const {startDB} = require("./configs/DB.conf");
app.use(exp.json());

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

app.use(allowCrossDomain);

//FIX: não lê o env!

startDB().then(() => {
    console.log('DB started');
});

app.listen(process.env.PORT, async () => {
    console.log(`Server started on port ${process.env.PORT}`);
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

//Finish!
app.post('/login', async (req, res) => {
    var result = await FS.login(req.body);
    if (result.includes("Login com sucesso!")) {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Authorization': JSON.parse(result).token });
        res.end(JSON.parse(result).Mensagem.toString());

    }
    else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.parse(result).Mensagem);
    }
});


//Finish!
app.post('/register', async (req, res) => {
    if (await FS.CheckNameAreValid(req.body.username)) {
        var token = await FS.RegistarUser(req.body);

        if (token != "O nome de Utilizador já existe!\n O username ou email já existe!") {
            if (token) {
                res.writeHead(200, { 'Content-Type': 'application/json', 'Authorization': token });
                res.end("Utilizador registado com sucesso!");
                // res.send(JSON.parse('{\"message\":\"Utilizador registado com sucesso\", \"token\":\"' + token + '\"}'));
            }
            else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end("Failed to register!");
                // res.send('Failed to register');
            }
        }
        else
            res.send(token);
    }
    else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end("Failed to register!");

    }
});

app.post('/registerbot', async (req, res) => {
    var result = await FS.RegistarBot(req.body);

    if (result.Mensagem != "Erro ao registar o bot!") {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
    }
    else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(result);
    }
});

app.get('/listBots', async (req, res) => {
    var result = await FS.VerBots(req.body);

    if (result.length > 0) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
    }
    else if (result.length == 0) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
    }
    else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
    }
});

app.delete('/deleteUser', async (req, res) => {
    var result = await FS.DeleteUser(req.body);

    if (result.includes("Utilizador eliminado com sucesso!")) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(result);
    }
    else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(result);
    }
});

//Finish!
app.post('/check-token', async (req, res) => {
    var result = await FS.ValidToken(req.headers.token, 0);

    if (result.includes("Token válido")) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(result);
        // res.send('{\"essage\":\"Utilizador registado com sucesso\", \"token\":\"' + token + '\"}'));
    }
    else if (result.includes("Algum erro aconteceu. Reportar aos administradores")) {
        res.writeHead(409, { 'Content-Type': 'application/json' });
        res.end(result);
    }
    else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(result);
        // res.send('Failed to register');
    }

});

app.post('/change-password', async (req, res) => {
    var result = await FS.ChangePassword(req.body);

    if (JSON.parse(result).Mensagem.includes("Password alterada com sucesso!")) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.parse(result).Mensagem);
    }
    else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.parse(result).Mensagem);
    }
});

app.post('/forgot-password', (req, res) => {
    res.send('Forgot Password');
});

app.post('/reset-password', (req, res) => {
    res.send('Reset Password');
});

//Finish!
app.post(`/registLobby`, async (req, res) => {
    var result = await FS.RegistarLobby(req.body);

    if (result.Mensagem.includes("Lobby criado com sucesso!")) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
    }
    else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
    }
});

//Finish!
app.post(`/joinLobby`, async (req, res) => {
    var result = await FS.JoinLobby(req.body);

    if (result.Mensagem.includes("Entrou no lobby com sucesso!")) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
    }
    else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
    }
});

//Finish!
app.put(`/leaveLobby`, async (req, res) => {
    var result = await FS.LeaveLobby(req.body);

    if (result.Mensagem.includes(" com sucesso!")) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
    }
    else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
    }
});

app.put(`/deleteLobby`, async (req, res) => {
    var result = await FS.DeleteLobby(req.body);

    if (result.Mensagem.includes(" com sucesso!")) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
    }
    else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
    }
});

//Finish!
app.get('/listLobby', async (req, res) => {
    var result = await FS.ListLobby(req.body);

    if (result.length > 0) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
    }
    else if (result.Mensagem.includes('Não existe lobbys ativos!')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
    }
    else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
    }
});

//TODO: Falta update lobby

app.delete(`/deleteTest`, async (req, res) => {
    await FS.DeleteTable(req.body);
    res.send('Deleted');
});

app.get(`/collectLastId`, async (req, res) => {
    var s = await FS.CollectLastId();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(s.toString());
});

app.get('/test', async (req, res) => {
    res.send('Test ' + new Date().toLocaleString());
});

//TODO: https://stackoverflow.com/questions/11744975/enabling-https-on-express-js
//TODO: https://github.com/AquarioDeterminado/ddm_api/blob/main/src/player/controllers/Users.controller.js
//TODO: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

//    console.log('Password Match:', hash === inputHash); // true if matches