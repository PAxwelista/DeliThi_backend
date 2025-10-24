const fs = require("fs");
const path = require("path");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API);

const sendCode = async (to, code , template) => {
    const templatePath = path.join(__dirname, "templates", template);
    let html = fs.readFileSync(templatePath, "utf8");

    html = html.replace("{{code}}", code);

    const { data, error } = await resend.emails.send({
        from: "auth@delithi.ovh",
        to: [to],
        subject: "DeliThi : vérification Email",
        html,
    });

    return { data, error };
};

module.exports = sendCode;
