/*GENERADOR DE NUMERO ALEATORIO*/
function randomizer() {
  let max = 49;
  let min = 0;
  return Math.floor(Math.random() * max) + min;
}
/*VARIABLES GLOBALES*/
let userAnsw = [];
let respuestasUsuario = [];
let contador = 0;
let selection = document.getElementsByName("question");
let form = document.querySelector(".form__section");
/*FUNCIÓN FETCH & VALIDE*/
async function getQuestions() {
  try {
    /*FETCH API PREGUNTAS*/
    let response = await fetch(
      `https://opentdb.com/api.php?amount=50&type=multiple`
    );
    let data = await response.json();
    /*OBJETO PREGUNTA RANDOM*/
    let randomQ = data.results[randomizer()];
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
          document.querySelector(".form__buttom_1").style.display = "none";
          document.querySelector(".form__buttom_2").style.display = "block";
          let borrar = document.querySelector(".form_content")
          form.removeChild(borrar)
          document.querySelector(".form__question").innerHTML = "How many questions do you think you got right?";
          document.querySelector(".form__gif").style.display = "block";
        }
      }
    }
    console.log(contador);
    console.log(userAnsw);
    document
      .querySelector(".form__section")
      .addEventListener("submit", evalQuiz);
    // console.log(selection);
  } catch (error) {
    console.log(`ERROR Error: ${error.stack}`);
  }
}
getQuestions();

//GRÁFICA RESULTADOS TEST
//Datos de la gráfica
async function getVariables2() {
  try {
    var ctx = document.querySelector("#results__chart");
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Successful answers", "Wrong answers"],
        datasets: [
          {
            label: "aciertos",
            data: [5, 5],
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