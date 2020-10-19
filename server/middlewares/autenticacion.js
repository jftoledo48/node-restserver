const jwt = require('jsonwebtoken');


// =====================
// Verificar Token
// =====================
let verificaToken = (req, res, next) => {

    let token = req.get('token');
    //console.log(token);

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        //console.log(decoded);

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.data;
        next();

    });



};

// =====================
// Verifica AdminRole
// =====================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
    //console.log(usuario);

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};

// =====================
// Verificar Token para imagen
// =====================
let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;
    //console.log(token);

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        //console.log(decoded);

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.data;
        next();

    });

};


module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}