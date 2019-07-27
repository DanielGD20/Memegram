const functions = require("firebase-functions");
const app = require("express")();
/*
METODOS AYUDANTES PARA HACER LAS VALIDACIONES DE EMAILS 
*/
const FBAuth = require("./util/fbAuth");
//------------------------Importante, Registro de usuarios de la red social-------------------------
//Ruta de inicio de session
const { signUp, login } = require("./handlers/users");
app.post("/signUp", signUp);
app.post("/login", login);

//------------------------------Screams-------------------------------------------------------------

//Este metodo sirve para obtener los ingresos de usuarios dentro de la base de datos utilizando express
const { getAllScreams, setScreams } = require("./handlers/screams");
app.get("/screams", getAllScreams);
//Este metodo nos sirve para postear un nuevo registro dentro de la base de datos
app.post("/scream", FBAuth, setScreams);

exports.api = functions.https.onRequest(app);
