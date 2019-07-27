const { db } = require("../util/admin");

exports.getAllScreams = (req, res) => {
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
};

exports.setScream = (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.user.handle,
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
};
