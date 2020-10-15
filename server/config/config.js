// =======================================================
// Puerto: Config of port Developer and Production Ambient
// =======================================================

process.env.PORT = process.env.PORT || 3000

// ====================================
// Enviroment: Define enviroment to use
// ====================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ====================================
// Vencimiento del token
// ====================================

process.env.CADUCIDAD_TOKEN = 60*60*24*30

// ====================================
// SEED de autenticación
// ====================================

process.env.SEED = process.env.SEED || 'seed-de-desarrollo';

// ===================================
// DATA BASSE: Define url to conection
// ===================================

let urlDB;
if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;


// ===================================
// CLIENT ID Google
// ===================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '235427841687-mjob0uujmfggja8u8rbpia8h6ro8ts53.apps.googleusercontent.com';