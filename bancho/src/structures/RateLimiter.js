/**
 * C'est un RateLimter que j'avais écris
 * donc ça prends l'ip de la request
 * la store, et quand ça atteint 20 requetes une 1 ms
 * ça la bloque en ajoutant le header 'X-RateLimit-Limit' pour que si c'est un vrai truc, qu'il sache comment il a atteint la limite
 * et 'X-RateLimit-Remaning', ce qui lui dit combien il lui reste de requetes à faire avant qu'il soit limité comme une PUTE
 * tout ça est temporaire, si tu arrêtes l'app, ce sera supprimé et parti comme un PET dans l'AIR.
 */
class RateLimiter {
  constructor (options) {
    this.options = Object.assign({}, {
      windowMS: 10 * 1000,
      max: 20,
      message: 'Too many requests, please try again later ニャー.',
      statusCode: 429,
      keyGenerator (req) {
        return req.ip
      },
      skip () {
        return false
      },
      handler (store, req, res) {
        let retry = store.reset - Date.now()
        res.set('Retry-After', retry)
        return res.status(this.statusCode).send({ message: this.message, retryAfter: retry })
      }
    }, options) // Overwrite defaults with options

    this.store = { // On crée un objet, qui sera utilisé pour chaque requetes
      requests: {},
      reset: Date.now() + options.windowMS,
      // key = ip stv
      incr (key) {
        if (this.requests[key]) {
          this.requests[key]++
          return this.requests[key]
        }
        this.requests[key] = 1
        return 1
      },
      decr (key) { // on enlève une requête sur l'ip, ou on l'a mets à 0 si c'est la première fois qui fais la requête
        if (this.requests[key]) {
          this.requests[key]--
          return this.requests[key]
        }
        this.requests[key] = 0
        return 0
      },
      resetKey (key) { // on supprime l'ip de notre objet
        delete this.requests[key]
      },
      resetAll (options) { // on remets tout au début
        this.requests = {}
        this.reset = Date.now() + options.windowMS
      }
    }

    setInterval(() => this.store.resetAll(this.options), this.options.windowMS) // totues les 1ms, on reset tout
  }

  limit (req, res, next) {
    if (this.options.skip(req, res)) { return next() }

    let key = this.options.keyGenerator(req)

    let requests = this.store.incr(key)

    req.rateLimit = {
      key,
      requests,
      limit: this.options.max,
      remaining: Math.max(this.options.max - requests, 0)
    }

    res.set('X-RateLimit-Limit', req.rateLimit.limit)
    res.set('X-RateLimit-Remaining', req.rateLimit.remaining)

    if (this.options.max && requests > this.options.max) { return this.options.handler(this.store, req, res) }

    return next()
  }

  unlimit (req, res) {
    this.store.decr(req.rateLimit.key)

    req.rateLimit.requests--
    req.rateLimit.remaining++

    res.set('X-RateLimit-Limit', req.rateLimit.limit)
    res.set('X-RateLimit-Remaining', req.rateLimit.remaining)
  }
}

module.exports = RateLimiter
