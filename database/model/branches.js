const mongoose = require("mongoose");

const branch = new mongoose.Schema({
    branchName: {
        type: String
    }
}, {versionKey: false, timestamps: {createdAt: "createTime", updatedAt: "updateTime"}})

module.exports = mongoose.model("branches", branch, "branches")
