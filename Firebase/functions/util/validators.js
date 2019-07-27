const isEmpty = string => {
  if (string.trim() === "") return true;
  else return false;
};

const isEmail = email => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};

exports.validarRegistro = datos => {
  //OBJETO DE ERRORES
  let errors = {};

  //VALIDACION DE EMAIL USANDO LOS METODOS DEFINIDOS
  if (isEmpty(datos.email)) {
    errors.email = "El email no debe estar vacio";
  } else if (!isEmail(newUser.email)) {
    errors.email = "Debe ser un email valido";
  }

  //VALIDACION DE LA CONTRASENA
  if (isEmpty(datos.password)) {
    errors.password = "La contraseña no puede estar vacia";
  }

  if (newUser.password !== newUser.confirmPassword) {
    errors.confirmPassword = "Las contraseñas deben ser iguales";
  }

  //VALIDACION DEL HANDLE
  if (isEmpty(datos.handle)) {
    errors.handle = "El handle no puede estar vacio";
  }

  return {
    errors,
    valido: Object.keys.length === 0 ? true : false
  };
};

exports.validarLogin = datos => {
  let errors = {};

  if (isEmpty(datos.email)) errors.email = "El email no puede estar vacio";
  if (isEmpty(datos.password))
    errors.password = "La contraseña no puede estar vacia";

  return {
    errors,
    valido: Object.keys(errors).length === 0 ? true : false
  };
};
