const RateLimiter = require('../../../structures/RateLimiter')

class HelloGET {
  constructor (controller) { // c'est les this de tout à leur qui sont dans controller j'essai de visualiser incroyable
    this.path = '/hello' // donc là on y accède via localhost/api/v1/routes/hello
    this.router = controller.router // on passe le router express si on a besoin plus tard

    this.rateLimiter = new RateLimiter({ max: 1 }) // donc si tu atteins 10 requetes en 1 ms, t'es ratelimit et on te dit 'sorry'

    this.router.get( // on crée un nouveau get, comme dans ton index.js mais séparé
      this.path, // le path
      this.run.bind(this) // la fonction qu'on va écrire, pour faire tout le bordel, avec les paramètres du router express passer pour l'utiliser
    )
  }

  // bon avec javascript, l'async est super facile comparé au autre language, donc ça va tout faire asynchrone, genre une étape par une étape si on fait 'await' (tu vas voir);

  async run (req, res) { // req & res viennent du Router express, le 'this' de tout à l'heure à servi à ça
    await console.log(req.body) // donc là, avec await devant, ça va attendre que console.log soit fini pour passer à la suite

    // if (!req.query.text) return res.status(200).send({ message: 'no' }) // le code d'en-dessous est toujours accessible, ça s'arrêtera que si y'a pas de text dans la query (test sur postman)

    return res.status(200).send({
      message: 'Hello world!',
      gay: 'yes'
    }) // return marque la fin de la fonction, donc si je fais
  }
}

module.exports = HelloGET
