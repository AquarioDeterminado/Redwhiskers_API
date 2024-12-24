const mongoose = require('mongoose');



async function load() {


    var s = await mongoose.connect('mongodb://root:gizmov-cavdob-nanQo7@127.0.0.1:27017,127.0.0.1:27018/db',
        {
            authSource: "admin"
        }
    ).then(
        () => {
            console.log("Connected to MongoDB");
        },
        err => {
            console.error(err);
        }
    );
    
    
    // await mongoose.connect('mongodb://root:gizmov-cavdob-nanQo7@127.0.0.1:21017/whiskers');
    console.log("Connected to MongoDB");
    
    console.log("Creating Schema");
    var s = mongoose.model(`User`, {
        username: String, email: String, inventory: Array, panda: Array, scores: Array, powerUpStats: Array, questProgress: Array
    });
    var aas = await s.findOne({ username: "Andre" }).exec();

    console.log("Creating User");

    await s.deleteMany({}).exec();
    (new s({ username: "Andre", email: "@", inventory: [], panda: [], scores: [], powerUpStats: [], questProgress: [] })).save();
    // (new s({ username: "Andre", email: "abd@", inventory: [], panda: [], scores: [], powerUpStats: [], questProgress: [] })).save();

    console.log("Waiting 5 seconds");
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Finding User");
    // s = s.findOne({}).exec();

    // const value = await s.findOne({ username: "Andre" }).exec();
    var ad =  mongoose.models.User || mongoose.model(`User`, {
        username: String, email: String, inventory: Array, panda: Array, scores: Array, powerUpStats: Array, questProgress: Array
    });
    const value = await ad.find({ username: "Andre" }).exec();
    console.log("User found:", value);


    //Delete username mongodb


    console.log("Deleting User");
    // await ad.deleteOne({ username: "Andre" }).exec();
    await new Promise(resolve => setTimeout(resolve, 2000));


    var aas = await ad.findOne({ username: "Andre" }).exec();
    console.log("User found:", aas);
}

load();