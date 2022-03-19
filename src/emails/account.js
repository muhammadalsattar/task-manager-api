const sgMail = require('@sendgrid/mail')

const sendGridApiKey = process.env.SG_API_KEY;

sgMail.setApiKey(sendGridApiKey)

const welcomeEmail = (email, username)=>{
    sgMail.send({
        to: email,
        from: 'mmuhhhammadd@gmail.com', // Change to your verified sender
        subject: 'Welcome on board!',
        html: `<h2>Welcome ${username}! We are delighted to see you joining us.</h2>`,
    })
}

const goodbyeEmail = (email, username)=>{
    sgMail.send({
        to: email,
        from: 'mmuhhhammadd@gmail.com', // Change to your verified sender
        subject: 'Sorry to see you leave',
        html: `<h2>${username}, We are sorry to see you leave! Tell us why are you leaving.</h2>`,
    })
}

module.exports = {welcomeEmail, goodbyeEmail}