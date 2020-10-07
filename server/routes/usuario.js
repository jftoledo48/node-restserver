const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();

app.get('/usuarios', function (req, res) {
    res.json('get Usuario');
});
app.post('/usuarios', function (req, res) {
    let body = req.body;

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

app.put('/usuarios/:id', function (req, res) {
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

app.delete('/usuarios', function (req, res) {
    res.json('delete Usuario');
});

module.exports = app;