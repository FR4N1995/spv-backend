import express from 'express';
import {registrar, perfil, actualizarPassword, confirmar, actualizarPerfil, autenticar, olvidePassword, comprobarToken, nuevoPassword} from '../controllers/veterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', registrar);
router.get("/confirmar/:token", confirmar);
router.post("/login", autenticar);
router.post('/olvide-password', olvidePassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);
// la linea de arriba es lo mismo que las dos de abajo
// router.get('/olvide-password/:token', comprobarToken);
// router.post('/olvide-password/:token', nuevoPassword);


// area Privada
router.get("/perfil", checkAuth, perfil );
router.put("/perfil/:id", checkAuth, actualizarPerfil);
router.put("/cambiar-password", checkAuth, actualizarPassword);


export default router;