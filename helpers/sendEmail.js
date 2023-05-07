const nodemailer = require("nodemailer");
require("dotenv").config();

const { EMAIL_FROM, EMAIL_PASSWORD } = process.env;

const config = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_FROM,
    pass: EMAIL_PASSWORD,
  },
};
const transporter = nodemailer.createTransport(config);

const sendEmail = async (data) => {
  const emailOptions = {
    ...data,
    from: EMAIL_FROM,
  };
  await transporter.sendMail(emailOptions);
  return true;
};

module.exports = sendEmail;
