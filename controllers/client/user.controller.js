const User = require("../../models/user.model");
const md5 = require("md5");
const generateHelper = require("../../helpers/generate.helper");

module.exports.register = async (req, res) => {
    try {

        const existEmail = await User.findOne({
            email: req.body.email,
            deleted: false
        });

        if(existEmail){
            res.json({
                code: 400,
                message: "Email đã tồn tại!"
            });

            return;
        }

        const token = generateHelper.generateRandomString(30);
        
        const dataUser = {
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            token: md5(token)
        };

        const user = new User(dataUser);
        await user.save(); 

        res.json({
            code: 200,
            message: "Đăng ký thành công!",
            token: token
        });

    } catch (error) {
        res.json({
            message: "Not found"
        });
    }
}

module.exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(!user){
        res.json({
            code: 400,
            message: "Email không tồn tại!"
        });
        return;
    }

    if(md5(password) != user.password){
        res.json({
            code: 400,
            message: "Sai mật khẩu!"
        });
        return
    }

    res.json({
        code: 200,
        message: "Đăng nhập thành công!",
        token: user.token
    })
}