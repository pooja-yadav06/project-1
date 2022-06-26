//const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken");
const blogModel = require("../model/blogModel");

const mid1 = async function (req, res, next) {
    let token = req.headers["X-Api-Key"];
    if (!token) token = req.headers["x-api-key"];

    if (token) {
        next()
    }
    else { return res.send({ status: false, msg: "token must be present" }); }
}


const mid2 = async function (req, res, next) {
    let token = req.headers["x-api-key"];
    if (!token) token = req.headers["x-api-key"];

    let decodedToken = jwt.verify(token, 'functionup-radon')

    if (!decodedToken) return res.send({ status: false, msg: "token is not valid" })
    blogToBeModified = req.params.blogId
    let blogData = await blogModel.findById(blogToBeModified)
    let authId = blogData.authorId
    let userLoggedIn = decodedToken.authoRId
    if (authId == userLoggedIn) {
        next()
    } else { return res.send({ status: false, msg: 'User logged is not allowed to modify the requested users data' }) }
}


const mid3 = async function (req, res, next) {
    let token = req.headers["x-api-key"];
    if (!token) token = req.headers["x-api-key"];

    let decodedToken = jwt.verify(token, 'functionup-radon')

    if (!decodedToken) return res.send({ status: false, msg: "token is not valid" })

    let authorid = req.query.authorId;
    let Category = req.query.category;
    let Subcategory = req.query.subcategory;
    let tag = req.query.tags;
    let unpublished = req.query.isPublished
    let blogData = await blogModel.findOne({$or:[{authorId:authorid},{isPublished:unpublished},{category:Category},{tags:tag},{subcategory:Subcategory}]})
    let authId = blogData.authorId
    console.log(authId)
    let userLoggedIn = decodedToken.authoRId
    console.log(userLoggedIn)
    if (authId == userLoggedIn) {
        let del=blogData.isDeleted
        console.log(del)
    if(del){
        return res.status(400).send({status:false,msg:"data is already deleted"})
    }
        next()
    } else { return res.send({ status: false, msg: 'User logged is not allowed to modify the requested users data' }) }
}







module.exports.mid1 = mid1
module.exports.mid2 = mid2
module.exports.mid3 = mid3

