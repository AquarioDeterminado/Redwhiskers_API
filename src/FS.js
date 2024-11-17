const mongo = require('./configs/MongoDB.js');

async function login() {
    return true;
}

async function RegistarUser(body) {
    try {
        if ((await mongo.CollectAExpecificData("User", { username: body.username })).length==0) {
            const salt = await mongo.salt(); // Generate a random salt
            const iduser = await mongo.CollectId("User");
            body.password = await mongo.encrypt(body.password); //TODO: Tirar brevemente

            if (salt != undefined) {
                await mongo.InsertData("User", { userid: iduser, username: body.username, email: body.email, inventory: [], panda: [], scores: [], powerUpStats: [], questProgress: [] });
                await mongo.InsertData("Pass", { userid: iduser, pass: await mongo.ReturnHash(await mongo.decrypt(body.password), salt), salt: salt, creationDate: new Date(), used: true, tokens: [] });
                return true;
            }
        }
        else
            return "O nome de Utilizador já existe!";
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function ValidToken(token, userid) {
    try {
        const pass = await mongo.CollectAExpecificData("Pass", { tokens: token, userid: userid });
        if (pass != undefined)
            return true;
        else
            return false;
    } catch (err) {
        console.log(err);
        return false;
    }
}

//TODO: Apagar depois dos testes!
async function DeleteUser(body) {
    try {
        await mongo.DeleteUser("User");
        console.log('Deleted');
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = {
    login,
    RegistarUser,
    ValidToken,
    DeleteUser
}