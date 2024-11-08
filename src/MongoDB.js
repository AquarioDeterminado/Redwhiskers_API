const mongoose = require('mongoose');



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
    await mongoose.connect('mongodb://root:gizmov-cavdob-nanQo7@127.0.0.1:21017/whiskers');
    console.log("Connected to MongoDB");
}

async function switchModel(modelName) {
    switch(modelName){
        case "User":
            return mongoose.model(`User`, {
                username: String, email: String, inventory: Array, panda: Array, scores: Array, powerUpStats: Array, questProgress: Array
            });
        break;
        

            break;
        default:
            break;
    }
}

async function CollectData(modelName){
    var s = switchModel(modelName);

    return (await s.find()).exec();
}

async function CollectAExpecificData(modelName, datajson){
    var s = switchModel(modelName);

    return (await s.findOne(datajson)).exec();
}

async function InsertData(modelName, datajson){
    var s = switchModel(modelName, "");

    return (await (new s(data))).save();
}

async function DeleteData(modelName, datajson){
    var s = switchModel(modelName);

    return (await s.delete(datajson)).exec();
}

module.exports =
{
    Run,
    CollectData,
    DeleteData,
    CollectAExpecificData,
    InsertData,
}