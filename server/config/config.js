// =======================================================
// Puerto: Config of port Developer and Production Ambient
// =======================================================

process.env.PORT = process.env.PORT || 3000

// ====================================
// Enviroment: Define enviroment to use
// ====================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

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
