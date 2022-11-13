const validator = require ('validator')

// Vérifier si l'email est correct
module.exports = (req, res, next) => {
    
    if(validator.isEmail(req.body.email)){
        next()
    } else {
        return res.status(400).json({error: "invalid email address" })
    }
}
