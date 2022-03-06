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
let puntosBd;
let dateBd;
/*VARIABLE DATABASE*/
let provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().languageCode = "es";
/*variables storage*/
let nameUser = JSON.parse(sessionStorage.getItem("user"));
let resultsUser = JSON.parse(sessionStorage.getItem("results"));
let puntuacion = resultsUser[0].resultados
let userLog;

/*PINTAR RESULTADOS*/

document.querySelector(
  ".results__copy"
).innerHTML = `${puntuacion} HITS / 10 ANSWERS`;
/*FUNCIÓN PARA IMPRIMIR  EL NOMBRE EN EL HEADER DE RESULTS DESDE FIREBASE*/

const traerUsuario = () => {
  db.collection("quiz2")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        nameBd = doc.data().nombre;
        mailBd = doc.data().mail;
        if (mailBd === nameUser[0].email) {
          console.log(
            nameBd + " es el usuario de firebase que esta jugando ahora mismo"
          );
          document.querySelector(
            ".quiz__user__results"
          ).innerHTML = `${nameBd}`;
        }
      });
    });
};
traerUsuario()
/*FUNCION GRÁFICA RESULTS en base al log*/
async function getVariables2() {
  try {
    var ctx = document.querySelector(".results__canvas");
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: [`${puntuacion} Successful answers`, `${10-puntuacion} Wrong answers`],
        datasets: [
          {
            label: "aciertos",
            data: [puntuacion, 10-puntuacion],
            backgroundColor: ["rgb(56,163,165, 0.8)", "rgb(87,204,153, 0.8)"]
          },
        ],
      },
    });
  } catch (error) {
    console.log(`ERROR Error: ${error.stack}`);
  }
}
getVariables2()