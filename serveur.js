let http = require('http')
let url = require('url')
let fs = require('fs') // gestion fichier
require("remedial")
let queryString = require('querystring')
let gestionPage = require('./js_serveur/gestionPage.js')
let questionnaireManager = require('./js_serveur/questionnaireManager.js')

let gererServeur = function(requete, reponse){
    let monUrl = url.parse(requete.url)
    let urlQueryString = queryString.parse(monUrl.query)
    let extension = monUrl.pathname.substring(monUrl.pathname.indexOf("."), monUrl.pathname.length)
    gestionPage.initialisation(monUrl, extension, requete, reponse, urlQueryString)

    if(requete.method === "POST"){
        let body = ""
        requete.on("data", chunk =>{
            body += chunk.toString()
        })
        requete.on("end", () => {
            let obj = queryString.parse(body)
            if( monUrl.pathname === "/validationCreationQuestion.html"){
                questionnaireManager.creerQuestionBD(obj)
            }else if(monUrl.pathname === "/validationCreationQuestionnaire.html"){
                questionnaireManager.creerQuestionnaireBD(obj)
            }else if(monUrl.pathname === "/suppressionQuestionnaire.html"){
                questionnaireManager.supprimerQuestionnaireBD(obj)
            }else if(monUrl.pathname === "/modifierQuestionnaire.html"){
                questionnaireManager.modifierQuestionnaire(obj)
            }else if(monUrl.pathname === "/modifierQuestionnaireBD.html"){
                questionnaireManager.modifierQuestionnaireBD(obj)
            }else if(monUrl.pathname === "/supprimerQuestion.html"){
                questionnaireManager.supprimerQuestionBD(obj)
            }else if(monUrl.pathname === "/modifierQuestion.html"){
                questionnaireManager.modifierQuestion(obj)
            }else if(monUrl.pathname === "/modifierQuestionBD.html"){
                questionnaireManager.modifierQuestionBD(obj)
            }
        })
    }else{
        if(gestionPage.url.pathname !== "/favicon.ico"){
            gererFichier()                    
        }    
    }
}

function gererFichier(){
    if(gestionPage.url.pathname === "/" || gestionPage.extension === ".html"){ // gestion d'une page HTML    
        switch(gestionPage.url.pathname){
            case '/afficherQuestions.html' :  questionnaireManager.afficherQuestions()
            break
            case '/creerQuestion.html' : questionnaireManager.gestionCreationQuestion()
            break
            case '/afficherQuestionnaire.html' : questionnaireManager.afficherQuestionnaire()
            break
            case '/creerQuestionnaire.html' : questionnaireManager.gestionCreationQuestionnaire()
            break
            case '/jeu.html' :  
            if(!gestionPage.queryString.idquestionnaire){
                questionnaireManager.gererQuestionJeu(1, 1)
            }else{
                if(!gestionPage.queryString.idquestion){
                    questionnaireManager.gererQuestionJeu(gestionPage.queryString.idquestionnaire, 1)
                }else{
                    questionnaireManager.gererQuestionJeu(gestionPage.queryString.idquestionnaire, gestionPage.queryString.idquestion)
                }
            }
            break
            default : gestionPage.envoyerDataToUser()
        }
    }else{
        gestionPage.envoyerDataToUser() 
    }
}

let serveur = http.createServer(gererServeur)
serveur.listen(8080)