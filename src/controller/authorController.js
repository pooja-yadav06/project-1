const authorModel = require("../model/authorModel")
//const modelBlog = require("../model/blogModel")
const jwt = require("jsonwebtoken");


const createAuthor = async function (req, res) {

    try {
        let authorData = req.body
        let fname = authorData.fname
        //==========fname validation...............
        if (!fname || fname == undefined) return res.status(400).send({ status: false, msg: "first name is required" })
        if (typeof fname !== "string" || fname.trim().length === 0) return res.status(400).send({ status: false, msg: "first name should be string and should not contain spaces" })

        let fsname = /^[a-zA-Z]{2,20}$/.test(fname.trim())
        if (!fsname) return res.status(400).send({ stats: true, msg: "enter valid first name" })


        // ============lname validation.................
        let lname = authorData.lname
        if (/*!lname */ lname == undefined) return res.status(400).send({ status: false, msg: "last name is required" })
        if (typeof lname !== "string" || lname.trim().length === 0) return res.status(400).send({ status: false, msg: "last name should be string and should not contain spaces" })

        let lsname = /^[a-zA-Z]{2,20}$/.test(lname.trim())
        if (!lsname) return res.status(400).send({ stats: true, msg: "enter valid last name" })

        //===================title validation=====================
        let title = authorData.title
        if (!title || title == undefined) return res.status(400).send({ status: false, msg: "title is required" })
        if (typeof title !== "string" || title.trim().length === 0) return res.status(400).send({ status: false, msg: "title should be string and should not contain spaces" })

        let ltitle = /^(Mr|Mrs|Miss){0,3}$/.test(title.trim())
        if (!ltitle) return res.status(400).send({ stats: true, msg: "enter valid title" })

        //=========================email validation=======================
        let email1 = authorData.email
        if (!email1 || email1 == undefined) return res.status(400).send({ status: false, msg: "email is required" })
        if (typeof email1 !== "string" || email1.trim().length === 0) return res.status(400).send({ status: false, msg: "email should be string and should not contain spaces" })

        let mail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email1.trim())
        if (!mail) return res.status(400).send({ stats: true, msg: "enter valid mail" })
        let findUser = await authorModel.find({email:email1})
        if (findUser.length!=0) return res.status(400).send({ status: false, msg: "Email is aleardy Exist" })


        //==========================Password validation================================
        let password = authorData.password
        if (!password || password == undefined) return res.status(400).send({ status: false, msg: "password is required" })
        if (typeof password !== "string" || password.trim().length === 0) return res.status(400).send({ status: false, msg: "password should be string and should not contain spaces" })

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
    
        if (!email || email == undefined) return res.status(400).send({ status: false, msg: "email is required" })
        if (typeof email !== "string" || email.trim().length === 0) return res.status(400).send({ status: false, msg: "email should be string and should not contain spaces" })

        let mail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())
        if (!mail) return res.status(400).send({ stats: true, msg: "enter valid mail" })
      


        //==========================Password validation================================
     
        if (!password || password == undefined) return res.status(400).send({ status: false, msg: "password is required" })
        if (typeof password !== "string" || password.trim().length === 0) return res.status(400).send({ status: false, msg: "password should be string and should not contain spaces" })

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
        res.status(500).send({ status: false, msg: Err.message})
        }
    }


module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor