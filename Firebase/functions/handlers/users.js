const { db } = require("../util/admin");
//se llama a la variable de usuario de la base de datos
const config = require("../util/config");
const firebase = require("firebase");
//Se inicializa la variable firebase con la configuracion de la aplicacion
firebase.initializeApp(config);

const { validarRegistro, validarLogin } = require("../util/validators");

module.signUp = (req, res) => {
  //Aqui se crea un nuevo usuario con los requerimiendos mencionados
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  const { errors, valido } = validarRegistro(newUser);
  if (!valido) return res.status(400).json(errors);

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
};

module.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  const { errors, valido } = validarLogin(user);
  if (!valido) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({ token });
    })
    .catch(err => {
      if (err.code == "auth/wrong-password") {
        return res.status(403).json({
          general: "las credenciales estan incorrectas, intenta de nuevo"
        });
      } else {
        console.error(err);
        return res.status(500).json({ error: err.code });
      }
    });
};
