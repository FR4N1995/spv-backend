import nodemailer from 'nodemailer';

/**
 * 
 * @param {object} veterinarioGuardado 
 */
const emailRegistro = async (datos) =>{

    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const {email, nombre, token} = datos
      // Enviar el email

      const info = await transport.sendMail({
        from: 'APV administrador de Pacientes de Veterinaria',
        to: email,
        subject: 'Comprueba tu cuenta en APV',
        text: 'Comprueba tu cuenta en APV',
        html: `<p>Hola: ${nombre}, comprueba tu cuenta en APV.</p>
               <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:</p>
               <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
        `,
      })
      console.log("mensaje enciado : %s, ", info.messageId);


}

export default emailRegistro;