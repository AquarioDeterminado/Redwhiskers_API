const mongo = require('./configs/MongoDB.js');

async function login(body) {
    var json = "";
    // body.password = await mongo.encrypt(body.password);

    if (body.email != undefined)
        json = { email: '' + body.email.toLowerCase() };
    else if (body.username != undefined)
        json = { username: body.username.toLowerCase() };
    else
        return { Mensagem: "Tem campos em falta! Por favor, verifique se preencheu todos os campos corretamente" };

    var Datauser = await mongo.CollectAExpecificData("User", json);
    if (Datauser.length !== 0) {

        var pass = (await mongo.CollectAExpecificData("Pass", { userid: Datauser[0].userid }));

        var as = await mongo.CollectAExpecificData("Pass", { userid: Datauser[0].userid, used: true });
        var hash = await mongo.ReturnHash(mongo.decrypt(body.password), pass[0].salt);
        // console.log('Password Match:', as[0].pass === hash);
        if (as[0].pass === hash) {
            return { Mensagem: "Login com sucesso!", token: `${as[0].tokens[0].token}` };

        }
        else
            return { Mensagem: `Certifique que meteu o ${body.email != undefined ? "email" : "username"} e/ou Password corretamente! Por favor verifique se colocou tudo corretamente!` };
    }
    else
        return { Mensagem: "O utilizador não existe! Por favor, registe o mesmo, antes de tentar fazer login!" };


}

