/*BASE DE DATOS FIREBASE*/
const firebaseConfig = {
  apiKey: "AIzaSyBkd2aze1GHYGfJ7dYW1DlKZ0BeeNGYq2o",
  authDomain: "quiz2-ad163.firebaseapp.com",
  projectId: "quiz2-ad163",
  storageBucket: "quiz2-ad163.appspot.com",
  messagingSenderId: "923483461053",
  appId: "1:923483461053:web:2492b0ce388a79be63aed4",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const createUser = (user) => {
  db.collection("quiz2")
    .add(user)
    .then((docRef) => console.log("Document written with ID: ", docRef.id))
    .catch((error) => console.error("Error adding document: ", error));
};

/*VARIABLES GLOBALES*/

/*Otras*/

let response;
let nameBd;

/*VARIABLE DATABASE*/
let provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().languageCode = "es";
/*variables storage*/
let nameUser = JSON.parse(localStorage.getItem("user"));
let mailUser = JSON.parse(localStorage.getItem("mail"));
let userLog;

/*RECORRER BASE DE DATOS*/
const traerUsuarios = () => {
  db.collection("quiz2")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        nameBd = doc.data().nombre;
        mailBd = doc.data().mail;
        return mailBd;
      });
    });
};

/*FUNCIÓN PARA IMPRIMIR  EL NOMBRE EN EL HEADER DE RESULTS DESDE STORAGE*/

async function nameUserQ() {
  if (typeof JSON.parse(localStorage.getItem("user")) === "object") {
    document.querySelector(
      ".quiz__user__results"
    ).innerHTML = `${nameUser[0].nombre}`;
  } else {
    document.querySelector(".quiz__user__results").innerHTML = ``;
  }
}

/*FUNCION GRÁFICA RESULTS en base al log*/
async function getVariables2() {
  try {
    var ctx2 = document.querySelector(".results__canvas");
    new Chart(ctx2, {
      type: "polarArea",
      data: {
        labels: [6 + "/10"],
        datasets: [
          {
            label: "aciertos",
            data: [6, 10],
            backgroundColor: ["rgb(56,163,165, 0.8)", "rgb(87,204,153, 0.0)"],
          },
        ],
      },
    });
  } catch (error) {
    console.log(`ERROR Error: ${error.stack}`);
  }
}

/*SESION CONTINUA*/
async function keep() {
  try {
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.NONE)
      .then(() => {
        var provider = new firebase.auth.GoogleAuthProvider();
        // In memory persistence will be applied to the signed in Google user
        // even though the persistence was set to 'none' and a page redirect
        // occurred.
        return firebase.auth().signInWithRedirect(provider);
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
      });
  } catch (error) {
    throw new Error(error);
  }
}

/*Llamada a imprimir el nombre desde storage*/
nameUserQ();

/*llamada a la gráfica home*/
getVariables2();

console.log(nameUser[0].nombre);
