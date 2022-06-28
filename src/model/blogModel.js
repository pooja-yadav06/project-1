
const mongoose = require('mongoose');
const ObjectId=mongoose.Types.ObjectId
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        type: ObjectId,
        required:true,
        ref: "author1"
    },
    tags:{
        type: [String],
    },
    category: {
        type: [String],
        required: true
    },
    subcategory:{
        type: [String],
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    publishedAt:{
        type:Date,
        default:null
    },
    deletedAt:{
        type:Date,
        default:null
    }


}, { timestamps: true });


module.exports = mongoose.model('blog', blogSchema) 