/*jshint esversion: 8*/
const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: `${process.env.APP_EMAIL}`,
    pass: `${process.env.APP_PASS}`,
  },
});

const verifyEmail = async (firstN, lastN, email, token) => {
  try {
    const url = `${process.env.LINK_ADDRESS}/auth/confirm/${email}/${token}`;

    const info = await transporter.sendMail({
      from: "easyhelp.com@gmail.com",
      to: email,
      subject: `Email Verification`,
      "html": `Hello ${firstN} ${lastN}! Please click the link to confirm your email: <a href="${url}"> ${url}</a> `,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = verifyEmail;
