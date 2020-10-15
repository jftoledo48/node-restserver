const express = require('express');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();

app.get('/usuarios', verificaToken, function (req, res) {
    
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 0;
    limite = Number(limite);

    Usuario.find({estado: true}, 'nombre email estado role google ')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({estado:true}, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            })

        });
    //res.json('get Usuario');
});

app.post('/usuarios', [verificaToken, verificaAdmin_Role], function (req, res) {
    let body = req.body;
    console.log(body);

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
    
    // if(body.nombre === undefined){
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es necesario'
    //     });
    // } else {
    //     res.json({
    //         persona: body
    //     });
    // }
    
});

app.put('/usuarios/:id', [verificaToken, verificaAdmin_Role], function (req, res) {
    let id = req.params.id;
    // Esta funcion permite que solo los campos acá definidos se actualicen.
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']) ;

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) =>{
        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
    
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/usuarios/:id', [verificaToken, verificaAdmin_Role], function (req, res) {
    let id = req.params.id;
    
    // Esta funcion permite que solo los campos acá definidos se actualicen.
    let body = _.pick(req.body, ['estado']);
    body.estado = false;

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) =>{
        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
    
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) =>{

    //     if (err){
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     };

    //     if (!usuarioBorrado){
    //         return res.status(400).json({
    //             ok: false,
    //             err:{
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     }
    
    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });
    // });

    //res.json('delete Usuario');
});

module.exports = app;