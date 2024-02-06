import nodemailer from 'nodemailer';

/**
 * 
 * @param {objet} veterinarioGuardado 
 */
const emailOlvidePassword = async (datos) =>{

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
        subject: 'Restablece tu Password',
        text: 'Restablece tu Password',
        html: `<p>Hola: ${nombre}, has solicitado restablecer tu password.</p>
               <p>Click en el enlace para generar un nuevo Password:</p>
               <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Password</a>

               <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje.</p>
        `,
      })
      console.log("mensaje enciado : %s, ", info.messageId);


}

export default emailOlvidePassword;