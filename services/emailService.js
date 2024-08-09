const nodemailer = require('nodemailer');
const path = require('path');
const pug = require('pug');
const { convert } = require('html-to-text');


module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.name = user.name;
        this.url = url;
        this.from = `PhoneBook app <${process.env.SENDGRID_FROM}>`
    }

    _initTransport() {
        if (process.env.NODE_ENV === 'production') {
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_APIKEY
                }
            })
            
        }
        return nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "3a3bc08a73eba0",
                pass: "d0a36fbabf917d"
            }
        });
    }
   
    async _send(template, subject) {
        const html = pug.renderFile(path.join(__dirname, '..', 'views', 'emails', `${template}.pug`), {
            name: this.name,
            url: this.url,
            subject,
        })
        const emailConfig = {
            from: 'PhoneBook app',
            to: this.to,
            subject,
            html,
            text: convert(html)
        }
        await this._initTransport().sendMail(emailConfig)
    }

    async sendHello() {
        await this._send('hello', 'Welcome to our website')
    }

    async sendRestorePassword() {
        await this._send('passwordReset', 'Password reset instructions')
    }
};