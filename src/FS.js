const mongo = require('./configs/MongoDB.js');

async function login(body) {
    var json = "";
    // body.password = await mongo.encrypt(body.password);

    if (body.email != undefined)
        json = { email: body.email.toLowerCase() };
    else if (body.username != undefined)
        json = { username: body.username.toLowerCase() };
    else
        return "{\"Mensagem\":\"Tem campos em falta! Por favor, verifique se preencheu todos os campos corretamente\"}";

    var Datauser = await mongo.CollectAExpecificData("User", json);
    if (Datauser.length != 0) {

        var pass = (await mongo.CollectAExpecificData("Pass", { userid: Datauser[0].userid }));

        var as = await mongo.CollectAExpecificData("Pass", { userid: Datauser[0].userid, used: true });
        var hash = await mongo.ReturnHash(mongo.decrypt(body.password), pass[0].salt);
        // console.log('Password Match:', as[0].pass === hash);
        if (as[0].pass === hash) {
            return `{\"Mensagem\":\"Login com sucesso!\", \"token\":\" ${as[0].tokens[0].token} \"}`;
            //TODO: Retornar o token
        }
        else
            return `{\"Mensagem\":\"Certifique que meteu o ${body.email != undefined ? "email" : "username"} e/ou Password corretamente! Por favor verifique se colocou tudo corretamente!\"}`;
    }
    else
        return "{\"Mensagem\":\"O utilizador não existe! Por favor, registe o mesmo, antes de tentar fazer login!\"}";
    //certificar password e username sem token

}

async function RegistarUser(body) {
    try {
        if ((await mongo.CollectAExpecificData("User", { username: body.email.toLowerCase() })).length == 0 && (await mongo.CollectAExpecificData("User", { username: body.username.toLowerCase() })).length == 0) {
            const salt = await mongo.salt(); // Generate a random salt
            const iduser = await mongo.CollectId("User");
            body.password = await mongo.encrypt(body.password); //TODO: Tirar brevemente

            if (salt != undefined) {
                var return1 = await mongo.InsertData("User", { userid: iduser, username: body.username.toLowerCase(), email: body.email.toLowerCase() });
                let token = await mongo.Createtoken();
                var lenghtpass = await mongo.CollectId("Pass");
                var return2 = await mongo.InsertData("Pass", { passid: lenghtpass, userid: iduser, pass: await mongo.ReturnHash(await mongo.decrypt(body.password), salt), salt: salt, creationDate: new Date(), used: true, tokens: [{ token: token, created: new Date(), active: true }] });

                if (return1 == "Greenlight" && return2 == "Greenlight")
                    return token;
                else
                    return false;
            }
        }
        else
            return "O nome de Utilizador já existe!\n O username ou email já existe!";
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function ValidToken(token, userid) {
    try {
        const pass = await mongo.CollectAExpecificData("Pass", { tokens: { $elemMatch: { active: true, token: token } } });
        if (pass.length > 0) {
            if (Math.floor((new Date() - pass[0].tokens[0].created) / (1000 * 60 * 60 * 24)) > 60) {
                return "{\"Mensagem\":\"Token expirado! Fazer login novamnete\", \"QueFazer\":\"Desconnect_User\"}";
            }
            else {
                return "{\"Mensagem\":\"Token válido!\", \"QueFazer\":\"Continuar\", \"UserId\":" + pass[0].userid + "}";
            }
        }
        else
            return "{\"Mensagem\":\"Token inválido ou não existente! Por favor, fazer login!\", \"QueFazer\":\"Desconnect_User\"}";
    } catch (err) {
        console.log(err);
        return "{\"Mensagem\":\"Algum erro aconteceu. Reportar aos administradores!\", \"QueFazer\":\"Desconnect_User\"}";
    }
}

async function ChangePassword(token, userId, newpassword) {
    try {

        //TODO: Work here Joao

    } catch (ex) {

    }
}

async function CollectLastId() {
    try {
        var id = (await mongo.CollectData("User"));
        return id.length;
    } catch (err) {
        console.log(err);
        return false;
    }
}

//TODO: Apagar depois dos testes!
async function DeleteUser(body) {
    try {
        await mongo.DeleteUser("User");
        await mongo.DeleteUser("Pass");
        console.log('Deleted');
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function RegistarLobby(body){
    
}

module.exports = {
    login,
    RegistarUser,
    ValidToken,
    ChangePassword,
    CollectLastId,
    RegistarLobby,
    //TEST Delete after de last test
    DeleteUser,
}