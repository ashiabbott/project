const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // Configure with your email service details
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

exports.sendEmail = options => {
  const mailOptions = {
    from: 'Your App <no-reply@yourapp.com>',
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  return transporter.sendMail(mailOptions);
};
