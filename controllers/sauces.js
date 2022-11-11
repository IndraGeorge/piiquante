const Sauce = require('../models/Sauces');
const fs = require('fs')

// Créer une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;
    delete sauceObject.userId
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: "Saved Sauce" }))
        .catch(error => res.status(400).json({ error }));
};


// Mofifier une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {

        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }

    delete sauceObject.userId
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.auth.userId !== sauce.userId) {
                return res.status(403).json({ message: "unauthorized request" })

            } else {
                const filename = sauce.imageUrl.split('/images/')[1]
                Sauce.updateOne({ _id: req.params.id },
                    { ...sauceObject, _id: req.params.id },
                )
                    .then(() => res.status(201).json({ message: "modified sauce" }))

                    // Condition afin de vérifier si l'image a été modifiée
                    .then(sauce => {
                        if (sauce.imageUrl !== req.body.sauce) {
                            fs.unlink(`images/${filename}`, () => {
                                console.log("old picture deleted")
                            })
                        }else {
                            console.log("preserved image")
                        }

                    })
                    .catch(error => res.status(400).json({ error }));
            }
        }) 
        .catch(error => res.status(500).json({ error }))
};


// Supprimer une sauce
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
        .then(things => res.status(200).json(things))
        .catch(error => res.status(404).json({ error }));
}

// Afficher une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}

// Like et Dislike des utilisateurs sur une sauce
exports.likesAndDislikeSauce = (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {

            switch (like) {
                // L'utilisateur aime une sauce
                case 1:
                    if (!sauce.usersLiked.includes(userId)) {
                        Sauce.updateOne({ _id: req.params.id },
                            {
                                $inc: { likes: +1 },
                                $push: { usersLiked: userId }
                            })
                            .then(() => res.status(200).json({ message: "Like added" }))
                            .catch(error => res.status(400).json({ error }))
                    }
                    break;

                // L'utilisateur n'aime pas une sauce
                case -1:
                    if (!sauce.usersDisliked.includes(userId)) {
                        Sauce.updateOne({ _id: req.params.id },
                            {
                                $inc: { dislikes: +1 },
                                $push: { usersDisliked: userId }
                            }
                        )
                            .then(() => res.status(200).json({ message: "Dislike added" }))
                            .catch(error => res.status(400).json({ error }))
                    }
                    break;

                // L'utilisateur enlève son like ou son dislike
                case 0:
                    if (sauce.usersLiked.includes(userId)) {
                        Sauce.updateOne({ _id: req.params.id },
                            {
                                $inc: { likes: -1 },
                                $pull: { usersLiked: userId }
                            }
                        )
                            .then(() => res.status(200).json({ message: "Like added" }))
                            .catch(error => res.status(400).json({ error }))

                    } else if (sauce.usersDisliked.includes(userId)) {
                        Sauce.updateOne({ _id: req.params.id },
                            {
                                $inc: { dislikes: -1 },
                                $pull: { usersDisliked: userId }
                            }
                        )
                            .then(() => res.status(200).json({ message: "Dislike added" }))
                            .catch(error => res.status(400).json({ error }))
                    }
                    break;
            }
        })

        .catch(error => res.status(500).json({ error }));
}



