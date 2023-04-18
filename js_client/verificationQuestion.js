function verification(bonneReponse, reponse, idQuestionnaire, questionNumero ){
    
    console.log("Bonne reponse" + " : " + bonneReponse)
    console.log("Votre reponse" + " : " + reponse)
    console.log("Nom questionnaire" + " : " + idQuestionnaire)
    console.log("Question numero" + " : " + questionNumero)

    if(bonneReponse === reponse){
        document.location.href = "jeu.html?idquestionnaire=" + idQuestionnaire + "&idquestion=" + (parseInt(questionNumero)+1)
    }else{
        let panelErreur =document.querySelector('.perso-hidden')
        if(panelErreur){
            panelErreur.classList.remove("perso-hidden")
        }
    }
}

