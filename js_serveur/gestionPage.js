let fs = require('fs')

let gestionPage = {
    url : null,
    extension : null, 
    requete : null,
    reponse : null,
    queryString : null,
    objetToSupplant : "",

    initialisation : function(url, extension, requete, reponse, queryString){
        this.url = url
        this.extension = extension
        this.requete = requete
        this.reponse = reponse
        this.queryString = queryString
        this.objetToSupplant = {}
    },

    envoyerDataToUser : function(){
        let data = this.genererDataAEnvoyer()
        this.reponse.writeHead(200, {'Content-Type' : data.contentType})
        this.reponse.write(data.content)
        this.reponse.end()
    },

    genererDataAEnvoyer : function(){
        let data = {}
        let dossier = ""

        if(this.extension === ".html" || this.url.pathname === "/"){
            if(this.url.pathname === "/"){
                this.url.pathname === ".html"
            }
            dossier = "html"
            data.contentType = "text/html"
            data.content = this.genererPageHtml(dossier)
        }else if(this.extension === ".css"){
            dossier = "css"
            data.contentType = "text/css"
            data.content = fs.readFileSync(dossier + this.url.pathname)
        }else if(this.extension === ".js"){
            dossier = "js_client"
            data.contentType = "application/javascript"
            data.content = fs.readFileSync(dossier + this.url.pathname)
        }else if(this.extension === ".jpg"){
            dossier = "ressources"
            data.contentType = "image/jpg"
            data.content = fs.readFileSync(dossier + this.url.pathname)
        }else if(this.extension === ".png"){
            dossier = "ressources"
            data.contentType = "image/png"
            data.content = fs.readFileSync(dossier + this.url.pathname)
        }

        return data
    },

    genererPageHtml : function(dossier){
        let pageHTML = "";

        let headerHTML = fs.readFileSync(dossier + "/common/header.html", "utf-8");
        let footerHTML = fs.readFileSync(dossier + "/common/footer.html", "utf-8")
        let page = fs.readFileSync(dossier + this.url.pathname, 'utf-8')
        pageHTML = headerHTML + page + footerHTML
        try {
            pageHTML = pageHTML.supplant(this.objetToSupplant)
        }catch(e){
            
        }
        return pageHTML
    }

}

module.exports = gestionPage