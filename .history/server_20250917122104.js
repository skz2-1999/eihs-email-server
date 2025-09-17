const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Your Namecheap SMTP configuration.
//
// The following configuration caused a "Connection Timeout" error.
// Please try one of the two alternatives below by uncommenting the code.
//
// Note: Only uncomment one of the options at a time and then try to test it.
//
const SMTP_CONFIG = {
    host: 'mail.eihs.ae',
    port: 465,
    secure: true,
    auth: {
        user: 'learning@eihs.ae',
        pass: 'Learning1234@#@#'
    }
};

/* --- Alternative Option 1: Use privateemail.com host ---
const SMTP_CONFIG = {
    host: 'mail.privateemail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'learning@eihs.ae',
        pass: 'Learning1234@#@#'
    }
};
*/

/* --- Alternative Option 2: Use port 587 with TLS ---
const SMTP_CONFIG = {
    host: 'mail.eihs.ae', // You can also try 'mail.privateemail.com' here
    port: 587,
    secure: false, // TLS requires secure to be false
    auth: {
        user: 'learning@eihs.ae',
        pass: 'Learning1234@#@#'
    },
    tls: {
        ciphers: 'SSLv3'
    }
};
*/

// API endpoint to send email
app.post('/send-email', async (req, res) => {
    try {
        const { to, subject, body } = req.body;
        if (!to || !subject || !body) {
            return res.status(400).send({ error: 'Missing fields' });
        }

        let transporter = nodemailer.createTransport(SMTP_CONFIG);

        await transporter.sendMail({
            from: `"EIHS" <${SMTP_CONFIG.auth.user}>`,
            to,
            subject,
            text: body
        });

        res.send({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to send email', details: err.toString() });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Email server running on port ${PORT}`));