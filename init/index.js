const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
    .then(()=> {
    console.log("connected to db");
    }).catch((err) => {
    console.log(err);
    })

const initDb = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "666412a27a24e2b8ee80fe9b"}));
    await Listing.insertMany(initData.data);
    console.log("data is initialized");
};

initDb();