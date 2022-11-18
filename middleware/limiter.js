const rateLimit = require('express-rate-limit')

// Limite les tentatives de connexions
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: "Try again in 15 minutes",
    max: 5, // Limitez chaque adresse IP à 100 requêtes par "fenêtre" (par tranche de 15 minutes)
    standardHeaders: true, // Renvoyer les informations de limite de taux dans les en-têtes `RateLimit-*`
    legacyHeaders: false, // Désactiver les en-têtes `X-RateLimit-*`
})

module.exports = {apiLimiter}