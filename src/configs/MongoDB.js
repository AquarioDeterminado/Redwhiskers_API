const mongoose = require('mongoose');
const crypto = require('crypto');

//#region  Crypto
async function salt() {
    // Generate a random salt
    return crypto.randomBytes(32).toString('hex')
}

async function ReturnHash(password, salt) {
    // Hash the password with the salt
    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, 'sha512') // PBKDF2 for key derivation
        .toString('hex');

    return hash;
}

function encrypt(text) {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from("93f5e5439e2d4a9c70e51c1a4b78c8a3d2e6a3f4b791c8f12b3e74d9a3f9e2b1", 'hex'), Buffer.from("9a5d4c3f7e8a9c2b3e4f1d6a8b7c9e0f", 'hex'));
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Função para desencriptar
function decrypt(encryptedData) {
    const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from("93f5e5439e2d4a9c70e51c1a4b78c8a3d2e6a3f4b791c8f12b3e74d9a3f9e2b1", 'hex'),
        Buffer.from("9a5d4c3f7e8a9c2b3e4f1d6a8b7c9e0f", 'hex')
    );
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

//#endregion

//#region Simple Requests MongoDB 

async function Run() {
    //https://mongoosejs.com/docs/connections.html#replicaset_connections
    //https://mongoosejs.com/docs/connections.html#multiple_connections
    var s = await mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/?directConnection=true`,
    ).then(
        () => {
            console.log("Connected to MongoDB");
        },
        err => {
            console.error(err);
        }
    );
    //,127.0.0.1:21018/whiskers
    console.log("Connected to MongoDB");
}

async function switchModel(modelName) {
    switch (modelName) {
        case "User":
            // return mongoose.model.User || mongoose.model(`User`, {
            //     userid: Number, username: String, email: String, inventory: Array, panda: Array, scores: Array, powerUpStats: Array, questProgress: Array
            // });
            return require('../models/User.model.js').makeModel();
            break;
        case "Cosmetic":
            return require('../models/Cosmetic.model.js').makeModel();
            break;
        case "Pass":
            return require('../models/Pass.model.js').makeModel();
            break;
        case "EmailChangeRequest":
            return require('../models/EmailChangeRequest.model.js').makeModel();
            break;
        case "PassChangeRequest":
            return require('../models/PassChangeRequest.model.js').makeModel();
            break;
        case "PowerUp":
            return require('../models/PowerUp.model.js').makeModel();
            break;
        case "GameLobby"://GameLobby.models.js
            return require('../models/GameLobby.model.js').makeModel();
            break;
        case "Bot":
            return require('../models/Bot.model.js').makeModel();
            break;
        default:
            break;
    }
}
async function CollectData(modelName) {
    var s = await switchModel(modelName);

    return (await s.find({}));
}

async function CollectAExpecificData(modelName, datajson) {
    var s = await switchModel(modelName);

    s = await s.find(datajson).exec();
    return s;
}

async function InsertData(modelName, datajson) {
    var s = await switchModel(modelName);

    // (await (new s(datajson))).save();

    if (!((JSON.stringify(datajson)).replace(/ /g, '').replace(/[<>\/'"]+/g, '')).includes("{$ne:" || "{$where:")) {
        var as = new s(datajson);
        (as).save();
        return "Greenlight";
    }
    else
        return "Redlight";
}

async function DeleteData(modelName, datajson) {
    var s = await switchModel(modelName);

    var as = await s.find(datajson).exec();
    as = await s.deleteOne(datajson);

    return as;
}

async function UpdateData(modelName, datajson, datajson2) {
    var s = await switchModel(modelName);

    //TODO: VERIFICAR PORQUE É QUE ELE NÃO ESTÁ A ATUALIZAR! 
    var asasa = await s.find(datajson).exec();

    var as = await s.updateOne(datajson, datajson2);

    return as;
}


async function CollectId(modelName) {
    var s = await switchModel(modelName);
    s = await s.find({}).exec();

    if (s.length == 0)
        return 1;
    else if (modelName == "User")
        return s[s.length - 1].userid + 1;
    else if (modelName == "GameLobby")
        return s[s.length - 1].GameLobbyid + 1;
    else if (modelName == "Pass")
        return s[s.length - 1].passid + 1;
    else if (modelName == "Bot")
        return s[s.length - 1].Botid + 1;
}

async function DeleteTable(modelName) {
    var s = await switchModel(modelName);
    s.deleteMany({}).exec();
}

//#endregion

//#region Token

async function Createtoken() {
    var token = crypto.randomBytes(40).toString('hex');

    if (await CollectAExpecificData("Pass", { tokens: token }).length > 0 && await CollectAExpecificData("Bot", { token: token }).length > 0)
        Createtoken();
    else
        return token;
}

//#endregion

//#region Create CodeIdLobby
async function CodeIdLobby() {
    return crypto.randomBytes(12).toString('hex');
}

module.exports =
{
    Run,
    CollectData,
    DeleteData,
    UpdateData,
    CollectAExpecificData,
    InsertData,
    CollectId,
    ReturnHash,
    encrypt,
    salt,
    decrypt,
    DeleteTable,
    Createtoken,
    CodeIdLobby,
}