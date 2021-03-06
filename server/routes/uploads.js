const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use( fileUpload({ useTempFiles: true }) );

app.put('/upload/:tipo/:id', function(req, res) {

  let id = req.params.id;
  let tipo = req.params.tipo;

  if (!req.files || Object.keys(req.files).length === 0) {
    //return res.status(400).send('No files were uploaded.');
    return res.status(400).json({
        ok: false,
        err: {
            message: 'No se ha seleccionado ningún archivo'
        }
    });
  }

  // Valida tipo
  let tiposValidos = ['productos', 'usuarios'];

  if(tiposValidos.indexOf(tipo)<0){
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Los tipos permitidos son ' + tiposValidos.join(', '),
        tipo
      }
    })
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let archivo = req.files.archivo;

  // Extensiones permitidas:
  let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

  let nombreCortado =archivo.name.split('.');
  let extension = nombreCortado[nombreCortado.length -1];

  if(extensionesValidas.indexOf(extension)<0){
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
        ext: extension
      }
    })
  }

  // Cambiar nombre al archivo
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  // Use the mv() method to place the file somewhere on your server
  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, function(err) {
    if (err){
        //return res.status(500).send(err);
        return res.status(500).json({
            ok: false,
            err
        });
    }
    if(tipo === 'usuarios'){
      imagenUsuario(id, res, nombreArchivo);
    } else {
      imagenProducto(id, res, nombreArchivo);
    }

    // res.send('File uploaded!');
    // return res.status(500).json({
    //     ok: true,
    //     message: 'Archivo cargado correctamente.'
    // });
  });
});

function imagenUsuario(id, res, nombreArchivo){
  Usuario.findById(id, (err, usuarioDB) => {

    if (err){
      //return res.status(500).send(err);
      borrarArchivo(nombreArchivo, 'usuarios');
      return res.status(500).json({
          ok: false,
          err
      });
    }

    if(!usuarioDB){
      //return res.status(500).send(err);
      borrarArchivo(nombreArchivo, 'usuarios');
      return res.status(500).json({
        ok: false,
        err: {
          message: 'Usuario no existe'
        }
      });
    }

    borrarArchivo(usuarioDB.img, 'usuarios');

    usuarioDB.img = nombreArchivo;

    usuarioDB.save ((err, usuarioGuardado) => {
      if (err){
        //return res.status(500).send(err);
        return res.status(500).json({
            ok: false,
            err
        });
      }

      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo
      });
    });


  });
}

function imagenProducto(id, res, nombreArchivo) {

  Producto.findById(id, (err, productoDB) => {

      if (err) {
          borrarArchivo(nombreArchivo, 'productos');

          return res.status(500).json({
              ok: false,
              err
          });
      }

      if (!productoDB) {

          borrarArchivo(nombreArchivo, 'productos');

          return res.status(400).json({
              ok: false,
              err: {
                  message: 'Usuaro no existe'
              }
          });
      }

      borrarArchivo(productoDB.img, 'productos');

      productoDB.img = nombreArchivo;
      console.log(nombreArchivo);

      productoDB.save((err, productoGuardado) => {

          res.json({
              ok: true,
              producto: productoGuardado,
              img: nombreArchivo
          });

      });


  });


}

function borrarArchivo(nombreArchivo, tipo){
  // Verificar ruta del archivo y si este existe
  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);
  if (fs.existsSync(pathImagen)){
    fs.unlinkSync(pathImagen);
  }
}

module.exports = app;