const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();
admin.initializeApp();

//variable de configuracion de la base de datos
const config = {
  apiKey: "AIzaSyAMgDvuDQyiKPK_Jr9AA0b82Y0U2VQofnU",
  authDomain: "memegram201.firebaseapp.com",
  databaseURL: "https://memegram201.firebaseio.com",
  projectId: "memegram201",
  storageBucket: "memegram201.appspot.com",
  messagingSenderId: "1094990056611",
  appId: "1:1094990056611:web:ee12012239055dcf"
};

const firebase = require("firebase");
//Se inicializa la variable firebase con la configuracion de la aplicacion
firebase.initializeApp(config);

const db = admin.firestore(); //reemplaza las partes de codigo donde se llama a la base de datos

const isEmpty = string => {
  if (string.trim() === "") return true;
  else return false;
};

const isEmail = email => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};

//Este metodo sirve para obtener los ingresos de usuarios dentro de la base de datos utilizando express
app.get("/screams", (req, res) => {
  db.orderBy("createdAt", "desc")
    .collection("screams")
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(screams);
    })
    .catch(err => console.log(err));
});

//Este metodo nos sirve para postear un nuevo registro dentro de la base de datos
app.post("/scream", (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };

  db.collection("screams")
    .add(newScream)
    .then(doc => {
      res.json({ message: `documento ${doc.id} creado correctamente` });
    })
    .catch(err => {
      res.status(500).json({ error: "Algo salio mal" });
      console.error(err);
    });
});

/* 
\-------------------------------------------------
\
\ Importante, Registro de usuarios de la red social
\
\--------------------------------------------------
*/

//Ruta de inicio de session
app.post("/signUp", (req, res) => {
  //Aqui se crea un nuevo usuario con los requerimiendos mencionados
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  let errors = {};

  if (isEmpty(newUser.email)) {
    errors.email = "El email no debe estar vacio";
  } else if (!isEmail(newUser.email)) {
    errors.email = "Debe ser un email valido";
  }

  if (isEmpty(newUser.password)) {
    errors.password = "La contraseña no puede estar vacia";
  }

  if (newUser.password === newUser.confirmPassword) {
  }

  //Validacion de datos
  let userKey, userId;
  db.doc(`/usuarios/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({
          handle: "este handle ya fue creado"
        });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    }) //data contiene todos los datos del usuario dentro del registro hecho en el else
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(token => {
      userKey = token;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId
      };

      return db.doc(`/usuarios/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      res.status(201).json({ userKey });
    })
    .catch(err => {
      console.error(err);
      if (err.status === "auth/email-already-in-use") {
        return res
          .status(400)
          .json({ error: "El email que has ingresado ya se encuentra en uso" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

exports.api = functions.https.onRequest(app);
