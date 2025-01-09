const mongoose = require('mongoose');
const CryptoJS = require("crypto-js");
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
    const cryptkey = CryptoJS.enc.Utf8.parse('93f5e5439e2d4a9c70e51c1a4b78c8a3d2e6a3f4b791c8f12b3e74d9a3f9e2b1');

    // Encrypt the plaintext using AES
    let encrypted = CryptoJS.AES.encrypt(text, '93f5e5439e2d4a9c70e51c1a4b78c8a3d2e6a3f4b791c8f12b3e74d9a3f9e2b1');

    // Convert the encrypted data to a Base64 string
    let encryptedData = encrypted.toString();

    return encryptedData;
}

// Função para desencriptar
function decrypt(encryptedData) {
    const cryptkey = CryptoJS.enc.Utf8.parse('93f5e5439e2d4a9c70e51c1a4b78c8a3d2e6a3f4b791c8f12b3e74d9a3f9e2b1');
    const crypted = CryptoJS.enc.Base64.parse(encryptedData);

    let decrypt = CryptoJS.AES.decrypt(encryptedData, '93f5e5439e2d4a9c70e51c1a4b78c8a3d2e6a3f4b791c8f12b3e74d9a3f9e2b1');

    let originalText = decrypt.toString(CryptoJS.enc.Utf8);

    return originalText;
}

//#endregion

//#region Simple Requests MongoDB 

async function Run() {
    //https://mongoosejs.com/docs/connections.html#replicaset_connections
    //https://mongoosejs.com/docs/connections.html#multiple_connections
    //    var s = await mongoose.connect('mongodb://root:gizmov-cavdob-nanQo7@127.0.0.1:27017,127.0.0.1:27018/db',
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