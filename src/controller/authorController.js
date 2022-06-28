const authorModel = require("../model/authorModel")
//const modelBlog = require("../model/blogModel")
const jwt = require("jsonwebtoken");

const isValid = function (value) {
    if (!value || value === undefined) return false
    if (typeof value !== "string" || value.trim().length === 0) return false
    return true
}


const createAuthor = async function (req, res) {
    try {
        let authorData = req.body
        const { fname, lname, title, email, password } = authorData


        // //==========fname validation...............

        if (!isValid(fname)) { return res.status(400).send({ status: false, msg: "first name required" }) }

        let fsname = /^[a-zA-Z]{2,20}$/.test(fname.trim())
        if (!fsname) return res.status(400).send({ stats: true, msg: "enter valid first name" })


        // ============lname validation.................

        if (!isValid(lname)) { return res.status(400).send({ status: false, msg: "last name required" }) }

        let lsname = /^[a-zA-Z]{2,20}$/.test(lname.trim())
        if (!lsname) return res.status(400).send({ stats: true, msg: "enter valid last name" })

        //===================title validation=====================

        if (!isValid(title)) { return res.status(400).send({ status: false, msg: "title required" }) }

        let title1 = /^(Mr|Mrs|Miss){0,3}$/.test(title.trim())
        if (!title1) return res.status(400).send({ stats: true, msg: "enter valid title" })

        //=========================email validation=======================

        if (!isValid(email)) { return res.status(400).send({ status: false, msg: "email is required" }) }

        let mail1 = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())
        if (!mail1) return res.status(400).send({ stats: true, msg: "enter valid mail" })
        let findUser = await authorModel.find({ email: email })
        if (findUser.length !== 0) return res.status(400).send({ status: false, msg: "Email is aleardy Exist" })


        //==========================Password validation================================

        if (!isValid(password)) { return res.status(400).send({ status: false, msg: "password isrequired" }) }

        let pass = /^[a-zA-Z0-9]{6,16}$/.test(password.trim())
        if (!pass) return res.status(400).send({ stats: true, msg: "enter valid password" })



        let showAuthorData = await authorModel.create(authorData)
        res.status(201).send(showAuthorData)
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


//...............................................................login api...............................................

const loginAuthor = async function (req, res) {
    try {
        let email = req.body.email;
        let password = req.body.password;

        //email validation

        if (!isValid(email)) { return res.status(400).send({ status: false, msg: "email is required" }) }

        let mail1 = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())
        if (!mail1) return res.status(400).send({ stats: true, msg: "enter valid mail" })

        //==========================Password validation================================

        if (!isValid(password)) { return res.status(400).send({ status: false, msg: "password isrequired" }) }

        let pass = /^[a-zA-Z0-9]{6,16}$/.test(password.trim())
        if (!pass) return res.status(400).send({ stats: true, msg: "enter valid password" })


        let authorFind = await authorModel.findOne({ email: email, password: password });
        if (!authorFind)
            return res.status(400).send({ status: false, msg: "Email or  password is incorrect", });

        let token = jwt.sign(
            {
                authoRId: authorFind._id.toString(),
                batch: "radon",
                organisation: "FunctionUp",
            },
            "functionup-radon"
        );
        res.setHeader("x-api-key", token);
        res.status(201).send({ status: true, token: token });
    }
    catch (Err) {
        res.status(500).send({ status: false, msg: Err.message })
    }
}


module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor