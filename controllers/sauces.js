const Sauce = require('../models/Sauces');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;
    delete sauceObject.userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
        .then(() => res.status(201).json({ message: "Objet enregistré" }))
        .catch(error => res.status(400).json({ error }));

};

exports.modifySauce = (req, res, next) => {
    if (!req.body.userId) {
        return res.status(403).json({ message: "unauthorized request" })
    } 
        Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
            .then(() => res.status(201).json({ message: "Objet modifié" }))
            .catch(error => res.status(400).json({ error }));
}

exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Objet supprimé" }))
        .catch(error => res.status(400).json({ error }));
};

exports.getSauces = (req, res, next) => {
    Sauce.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(404).json({ error }));
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}

exports.getLikesSauce = (req, res, next) => {
    const like = req.body.like;
    const idSauce = req.params.id
    const userLike = like.userId === Sauce.likes || like.userId === Sauce.dislike
    console.log(userLike)

    Sauce.findOne({ _id: idSauce })
        .then(() => res.status(201).json({ message: "Objet liké" }))
        .catch(error => res.status(400).json({ error }));
}

