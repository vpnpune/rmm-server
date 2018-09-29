import nodemailer from "nodemailer";

var transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "<userName>",
            pass: "<password>"
        }
});

export function sendMail(subject, body) {

    var options = {
        from: "pankaj.saboo@test.com",
        replyTo: "pankaj.saboo@synerzip.com",
        to: "pankaj.saboo08@gmail.com",
        subject: subject,
        html: body
    };

    transport.sendMail(options, function (err, responseStatus) {
        if (err) {
          return console.error(err)
        }
        console.log(responseStatus)
      });
}