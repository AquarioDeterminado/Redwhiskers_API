const { Run } = require("./configs/MongoDB.js");
require('dotenv').config();
const exp = require('express');
const app = (exp)();
const FS = require('./FS.js');
app.use(exp.json())


Run().then(() => {
    console.log('DB started');
});

app.listen(process.env.PORT, async () => {
    console.log(`Server started on port ${process.env.PORT}`);
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/login', async (req, res) => {
    await FS.login(req.body);
    res.send('Login');
});

app.delete(`/deleteTest`, async (req, res) => {
    await FS.DeleteUser(req.body);
    res.send('Deleted');
});

app.post('/register', async (req, res) => {
    var token = await FS.RegistarUser(req.body);

    if (token != "O nome de Utilizador já existe!") {
        if (token) {
            res.send(JSON.parse('{\"message\":\"Utilizador registado com sucesso\", \"token\":\"' + token + '\"}'));
        }
        else
            res.send('Failed to register');
    }
    else
        res.send(token);
});

app.post('/forgot-password', (req, res) => {
    res.send('Forgot Password');
});

app.post('/reset-password', (req, res) => {
    res.send('Reset Password');
});

//TODO: https://stackoverflow.com/questions/11744975/enabling-https-on-express-js
//TODO: https://github.com/AquarioDeterminado/ddm_api/blob/main/src/player/controllers/Users.controller.js

//    console.log('Password Match:', hash === inputHash); // true if matches