const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore(); //reemplaza las partes de codigo donde se llama a la base de datos

module.exports = { admin, db };


