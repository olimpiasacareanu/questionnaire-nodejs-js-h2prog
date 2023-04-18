let mysql = require('mysql');
let config = require('../config/config.js')

let db = {
    instance :null,

    connexion : function(){
        this.instance = mysql.createConnection({
            host     : config.DBHOST,
            port     : config.DBPORT,
            user     : config.DBUSER,
            password : config.DBPWD,
            database : config.DBNAME
        });
        
        this.instance.connect(function(err){
            if(err){
                console.error("error connexion : " + err.stack)
                return
            }
            console.log("Connexion à la BD OK")
        })
    },

    deconnexion : function(){
        this.instance.end()
    }
}

module.exports = db


    

