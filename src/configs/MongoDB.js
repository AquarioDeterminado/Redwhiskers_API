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

async function Run() {
    var s = await mongoose.connect('mongodb://root:gizmov-cavdob-nanQo7@127.0.0.1:21017/whiskers',
        {
            authSource: "admin",
        }
    ).then(
        () => {
            console.log("Connected to MongoDB");
        },
        err => {
            console.error(err);
        }
    );
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
            return mongoose.model(`Cosmetic`, {
                cosmeticid: Number, name: String, description: String, price: Number, creationDate: Date, image: String, category: String
            });
            break;
        case "Pass":
            return mongoose.model(`Pass`, {
                passid: Number, userid: Number, pass: String, salt: String, creationDate: Date, used: Boolean, tokens: Array
            });
            break;
        case "EmailChangeRequest":
            return mongoose.model(`EmailChangeRequest`, {
                EmailChangeRequestid: Number, userId: String, newEmail: String, creationDate: Date, verified: Boolean
            });
            break;
        case "PassChangeRequest":
            return mongoose.model(`PassChangeRequest`, {
                passchangerequestid: Number, userId: String, newPass: String, creationDate: Date, verified: Boolean
            });
            break;
        case "PowerUp":
            return mongoose.model(`PowerUp`, {
                powerupid: Number, name: String, description: String, creationDate: Date
            });
            break;
        default:
            break;
    }
}

async function CollectData(modelName) {
    var s = await switchModel(modelName);

    return (await s.find()).exec();
}

async function CollectAExpecificData(modelName, datajson) {
    var s = await switchModel(modelName);

    s = await s.find(datajson).exec();
    return s;
}

async function InsertData(modelName, datajson) {
    var s = await switchModel(modelName);

    // (await (new s(datajson))).save();
    var as = new s(datajson);
    (as).save();
}

async function DeleteData(modelName, datajson) {
    var s = await switchModel(modelName);

    return (await s.delete(datajson)).exec();
}

async function CollectId(modelName) {
    var s = await switchModel(modelName);
    s = await s.find({}).exec();

    if (s.length == 0)
        return 1;
    else
        return s[s.length - 1].userid + 1;
}

async function DeleteUser(modelName) {
    var s = await switchModel(modelName);
    s.deleteMany({}).exec();
}

module.exports =
{
    Run,
    CollectData,
    DeleteData,
    CollectAExpecificData,
    InsertData,
    CollectId,
    ReturnHash,
    encrypt, //temp
    salt,
    decrypt,
    DeleteUser,
}