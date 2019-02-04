// le paquet FS sert à lire tout les fichiers d'un coup dans un dossier
const fs = require('fs')
const express = require('express')
const path = require('path')

class Router { // nouvelle class Router, pour pouvoir l'utiliser plus tard
  // constructor sert a crée un object avec la class, tu verras après
  constructor (settings) {
    this.router = express.Router()
    this.routes = {} // Liste des routes
    this.path = '/api/v1' // Le path qui sera utiliser, donc pour une requête tu fais 'localhost:3000/api/v1/...'
    this.settings = settings

    fs.readdir(path.join(__dirname, '/routes/'), (errors, files) => { // dirname = genre là où tu trouves quand le fichier est chargé, là c'est src/api/v1/ et on va chercher les fichiers qui sont /routes
      if (errors) throw new Error(errors) // si y a une erreur, on l'affiche et on arrête tout

      for (const file of files) { // on fait une boucle, qui va lire chaque fichier
        if (!file.endsWith('js')) continue // si le fichier fini pas avec .js, on le lit pas et on conitnue

        let route = new (require(path.join(__dirname, '/routes/') + file))(this) // on crée une instance de la route on passe tout les trucs qu'on a mis en haut comme paramètre quand on crée l'instance
        this.routes[route.path] = route
      }
    })
  }
}

module.exports = Router // pour qu'on puisse l'utiliser en dehors de ce fichier
