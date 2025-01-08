const {mongoose} = require('mongoose');
require('dotenv').config({ path: '../.env' });
const {makeModels} = require("../models/utils/Models.util");

Models = {};

async function startDB() {
    await mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/?directConnection=true`
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


