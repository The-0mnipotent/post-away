import OtpRepository from "./otp.repository.js"

export default class otpController{
    constructor(){
        this.otprepository=new OtpRepository();
    }
   
    async send(req, res) {
        try {
            const email = req.body.email;
    
            const otpResponse = await this.otprepository.send(email);
    
            if (otpResponse.success === false) {
                return res.status(400).send("OTP send failed: " + otpResponse.message);
            }
    
            res.status(200).send("OTP sent successfully");
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
     
    async verify(req, res) {
        try {
            const otp = req.body.otp;
            const email = req.body.email;
            const resp = await this.otprepository.verify(otp, email);
    
            if (resp.success) {
                return res.status(200).send("OTP verified successfully: " + resp.message);
            } else {
                return res.status(400).send("OTP verification failed: " + resp.message);
            }
        } catch (err) {
            return res.status(500).send(err.message);
        }
    }
    
async resetpassword(req, res) {
        try {
            const email = req.body.email;
            const newpassword = req.body.newpassword;
            const result = await this.otprepository.resetpassword(email, newpassword);
            
            if (result.success) {
                res.status(200).send("Password changed successfully");
            } else {
                res.status(400).send("Password change failed: " + result.message);
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
    
}