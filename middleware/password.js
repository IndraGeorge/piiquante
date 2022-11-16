const passwordValidator = require ('password-validator')

// Déclaration d'une constance pour le schéma du mot de passe
const passwordSchema = new passwordValidator () 

// Conditions à respecter pour un mot de passe valide
passwordSchema
.is().min(8)                                    // Longueur minimale 8
.is().max(100)                                  // Longueur maximale 100
.has().uppercase()                              // Doit contenir des lettres majuscules
.has().lowercase()                              // Doit contenir des lettres minuscules
.has().digits(2)                                // Doit contenir au moins 2 chiffres
.has().not().spaces()                           // Pas d'espace
.is().not().oneOf(['Passw0rd', 'Password123']); // Mettre ces valeurs sur liste noire


// Comparaison du mot de passe rentré par l'utilisateur par rapport au schéma 
module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next()

    } else {
        return res.status(400).json({error: ` The password must contain at least 8 characters,
        including 1 uppercase, 1 lowercase, 2 digits`})
        
    }
}