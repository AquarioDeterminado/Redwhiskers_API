const {mongoose} = require('mongoose');
const {makeModels} = require("../models/utils/Models.util");

Models = {};

async function startDB() {
    await mongoose.connect('mongodb://' + process.env.MONGO_USR + ':' + process.env.MONGO_PASS + '@' + process.env.MONGO_HOST + ":" + process.env.MONGO_PORT + '/' + process.env.MONGO_DB,
        {
            authSource: "admin",
        }
        ).then(
        () => {
            console.log('Connected to MongoDB');
            makeModels().then((models) => {
                Models = models;
                console.log('Models created');
            }).catch((err) => {
                console.error(err);
            });
        },
        err => {
            console.error(err);
        }
    );
}

module.exports = {startDB, Models}


