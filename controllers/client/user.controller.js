const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const md5 = require("md5");
const generateHelper = require("../../helpers/generate.helper");
const sendMailHelper = require("../../helpers/sendEmail.helper");

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

    if(md5(password) != md5(user.password)){
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

module.exports.forgotPassword = async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(!user){
        res.json({
            code: 400,
            message: "Email không tồn tại trong hệ thống!"
        });
        return;
    }

    const otp = generateHelper.generateRandomNumber(6);

    // Save email, OTP in database
    const forgotPasswordData = {
        email: email,
        otp: otp,
        expireAt: Date.now() + 3 * 60 * 1000
    }

    const forgotPassword = new ForgotPassword(forgotPasswordData);
    await forgotPassword.save();

    // Send OTP through email to user
    const subject = "Mã OTP lấy lại mật khẩu";
    const htmlSendMail = `Mã OTP xác thực của bạn là <b style="color: green;">${otp}</b>. Mã OTP có hiệu lực trong 3 phút. Vui lòng không cung cấp mã OTP cho người khác.`;
    sendMailHelper.sendMail(email, subject, htmlSendMail);

    res.json({
        code: 200,
        message: "Đã gửi mã OTP qua email!"
    })
}

module.exports.otpPassword = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if(!result){
        res.json({
            code: 400,
            message: "OTP không hợp lệ!"
        });
        return;
    }

    const user = await User.findOne({
        email: email
    });

    res.json({
        code: 200,
        message: "Xác thực thành công!",
        token: user.token
    })
}