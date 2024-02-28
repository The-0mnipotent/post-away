import mjml2html from "mjml";
import nodemailer from "nodemailer";

export async function sendMail(otp, email) {
  // console.log("process.env.user",process.env.user,"process.env.pass",process.env.pass);
  var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  });

  const mjmlTemplate = `
        <mjml>
            <mj-body background-color="#fafbfc">
                <mj-section padding-bottom="20px" padding-top="20px">
                    <mj-column vertical-align="middle" width="100%">
                    </mj-column>
                </mj-section>
                <mj-section background-color="#fff" padding-bottom="20px" padding-top="20px">
                    <mj-column vertical-align="middle" width="100%">
                        <mj-text align="center" font-size="16px" font-family="open Sans Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px">
                            <span>Hello,</span>
                        </mj-text>
                        <mj-text align="center" font-size="16px" font-family="open Sans Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px">
                            Please use the verification code below to update your new Password This is your OTP:
                        </mj-text>
                        <mj-text align="center" font-size="24px" background-color="#20c997" font-weight="bold" font-family="open Sans Helvetica, Arial, sans-serif">
                            ${otp}
                        </mj-text>
                        <mj-text align="center" font-size="16px" font-family="open Sans Helvetica, Arial, sans-serif" padding-left="25px" padding-right="16px">
                            If you didn't request this, you can ignore this email or let us know.
                        </mj-text>
                        <mj-text align="center" font-size="16px" font-family="open Sans Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px">
                            Thanks!
                        </mj-text>
                    </mj-column>
                </mj-section>
            </mj-body>
        </mjml>
    `;

  const { html } = mjml2html(mjmlTemplate);

  const mailOptions = {
    from: "arpitsingh92741@gmail.com",
    to: email,
    subject: "Password Reset otp",
    html: html,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (err) {
    console.log("Email send failure with error: " + err);
  }
}
