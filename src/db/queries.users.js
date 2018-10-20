const User = require("./models").User;
const bcrypt = require("bcryptjs");
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    createUser(newUser, callback) {
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);

        return User.create({
            username: newUser.username,
            email: newUser.email,
            password: hashedPassword
        })
        .then((user) => {

          const msg = {
            to: newUser.email,
            from: "admin@Blocipedia.com",
            subject: "Welcome to Blocipedia",
            html:
              '<strong>Welcome to Blocipedia</strong> <br> <a href="https://darccide-blocipedia.herokuapp.com/">Start your new Wikis today.</a>'
          };

            sgMail.send(msg);

            callback(null, user);
        })
        .catch((err) => {
            callback(err);
        })
    }
};