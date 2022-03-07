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
let response;
let nameBd;
let nombreBdresults;
let dateBd;
/*VARIABLE DATABASE*/
let provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().languageCode = "es";
let resuladosBdUsuario = [];
let dateDbUsuario = [];
/*variables storage*/
let nameUser = JSON.parse(sessionStorage.getItem("user"));
let mailUser = JSON.parse(sessionStorage.getItem("mail"));
let userLog;
let allUsers = [];

/*TRAER PUNTIUACIONES DEL USUARIO*/
async function traerPartidas() {
  db.collection("resultados")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        dateBd = doc.data().date;
        resultsBd = doc.data().resultados;
        nombreBdresults = doc.data().nombre;
        if (nombreBdresults === response.user.displayName) {
          resuladosBdUsuario.push(resultsBd);
          dateDbUsuario.push(dateBd);
        }
      });
      /*array con todoas las puntuaciones de usuario en firebase*/
      // resuladosBdUsuario.sort((a, b) => a - b).reverse();
      document.querySelector(".home__canvas__default").style.display = "none";
      document.querySelector(".home__canvas").style.display = "block";
      console.log(resuladosBdUsuario);
      console.log(dateDbUsuario);
      getVariablesUser();
    });
}

/*RECORRER BASE DE DATOS*/
const traerUsuarios = () => {
  db.collection("quiz2")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        nameBd = doc.data().nombre;
        mailBd = doc.data().mail;
      });
    });
};

/*CREAR USUARIO FIREBASE*/
crearUsuario = () => {
  db.collection("quiz2")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        mailBd = doc.data().mail;
        if (mailBd === response.user.email) {
          allUsers.push(response.user.email);
        }
      });
      console.log(allUsers.length);
      if (allUsers.length >= 1) {
        console.log("El usuario ya existe en firebase");
      } else {
        console.log("El usuario no existe");
        createUser({
          nombre: response.user.displayName,
          mail: response.user.email,
        });
      }
    });
};

/*FUNCION LOGIN*/
async function login() {
  try {
    response = await firebase.auth().signInWithPopup(provider);
    userLog = response.user.displayName;
    document.querySelector(".quiz__user").innerHTML = `${userLog}`;
    /*datos al sessionStorage*/
    let user = [
      {
        nombre: response.user.displayName,
        email: response.user.email,
      },
    ];
    sessionStorage.setItem("user", JSON.stringify(user));
    /*datos al firebase*/

    crearUsuario();
    traerPartidas();
    /*boton de try*/
    document.querySelector(".home__buttom").style.display = "block";
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

/* FUNCTION LOGOUT*/
const signOut = () => {
  /*limpiar los arrays con datos anteriores*/
  resuladosBdUsuario = [];
  dateDbUsuario = [];
  allUsers = [];
  /*llamada al logOut*/
  let user = firebase.auth().currentUser;
  firebase
    .auth()
    .signOut()
    .then(() => {
      document.querySelector(".quiz__user").innerHTML = ``;
      document.querySelector(".home__buttom").style.display = "none";
      document.querySelector(".home__canvas__default").style.display = "block";
      document.querySelector(".home__canvas").style.display = "none";
      document
        .querySelector(".home__buttom__logout")
        .addEventListener("click", signOut);
    })

    .catch((error) => {
      console.log("hubo un error: " + error);
    });
};

/*FUNCION GRÁFICA HOME en base al log*/
async function getVariablesUser() {
  try {
    var ctx = document.querySelector(".home__canvas");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          dateDbUsuario[0],
          dateDbUsuario[1],
          dateDbUsuario[2],
          dateDbUsuario[3],
          dateDbUsuario[0],
        ],
        datasets: [
          {
            label: userLog,
            data: [
              resuladosBdUsuario[0],
              resuladosBdUsuario[1],
              resuladosBdUsuario[2],
              resuladosBdUsuario[3],
              resuladosBdUsuario[4],
              1,
              7,
              8,
              9,
              10,
            ],
            backgroundColor: ["rgb(56,163,165, 0.8)", "rgb(87,204,153, 0.8)"],
          },
        ],
      },
    });
  } catch (error) {
    console.log(`ERROR Error: ${error.stack}`);
  }
}

async function getVariablesDefault() {
  try {
    var ctx = document.querySelector(".home__canvas__default");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
        datasets: [
          {
            label: "Aciertos",
            data: [3, 1, 7, 5, 9, 10],
            backgroundColor: ["rgb(56,163,165, 0.8)", "rgb(87,204,153, 0.8)"],
          },
        ],
      },
    });
  } catch (error) {
    console.log(`ERROR Error: ${error.stack}`);
  }
}

/*llamada al login con boton*/
document
  .querySelector(".home__buttom__login")
  .addEventListener("click", async (e) => {
    try {
      await login();
    } catch (error) {}
  });

/*llamado al log out con boton*/
signOut();

/*llamada a la gráfica home*/

getVariablesDefault();
