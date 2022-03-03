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
let userAnsw = [];
let contador = 0;
let selection = document.getElementsByName("question");
let form = document.querySelector(".form__section");
let response;
let nameBd;

/*VARIABLE DATABASE*/
let provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().languageCode = "es";
/*variables storage*/
let nameUser = JSON.parse(localStorage.getItem("user"));
let mailUser = JSON.parse(localStorage.getItem("mail"));
let userLog;
/*FUNCION GENERADOR DE NUMERO ALEATORIO*/
function randomizer() {
  let max = 59;
  let min = 0;
  return Math.floor(Math.random() * max) + min;
}

/*COMPROBAR USUARIOS*/

/*FUNCIÓN PARA IMPRIMIR  EL NOMBRE EN EL HEADER DE QUESTION DESDE STORAGE*/

async function nameUserQ() {
  if (typeof JSON.parse(localStorage.getItem("user")) === "object") {
    document.querySelector(
      ".quiz__user__question"
    ).innerHTML = `${nameUser[0].nombre}`;
  } else {
    document.querySelector(".quiz__user__question").innerHTML = ``;
  }
}

/*SESION CONTINUA*/
function keep() {
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
/*RECORRER BASE DE DATOS*/
const traerUsuario = () => {
  db.collection("quiz2")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        nameBd = doc.data().nombre;
        mailBd = doc.data().mail;
        if (doc.data().nombre === nameUser[0].nombre) {
          console.log(contador);
        }
      });
    });
};



/*FUNCIÓN FETCH y ASIGNACION DE PREGUNTAS*/
async function getQuestions() {
  try {
    /*llamada a imprimir el nombre desde storage*/
    nameUserQ();
    /*fetch de api y de JSON propio*/
    let response = await fetch(
      `https://opentdb.com/api.php?amount=50&type=multiple`
    );
    let responseUs = await fetch("./preguntas/preguntas.JSON");
    let dataUs = await responseUs.json();
    let data = await response.json();
    let q = data.results.concat(dataUs.results);
    /*OBJETO PREGUNTA RANDOM*/
    let randomQ = q[randomizer()];
    /*ENUNCIADO DE LA PREGUNTA*/
    let question = randomQ.question;
    /*RESPUESTAS INCORRECTAS*/
    let answers = randomQ.incorrect_answers;
    /*RESPUESTA CORRECTA*/
    correct_answer = randomQ.correct_answer;
    console.log("Correcta - " + correct_answer);
    /*LISTA CON LAS 4 RESPUESTAS POSIBLES EN ORDEN ALEATORIO*/
    answers.push(correct_answer);
    answers.sort();
    /*INSERCION DE LAS RESPUESTAS EN LOS LABELS*/
    document.querySelector("#r1").innerHTML = answers[0];
    document.querySelector("#r2").innerHTML = answers[2];
    document.querySelector("#r3").innerHTML = answers[1];
    document.querySelector("#r4").innerHTML = answers[3];
    document.querySelector(".form__question").innerHTML = question;

    console.log(contador);
    console.log(userAnsw);

    /*LLAMADA A EVALUQUIZ*/
    document
      .querySelector(".form__section")
      .addEventListener("submit", evalQuiz, keep);
    // console.log(selection);
  } catch (error) {
    console.log(`ERROR Error: ${error.stack}`);
  }
}

/*FUNCIÓN PARA EVALUAR LA RESPUESTA SELECIONADA*/
function evalQuiz(event) {
  event.preventDefault();
  for (i = 0; i < selection.length; i++) {
    /*VALIDACIÓN DEL CHECHK*/
    if (selection[i].checked === true) {
      /*AÑADIMOS LA RESPUESTA CORRECTA A UNA LISTA*/
      let selectAnsw = document.querySelectorAll(".text")[i].innerHTML;
      userAnsw.push(selectAnsw);
      form.reset();
      getQuestions();
      if (correct_answer === selectAnsw) {
        contador += 1;
      }
    }
    /* CAMBIAR BOTON DE NEXT A FINALIZE */
    if (userAnsw.length === 9) {
      document.querySelector(".form__buttom_1").innerHTML = "FINALIZE";
    }
    /* CAMBIAR BOTÓN A RESULTADOS*/
    if (userAnsw.length === 10) {
      traerUsuario();
      alert(`Has acertado ${contador} preguntas`);
      /* contador a la base de datos aqui*/
      /* cambio de botones y redirect*/
      document.querySelector(".form__buttom_1").style.display = "none";
      document.querySelector(".form__buttom_2").style.display = "block";
      let borrar = document.querySelector(".form_content");
      form.removeChild(borrar);
      document.querySelector(".form__question").innerHTML =
        "How many questions do you think you got right?";
      document.querySelector(".form__gif").style.display = "block";
    }
  }
}

/*llamada al questionario*/
getQuestions();

console.log(nameUser[0].nombre);
