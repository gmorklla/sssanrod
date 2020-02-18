import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });
admin.initializeApp();

/**
 * Here we're using Gmail to send
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `${functions.config().nodemailer.user}`,
    pass: `${functions.config().nodemailer.pass}`
  }
});

export const contacto = functions.https.onRequest((request, response) => {
    if (request.method === 'POST') {
        cors(request, response, () => {
            const { nombre, apellidos, asunto, telefono, mensaje } = request.body;
          // getting dest email by query string
          const dest = 'gmorklla@gmail.com';

          const mailOptions = {
            from: '<noreply@domain.com>',
            to: dest,
            subject: "Mensaje desde forma de contacto",
            html: `<p><b>Nombre: </b>${nombre} ${apellidos}</p>
                      <p><b>Asunto: </b>${asunto}</p>
                      <p><b>Teléfono: </b>${telefono}</p>
                      <p><b>Mensaje: </b>${mensaje}</p>`
          };

          // returning result
          return transporter.sendMail(mailOptions, (err: any) => {
            if (!!err) {
              return response.send(err.toString());
            }
            return response.send('Sended');
          });
        });
    } else {
        response.status(404).send('Recurso no encontrado');
    }
});