async function RegistarUser(body) {
    try {
        if ((await mongo.CollectAExpecificData("User", { email: body.email.toLowerCase() })).length === 0 && (await mongo.CollectAExpecificData("User", { username: body.username.toLowerCase() })).length === 0) {
            const salt = await mongo.salt(); // Generate a random salt
            const iduser = await mongo.CollectId("User");
            // body.password = await mongo.encrypt(body.password); //TODO: Tirar brevemente

            if (salt != undefined) {
                var result1 = await mongo.InsertData("User", { userid: iduser, username: body.username.toLowerCase(), email: body.email.toLowerCase() });
                let token = await mongo.Createtoken();
                var lenghtpass = await mongo.CollectId("Pass");
                var result2 = await mongo.InsertData("Pass", { passid: lenghtpass, userid: iduser, pass: await mongo.ReturnHash(await mongo.decrypt(body.password), salt), salt: salt, creationDate: new Date(), used: true, tokens: [{ token: token, created: new Date(), active: true }] });

                if (result1 == "Greenlight" && result2 == "Greenlight")
                    return { Mensagem: "Já tem o token do user!", token: token };
                else
                    return false;
            }
        }
        else
            return { Mensagem: "O nome de Utilizador já existe!\n O username ou email já existe!" };
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function RegistarBot(body) {
    try {
        let idbot = await mongo.CollectId("Bot");
        let token = await mongo.Createtoken();

        let result = await mongo.InsertData("Bot", { Botid: idbot, Botname: body.Botname, type: body.type, token: token, DateTime: new Date() });
        if (result == "Greenlight") {
            console.log("Bot registado com sucesso!");
            return { botid: idbot, botname: body.Botname, token: token };
        }
        else
            return { Mensagem: "Erro ao registar o bot!" };
    }
    catch (ex) {
        console.log(ex);
    }
}

async function VerBots() {
    try {
        var bots = await mongo.CollectData("Bot");
        var json = [];
        bots.forEach(element => {
            json.push({ botid: element.Botid, botname: element.Botname, type: element.type, token: element.token, DateTime: element.DateTime });

        });

        return json;
    } catch {

    }
}
//TODO: Verificar se os campos estão corretos
async function UpdateUser(body) {
    let json = "{";

    try {
        if (body.username != undefined)
            json += "username: " + body.username.toLowerCase() + ", ";
        if (body.email != undefined)
            json += "email: " + body.email.toLowerCase() + ", ";
        if (body.inventory != undefined)
            json += "inventory: " + body.inventory + ", ";
        if (body.panda != undefined)
            json += "panda: " + body.panda + ", ";
        if (body.scores != undefined)
            json += "scores: " + body.scores + ", ";
        if (body.powerUpStats != undefined)
            json += "powerUpStats: " + body.powerUpStats + ", ";
        if (body.questProgress != undefined)
            json += "questProgress: " + body.questProgress + ", ";

        json += "}";

        var result = await mongo.UpdateData("User", JSON.parse(json));
    }
    catch (err) {
        console.log(err);


    }
}

async function DeleteUser(body) {
    try {

        var datatoken = (await ValidToken(body.token, body.id));
        if (datatoken.Mensagem.includes("Token válido!")) {
            var result = await mongo.DeleteData("User", { userid: datatoken.UserId });

            if (result.deletedCount == 1)
                return { Mensagem: "Utilizador eliminado com sucesso!" };
            else
                return { Mensagem: "Erro ao eliminar o utilizador!" };
        }
        else
            return { Mensagem: "O token não é válido! Por favor, faça login novamente!" };

    }
    catch (err) {
        console.log(err);

    }
}

async function ValidToken(token, userid) {
    try {
        let pass;
        if (userid !== 0) {
            pass = await mongo.CollectAExpecificData("Pass", { tokens: { $elemMatch: { active: true, token: token } }, userid: userid });
        }
        else
            pass = await mongo.CollectAExpecificData("Pass", { tokens: { $elemMatch: { active: true, token: token } } });

        if (pass.length > 0) {
            if (Math.floor((new Date() - pass[0].tokens[0].created) / (1000 * 60 * 60 * 24)) > 60) {
                return { Mensagem: "Token expirado! Fazer login novamnete", QueFazer: "Desconnect_User" };
            }
            else {1
                return { Mensagem: "Token válido!", QueFazer: "Continuar", UserId: pass[0].userid };
            }
        }
        else
            return { Mensagem: "Token inválido ou não existente! Por favor, fazer login!", QueFazer: "Desconnect_User" };
    } catch (err) {
        console.log(err);
        return { Mensagem: "Algum erro aconteceu. Reportar aos administradores!", QueFazer: "Desconnect_User" };
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
async function DeleteTable(body) {
    try {
        //await mongo.DeleteTable("User");
        //await mongo.DeleteTable("Pass");
        await mongo.DeleteTable("GameLobby");
        console.log('Deleted');
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function RegistarLobby(body) {
    try {

        if (await mongo.CollectAExpecificData("User", { userid: body.idHoster }).length != 0) {

            let token = await ValidToken(body.token, body.idHoster);
            if (token.QueFazer === "Continuar") {

                var id = await mongo.CollectId("GameLobby");

                var codeLobby = "", json = "";

                if (body.typeLobby !== "Singleplayer") {

                    while (true) {
                        codeLobby = await mongo.CodeIdLobby();

                        if ((await mongo.CollectAExpecificData("GameLobby", { CodeId: codeLobby })).length == 0)
                            break;
                    }

                    json = { GameLobbyid: id, ListUserIdLobby: [body.idHoster], CodeId: codeLobby, GameWasStarted: false, LobbyCreated: new Date(), LobbyActive: true, TypeOfLobby: 0 };

                }
                else
                    json = { GameLobbyid: id, ListUserIdLobby: [body.idHoster], GameWasStarted: false, LobbyCreated: new Date(), LobbyActive: true, TypeOfLobby: 4 };

                if (await mongo.CollectAExpecificData("GameLobby", { ListUserIdLobby: [body.idHoster] }) == 0) {
                    var result = await mongo.InsertData("GameLobby", json);

                    if (result == "Redlight")
                        return { "Mensagem": "Erro ao criar o lobby!!" };

                    if (body.typeLobby === "Singleplayer")
                        return { "Mensagem": "Lobby criado com sucesso!", "GameLobbyid": id, "LobbyCreated": `${json.LobbyCreated}` };
                    else
                        return { "Mensagem": "Lobby criado com sucesso!", "CodeId": codeLobby, "GameLobbyid": id, "LobbyCreated": `${json.LobbyCreated}` };
                }
                else
                    return { "Mensagem": "O utilizador já está num lobby! Por favor, saia do lobby antes de criar um novo!" };
            }
            else
                return { "Mensagem": "O token não é válido! Por favor, faça login novamente!" };
        }
        else
            return { "Mensagem": "O utilizador não existe! Por favor, registe o mesmo, antes de tentar criar" };

    }
    catch (ex) {
        console.log(ex);
        return { "Mensagem": "Erro ao criar o lobby!" };
    }
}

async function ListLobby() {
    try {
        var result = await mongo.CollectData("GameLobby", { LobbyActive: true, GameWasStarted: false });

        if (result.length != 0) {
            var json = [];
            for (let i = 0; i < result.length; i++) {
                json.push({ "GameLobbyid": result[i].GameLobbyid, "ListUserIdLobby": result[i].ListUserIdLobby, "CodeId": result[i].CodeId, "GameWasStarted": result[i].GameWasStarted, "LobbyActive": result[i].LobbyActive, "TypeOfLobby": result[i].TypeOfLobby, "LobbyCreated": result[i].LobbyCreated });
            }
            return json;
        }
        else
            return { "Mensagem": "Não existe lobbys ativos!" };
    } catch (ex) {
        console.log(ex);
        return { "Mensagem": ex.Message };
    }
}

async function JoinLobby(body) {
    try {

        if ((await ValidToken(body.token, 0)).includes("{Mensagem:\"Token válido!\",")) {
            if ((await mongo.CollectAExpecificData("GameLobby", { CodeId: body.LobbyCode, LobbyActive: true, GameWasStarted: false })).length != 0) {

                let player = await mongo.CollectAExpecificData("Pass", { tokens: { $elemMatch: { active: true, token: body.token } } });

                if (player.length == 0)
                    return { "Mensagem": "O token não é válido! Por favor, faça login novamente!" };

                if ((await mongo.CollectAExpecificData("GameLobby", { ListUserIdLobby: { $all: [player[0].userid] } })).length == 0) {
                    var result = await mongo.UpdateData("GameLobby", { CodeId: body.LobbyCode, LobbyActive: true, GameWasStarted: false }, { $push: { ListUserIdLobby: player[0].userid } });

                    if (result.modifiedCount != 0 && result.matchedCount != 0)
                        return { "Mensagem": "Entraste no lobby com sucesso!" };
                    else
                        return { "Mensagem": "Erro ao apagar o lobby!" };

                }
                else
                    return { "Mensagem": "Você já se encontra num lobby. Por favor, saia do lobby anterior!" };

            }
            else
                return { "Mensagem": "O codigo que digitou não se encontra valido!" };

        } else
            return { "Mensagem": "O token não é válido! Por favor, faça login novamente!" };
    } catch (ex) {
        console.log(ex);
        return { "Mensagem": ex.Message };
    }
}

async function LeaveLobby(body) {
    try {

        if ((await ValidToken(body.token, 0)).includes("{Mensagem:\"Token válido!\",")) {
            if ((await mongo.CollectAExpecificData("GameLobby", { CodeId: body.LobbyCode, LobbyActive: true, GameWasStarted: false })).length != 0) {

                let player = await mongo.CollectAExpecificData("Pass", { tokens: { $elemMatch: { active: true, token: body.token } } });

                if (player.length == 0)
                    return { "Mensagem": "O token não é válido! Por favor, faça login novamente!" };

                var GameLobby = await mongo.CollectAExpecificData("GameLobby", { ListUserIdLobby: { $all: [player[0].userid] } });
                if (GameLobby.length != 0) {
                    let index = GameLobby[0].ListUserIdLobby.findIndex(xs => xs == player[0].userid);
                    GameLobby = GameLobby[0].ListUserIdLobby.splice(index - 1, 1);
                    var result = await mongo.UpdateData("GameLobby", { CodeId: body.LobbyCode, LobbyActive: true, GameWasStarted: false }, { ListUserIdLobby: GameLobby });

                    if (result.modifiedCount != 0 && result.matchedCount != 0)
                        return { "Mensagem": "Saiu do lobby com sucesso!" };
                    else
                        return { "Mensagem": "Erro ao tentar sair do lobby!" };

                }
                else
                    return { "Mensagem": "Não se encontra em nenhum lobby! Por favor, antes de sair tente entrar!" };

            }
            else
                return { "Mensagem": "O codigo que digitou não se encontra valido!" };

        } else
            return { "Mensagem": "O token não é válido! Por favor, faça login novamente!" };
    } catch (ex) {
        console.log(ex);
        return { "Mensagem": ex.Message };
    }
}


async function DeleteLobby(body) {
    try {

        // var sa = await mongo.CollectAExpecificData("GameLobby", { GameLobbyid: body.GameLobbyid, ListUserIdLobby: { $all: [player[0].userid] } })

        var player = await mongo.CollectAExpecificData("User", { userid: body.idHoster });
        if (player.length != 0) {

            if ((await ValidToken(body.token, body.idHoster)).includes("{Mensagem:\"Token válido!\",")) {
                if ((await mongo.CollectAExpecificData("GameLobby", { GameLobbyid: body.GameLobbyid, ListUserIdLobby: { $all: [player[0].userid] } })).length != 0) {

                    //var result = await mongo.DeleteData("GameLobby", { GameLobbyid: body.GameLobbyid, ListUserIdLobby: { $all: [player[0].userid] } });
                    // Quando o hoster sai do lobby, o Lobby não é apagado, passa a lobby inativo
                    var result = await mongo.UpdateData("GameLobby", { GameLobbyid: body.GameLobbyid, CodeId: body.CodeId, LobbyActive: true, GameWasStarted: false }, { ListUserIdLobby: [], LobbyActive: false, CodeId: "." });

                    //ListUserIdLobby: [], LobbyActive: false, CodeId: "." 

                    if (result.deletedCount == 1)
                        return { "Mensagem": "Lobby apagado com sucesso!" };
                    else
                        return { "Mensagem": "Erro ao apagar o lobby!" };

                }
                else
                    return { "Mensagem": "O lobby que quer tentar apagar não existe!" };

            } else
                return { "Mensagem": "O token não é válido! Por favor, faça login novamente!" };
        }
        else
            return { "Mensagem": "O utilizador não existe! Por favor, registe o mesmo, antes de tentar criar" };

    }
    catch (ex) {
        console.log(ex);
        return { "Mensagem": "Erro ao criar o lobby!" };
    }
}
//TODO: Criar uma função para modificar o idLobby, TypeOfLobby

async function CheckNameAreValid(Username) {

    var check = !(Username.toLowerCase() == "" || Username.toLowerCase() == undefined || Username.toLowerCase() == "null" || Username.toLowerCase() == null || Username.toLowerCase() == "undefined" || Username.toLowerCase() == " " || Username.toLowerCase() == ` ` || Username.toLowerCase().includes("cpu") || Username.toLowerCase().includes("bot") || Username.toLowerCase().includes("ia") || Username.toLowerCase().includes("npc") || Username.toLowerCase().includes("player") || Username.toLowerCase().includes("jogador") || Username.toLowerCase().includes("teste") || Username.toLowerCase().includes("test") || Username.toLowerCase().includes("admin") || Username.toLowerCase().includes("adm") || Username.toLowerCase().includes("root") || Username.toLowerCase().includes("system") || Username.toLowerCase().includes("servidor") || Username.toLowerCase().includes("server") || Username.toLowerCase().includes("host") || Username.toLowerCase().includes("hospedeiro") || Username.toLowerCase().includes("hospedagem") || Username.toLowerCase().includes("hospedar") || Username.toLowerCase().includes("hospedado") || Username.toLowerCase().includes("administrador") || Username.toLowerCase().includes("administradora"));

    return check;
}

module.exports = {
    login,
    RegistarUser,
    RegistarBot,
    UpdateUser,
    DeleteUser,
    ValidToken,
    ChangePassword,
    CollectLastId,
    RegistarLobby,
    ListLobby,
    JoinLobby,
    LeaveLobby,
    DeleteLobby,
    VerBots,
    CheckNameAreValid,
    //TEST Delete after de last test
    DeleteTable,
}