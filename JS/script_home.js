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
let nameUser = JSON.parse(sessionStorage.getItem("user"));
let mailUser = JSON.parse(sessionStorage.getItem("mail"));
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

/*CREAR USUARIO FIREBASE*/
crearUsuario = () => {
  createUser({
    nombre: response.user.displayName,
    mail: response.user.email,
  });
};

/*COMPROBAR USUARIOS*/

/*FUNCION LOGIN*/
async function login() {
  try {
    response = await firebase.auth().signInWithPopup(provider);
    userLog = response.user.displayName;
    document.querySelector(".quiz__user").innerHTML = `${userLog}`;
    document.querySelector(".home__buttom").style.display = "block";
    // document.querySelector(".question__user").innerHTML = `${userLog}`;
    let user = [
      {
        nombre: response.user.displayName,
        email: response.user.email,
      },
    ];

    
    /*datos al firebase*/
    // if (error.code !== 'auth/account-exists-with-different-credential') {
    // crearUsuario();
    // }

    /*datos al sessionStorage*/
    sessionStorage.setItem("user", JSON.stringify(user));
    /*boton de try*/
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

/* FUNCTION LOGOUT*/
const signOut = () => {
  let user = firebase.auth().currentUser;
  firebase
    .auth()
    .signOut()
    .then(() => {
      document.querySelector(".quiz__user").innerHTML = ``;
      document.querySelector(".home__buttom").style.display = "none";
      document
        .querySelector(".home__buttom__logout")
        .addEventListener("click", signOut);
    })
    .catch((error) => {
      console.log("hubo un error: " + error);
    });
};

/*FUNCION GRÁFICA HOME en base al log*/
async function getVariables() {
  try {
    var ctx = document.querySelector(".home__canvas");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["día1", "día2", "día3", "día4", "día5"],
        datasets: [
          {
            label: "aciertos",
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            backgroundColor: ["rgb(56,163,165, 0.8)", "rgb(87,204,153, 0.8)"],
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

/*continua sesion abierta*/
// document
//   .querySelector(".home__buttom")
//   .addEventListener("click", async (e) => {
//     try {
//       await keep();
//     } catch (error) {}
//   });

/*llamada al login con boton*/
document
  .querySelector(".home__buttom__login")
  .addEventListener("click", async (e) => {
    try {
      await login();
    } catch (error) { }
  });

/*llamado al log out con boton*/
signOut();

/*llamada a la gráfica home*/
getVariables();

console.log(nameUser[0].nombre);
