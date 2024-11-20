const mongo = require('./configs/MongoDB.js');

async function login(body) {
    //certificar password e username sem token
    
    return true;
}

async function RegistarUser(body) {
    try {
        if ((await mongo.CollectAExpecificData("User", { username: body.username })).length == 0) {
            const salt = await mongo.salt(); // Generate a random salt
            const iduser = await mongo.CollectId("User");
            body.password = await mongo.encrypt(body.password); //TODO: Tirar brevemente

            if (salt != undefined) {
                var return1 = await mongo.InsertData("User", { userid: iduser, username: body.username, email: body.email });
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
            return "O nome de Utilizador já existe!";
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function ValidToken(token, userid) {
    try {
        const pass = await mongo.CollectAExpecificData("Pass", { tokens: token });
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
        await mongo.DeleteUser("Pass");
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