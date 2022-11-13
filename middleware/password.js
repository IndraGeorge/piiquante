const passwordValidator = require ('password-validator')

// Déclaration d'une constance pour le schéma du mot de passe
const passwordSchema = new passwordValidator () 

// Conditions à respecter pour un mot de passe valide
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values


// Comparaison du mot de passe rentré par l'utilisateur par rapport au schéma 
module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next()

    } else {
        return res.status(400).json({error: ` The password must contain at least 8 characters,
        including 1 uppercase, 1 lowercase, 2 digits`})
        
    }
}