//node mailer
const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {
  //1) create transporter (service that will send emails like gmail , mailgun , mailtrap , sendgrid)
  const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secure false 587
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASS, // generated ethereal password
    },
  });

  //4) define mail options (like from, to, subject, body)
  const mailOptions = {
    from: `Where To Go App${process.env.EMAIL_USER}`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    html: options.message, // plain text body
  };

  await transporter.sendMail(mailOptions);
  //2)define email options (like from , to , subject , body)
  //3) send email to user
};

module.exports = sendEmail;
