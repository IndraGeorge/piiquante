const Sauce = require('../models/Sauces');
const fs = require('fs')

// Création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)

    // Déclaration d'une regex
    let regexLetter = new RegExp("^[a-zA-Z0-9éèîëïäöüùçâà .',!?-]{3,30}$")

    // Condition afin de vérifier la validité des champs saisies pour la création d'une sauce
    if (regexLetter.test(sauceObject.name) && regexLetter.test(sauceObject.manufacturer) &&
        regexLetter.test(sauceObject.description) && regexLetter.test(sauceObject.mainPepper)) {

        // On enlève l'id du corps de la requête
        delete sauceObject._id
        // On supprime l'userId du corps de la requête
        delete sauceObject.userId

        const sauce = new Sauce({
            ...sauceObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });
        sauce.save()
            .then(() => res.status(201).json({ message: "Saved Sauce" }))
            .catch(error => res.status(400).json({ error }));

    } else {
        return res.status(400).json({ error: "Please enter correct information" })
    }
};


// Modification d'une sauce
exports.modifySauce = (req, res, next) => {

    // On vérifie si l'image est modifiée avec l'opérateur ternaire
    const sauceObject = req.file ? {

        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }

    delete sauceObject.userId

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {

            // Déclaration d'une regex
            let regexLetter = new RegExp("^[a-zA-Z0-9éèîëïäöüùçâà .',!?-]{3,30}$")

            // On vérifie la validité des champs saisis pour la modification d'une sauce
            if (regexLetter.test(sauceObject.name) && regexLetter.test(sauceObject.manufacturer) &&
                regexLetter.test(sauceObject.description) && regexLetter.test(sauceObject.mainPepper)) {

                // On vérifie si le userId correspond au propriétaire de la sauce
                if (req.auth.userId !== sauce.userId) {
                    return res.status(403).json({ message: "unauthorized request" })

                } else {

                    const filename = sauce.imageUrl.split('/images/')[1]
                    Sauce.updateOne({ _id: req.params.id },
                        { ...sauceObject, _id: req.params.id })

                        .then(() => res.status(201).json({ message: "modified sauce" }))

                        // On supprime l'ancienne image si elle a été modifiée
                        .then(() => {
                            if (req.file) {
                                fs.unlink(`images/${filename}`, () => {
                                    return ('old picture delete')
                                })
                            }

                        })
                        .catch(error => res.status(400).json({ error }));
                }

            } else {
                return res.status(400).json({ error: "Please enter correct information" })
            }
            
        })
        .catch(error => res.status(500).json({ error }))

};


// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.auth.userId == sauce.userId) {

                const filename = sauce.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: "Sauce removed" }))
                        .catch(error => res.status(400).json({ error }));
                })
            } else {
                return res.status(403).json({ message: "unauthorized request" })
            }

        })
        .catch(error => res.status(500).json({ error }))
};


// Afficher toutes les sauces
exports.getSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
}


// Afficher une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}

