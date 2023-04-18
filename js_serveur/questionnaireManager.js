let mysql = require('mysql');
let bd = require('./bd.js')
let gestionPage = require('./gestionPage.js')

let questionnaireManager = {

    afficherQuestions : function(){
        bd.connexion()
        bd.instance.query('select * from question as q inner join questionnaire as qe on q.idquestionnaire = qe.idquestionnaire', function (error, results, fields) {
            if (error) throw error;
            let txt = ""
            for(let question of results){
                txt += '<tr>'
                    txt+= '<th scope="row">' + question['idquestion'] + '</th>'                
                    txt+= '<td>' + question['nomQuestionnaire'] + '</td>'                
                    txt+= '<td>' + question['descriptionQuestion'] + '</td>'                
                    txt+= '<td>' + question['reponseA'] + '</td>'                
                    txt+= '<td>' + question['reponseB'] + '</td>'                
                    txt+= '<td>' + question['reponseC'] + '</td>'                
                    txt+= '<td>' + question['reponseD'] + '</td>'                
                    txt+= '<td>' + question['bonneReponse'] + '</td>'        
                    txt+= '<td>'        
                        txt+= '<form method="post" action="modifierQuestion.html">' 
                            txt+='<input type="hidden" name="idQuestion" value="' + question['idquestion'] + '">'
                            txt+= '<button type="submit" class="btn">' 
                                txt+='<i class="fa-solid fa-pen-to-square"></i>'       
                            txt+= '</button>' 
                        txt+= '</form>'        
                    txt+= '</td>'        
                    txt+= '<td>'        
                        txt+= '<form method="post" action="supprimerQuestion.html">' 
                            txt+='<input type="hidden" name="idQuestion" value="' + question['idquestion'] + '">'
                            txt+= '<button type="submit" class="btn">' 
                                txt+='<i class="fa-solid fa-trash"></i>'       
                            txt+= '</button>' 
                        txt+= '</form>'        
                    txt+= '</td>'        
                txt += '</tr>'

            }
            let alertMsg  = ""
            if(gestionPage.queryString.delete === "yes"){
                alertMsg +='<div class="alert alert-success" role="alert">La question a bien été supprimée!</div>'
            }
            
            let alertMsgUpdate = ""
            if(gestionPage.queryString.update === "yes"){
                alertMsgUpdate +='<div class="alert alert-success" role="alert">La question a bien été modifiée!</div>'
            }
            gestionPage.objetToSupplant.Questions = txt
            gestionPage.objetToSupplant.confirmMsgSuppr = alertMsg
            gestionPage.objetToSupplant.confirmMsgModif= alertMsgUpdate
            gestionPage.envoyerDataToUser()
            
        });
        bd.deconnexion()
    },
    gestionCreationQuestion : function(){
        bd.connexion()
        bd.instance.query('select * from questionnaire as qe', function (error, results, fields) {
            if (error) throw error;
            let txt = ''
            for(let questionnaire of results){

               txt += '<option value ="' + questionnaire['idquestionnaire'] + '">'
               txt += questionnaire['nomQuestionnaire'] + ' : ' + questionnaire['descriptionQuestionnaire']
               txt += '</option>'
            }

            let validation = ""
            if(gestionPage.queryString.confirm === "yes"){
                validation += '<div class="alert alert-success" role="alert">La question a bien été ajouté en BD!</div>'
            }
            gestionPage.objetToSupplant.validationQuestion = validation
            gestionPage.objetToSupplant.Questionnaires = txt
            gestionPage.envoyerDataToUser()
            
        });
        bd.deconnexion()
    },

    creerQuestionBD : function(obj){
        bd.connexion()
        let req = 'insert into question (descriptionQuestion, reponseA, reponseB, reponseC, reponseD, bonneReponse, idquestionnaire ) value (?,?,?,?,?,?,?)'
        bd.instance.query(req,[obj.question, obj.reponseA, obj.reponseB, obj.reponseC, obj.reponseD, obj.bonneReponse, parseInt(obj.questionnaire) ], function (error, results, fields) {
            if (error) throw error;
            gestionPage.reponse.end("<script>document.location.href='creerQuestion.html?confirm=yes'</script>")
            
        });
        bd.deconnexion()
    },

    afficherQuestionnaire : function(){
        bd.connexion()
        let req = "SELECT qe.idquestionnaire, nomQuestionnaire, descriptionQuestionnaire, count(qn.idquestion) as countQuestions FROM questionnaire qe LEFT JOIN question qn on qe.idquestionnaire = qn.idquestionnaire group by qe.idquestionnaire"
        bd.instance.query(req, function (error, results, fields) {
            if (error) throw error;
            let txt = ''
            for(let questionnaire of results){
               txt += '<tr>'
                    txt+= '<th scope="row">' + questionnaire['idquestionnaire'] + '</th>'                
                    txt+= '<td>' + questionnaire['nomQuestionnaire'] + '</td>'                
                    txt+= '<td>' + questionnaire['descriptionQuestionnaire'] + '</td>'                           
                    txt+= '<td>' + questionnaire['countQuestions'] + '</td>'                           
                    txt+= '<td>'
                        txt += '<form method="POST" action="modifierQuestionnaire.html">'     
                        txt+= '<input type="hidden" name="idQuestionnaire" value="'+ questionnaire['idquestionnaire'] +'">' 
                            txt+= '<button type="submit" class="btn">'              
                                txt+= '<i class="fa-solid fa-pen-to-square"></i>'                           
                            txt+= '</button>'              
                        txt += '</form>'                           
                    txt+= '</td>'                           
                    txt+= '<td>'
                        txt += '<form method="POST" action="suppressionQuestionnaire.html">'     
                        txt+= '<input type="hidden" name="idQuestionnaire" value="'+ questionnaire['idquestionnaire'] +'">' 
                            txt+= '<button type="submit" class="btn">'              
                                txt+= '<i class="fa-solid fa-trash"></i>'                           
                            txt+= '</button>'              
                        txt += '</form>'                           
                    txt+= '</td>'                           
                txt += '</tr>'
            }

            let validation = ""
            if(gestionPage.queryString.suppr === "yes"){
                validation += '<div class="alert alert-success" role="alert">Le questionnaire a bien été supprimé ! </div>'
            }
            let validationModif = ""
            if(gestionPage.queryString.update === "yes"){
                validationModif += '<div class="alert alert-success" role="alert">Le questionnaire a bien été modifié ! </div>'
            }

            gestionPage.objetToSupplant.Questionnaires = txt
            gestionPage.objetToSupplant.ConfirmationSuppression = validation
            gestionPage.objetToSupplant.ConfirmationModif = validationModif
            gestionPage.envoyerDataToUser()
            
        });
        bd.deconnexion()
    },

    gestionCreationQuestionnaire : function(){
        let validation = ""
        if(gestionPage.queryString.confirm === "yes"){
            validation += '<div class="alert alert-success" role="alert">La question a bien été ajouté en BD!</div>'
        }
        gestionPage.objetToSupplant.validationQuestionnaire = validation
        gestionPage.envoyerDataToUser()
    },
   
    creerQuestionnaireBD : function(obj){
        bd.connexion()
        let req = 'insert into questionnaire (nomQuestionnaire, descriptionQuestionnaire ) value (?,?)'
        bd.instance.query(req, [obj.nomQuestionnaire, obj.descriptionQuestionnaire], function (error, results, fields) {
            if (error) throw error;
            gestionPage.reponse.end("<script>document.location.href='creerQuestionnaire.html?confirm=yes'</script>")
            
        });
        bd.deconnexion()
    },

    supprimerQuestionnaireBD : function(info){
        bd.connexion()
        let req = "DELETE from questionnaire where idquestionnaire = ?"
        bd.instance.query(req, [info.idQuestionnaire], function(error, results, fields){
            if (error) throw error;
            gestionPage.reponse.end("<script>document.location.href='afficherQuestionnaire.html?suppr=yes'</script>")
        })
        bd.deconnexion()
    },


    // Gestion de la page permettant de modifier un questionnaire  - Formulaire
    modifierQuestionnaire : function(info){
        bd.connexion()
        let req = "select * from questionnaire where idquestionnaire = ?"
        bd.instance.query(req, [info.idQuestionnaire], function (error, results, fields) {
            if (error) throw error;
            gestionPage.objetToSupplant.id = results[0].idquestionnaire
            gestionPage.objetToSupplant.nomQuestionnaire = results[0].nomQuestionnaire
            gestionPage.objetToSupplant.descriptionQuestionnaire = results[0].descriptionQuestionnaire
            gestionPage.envoyerDataToUser()
            
        });
        bd.deconnexion()
    },

    // Gestion de la page permettant de modifier un questionnaire  - Formulaire
    modifierQuestionnaireBD : function(info){
        bd.connexion()
        console.log(info.idQuestionnaire)

        let req = "update questionnaire SET nomQuestionnaire = ?, descriptionQuestionnaire = ? where idquestionnaire = ? "
        bd.instance.query(req, [info.nomQuestionnaire, info.descriptionQuestionnaire, info.idQuestionnaire], function(error, results, fields){
            if (error) throw error;
            gestionPage.reponse.end("<script>document.location.href='afficherQuestionnaire.html?update=yes'</script>")
        })
        bd.deconnexion()
    },

    supprimerQuestionBD : function(info){
        bd.connexion()
        let req = 'delete from question where idquestion =?'
        bd.instance.query(req, [info.idQuestion], function(error, results, field){
            if (error) throw error;
            gestionPage.reponse.end("<script>document.location.href = 'afficherQuestions.html?delete=yes'</script>")
        })
        bd.deconnexion()
    },

    modifierQuestion : function(info){
        bd.connexion()
        let req = 'select * from question where idquestion=?'
        bd.instance.query(req, [info.idQuestion], function(error, results, field){
            if (error) throw error;            
            gestionPage.objetToSupplant.id = results[0].idquestion
            gestionPage.objetToSupplant.idQuestion = results[0].idquestion
            gestionPage.objetToSupplant.question = results[0].descriptionQuestion
            gestionPage.objetToSupplant.reponseA = results[0].reponseA
            gestionPage.objetToSupplant.reponseB = results[0].reponseB
            gestionPage.objetToSupplant.reponseC = results[0].reponseC
            gestionPage.objetToSupplant.reponseD = results[0].reponseD
            gestionPage.objetToSupplant.bonneReponse = results[0].bonneReponse
            questionnaireManager.gestionModificationListe(results[0].idquestionnaire)
        })
        bd.deconnexion()
    },
    gestionModificationListe : function(idQuestionnaire){
        bd.connexion()
        let req = 'select * from questionnaire'
        bd.instance.query(req, function(error, results, field){
            if (error) throw error;
            let listeQuestionnaires = ''
            for(let questionnaire of results){
                if(idQuestionnaire === questionnaire['idquestionnaire']){
                    listeQuestionnaires += '<option value="' + questionnaire['idquestionnaire'] + '" selected >'  
                }else{
                    listeQuestionnaires += '<option value="' + questionnaire['idquestionnaire'] + '" >'  
                }

                listeQuestionnaires += questionnaire['nomQuestionnaire'] + ' : ' + questionnaire['descriptionQuestionnaire']
                listeQuestionnaires += '</option>'
            }
            gestionPage.objetToSupplant.AfficherQuestionnaires = listeQuestionnaires
            gestionPage.envoyerDataToUser()

        })
        bd.deconnexion()
    },
    modifierQuestionBD : function(info){
        bd.connexion()
        let req = 'update question set descriptionQuestion = ?, reponseA = ?, reponseB = ?, reponseC = ?, reponseD = ?, bonneReponse = ?, idquestionnaire = ?  where idquestion = ? '
        console.log(parseInt(info.questionnaire))
        bd.instance.query(req, [info.question, info.reponseA, info.reponseB, info.reponseC, info.reponseD, info.bonneReponse, parseInt(info.questionnaire), info.idQuestion], function(error, results, field){
            if (error) throw error;
            gestionPage.reponse.end("<script>document.location.href = 'afficherQuestions.html?update=yes'</script>")

        })
        bd.deconnexion()
    },
    gererQuestionJeu : function(questionnaire, idQuestion){
        bd.connexion()
        let req = 'select qn.idquestion, qe.idquestionnaire, qe.nomQuestionnaire, descriptionQuestionnaire, nomQuestionnaire, descriptionQuestion, reponseA, reponseB, reponseC, reponseD, bonneReponse, qn.idquestionnaire from question qn inner join questionnaire qe on qn.idquestionnaire = qe.idquestionnaire where qe.idquestionnaire = ? limit 1 offset ?'
        bd.instance.query(req, [questionnaire, (idQuestion-1)], function(error, results, field){
            if(results.length<1){
                gestionPage.reponse.end("<script>alert('Bravo !') ; document.location.href = 'jeu.html'</script>")
            }else{
                gestionPage.objetToSupplant.idQuestionnaire = results[0].idquestionnaire
                gestionPage.objetToSupplant.descriptionQuestionnaire = results[0].nomQuestionnaire
                gestionPage.objetToSupplant.idQuestionBD = results[0].idquestion
                gestionPage.objetToSupplant.questionNumero = idQuestion
                gestionPage.objetToSupplant.description = results[0].descriptionQuestion
                gestionPage.objetToSupplant.reponseA = results[0].reponseA
                gestionPage.objetToSupplant.reponseB = results[0].reponseB
                gestionPage.objetToSupplant.reponseC = results[0].reponseC
                gestionPage.objetToSupplant.reponseD = results[0].reponseD
                gestionPage.objetToSupplant.bonneReponse = results[0].bonneReponse
                questionnaireManager.choixQuestionnaire(results[0].idquestionnaire)
            }

        })
        bd.deconnexion()
    },
    choixQuestionnaire : function(idQuestionnaire){
        bd.connexion()
        let req = 'select * from questionnaire'
        bd.instance.query(req, function(error, results, field){
            if (error) throw error;
            let listeQuestionnaires = ''
            for(let questionnaire of results){
                if(idQuestionnaire === questionnaire['idquestionnaire']){
                    listeQuestionnaires += '<option  value="' + questionnaire['idquestionnaire'] + '">'  
                }else{
                    listeQuestionnaires += '<option   value="' + questionnaire['idquestionnaire'] + '" >'  
                }

                listeQuestionnaires += questionnaire['nomQuestionnaire'] + ' : ' + questionnaire['descriptionQuestionnaire']
                listeQuestionnaires += '</option>'
            }
            gestionPage.objetToSupplant.AfficherQuestionnaires = listeQuestionnaires
            gestionPage.envoyerDataToUser()

        })
        bd.deconnexion()
    }
   
}

module.exports = questionnaireManager