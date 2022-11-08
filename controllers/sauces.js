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
    if (!req.auth.userId) {
        return res.status(403).json({ message: "unauthorized request" })
    }
    Sauce.updateOne({ _id: req.params.id },
        { ...req.body, _id: req.params.id },
        { userId: req.auth.userId }
    )
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
    const userId = req.auth.userId;

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {

            switch (like) {
                case 1:
                    if(!sauce.usersLiked.includes(userId)){
                    Sauce.updateOne({ _id: req.params.id },
                        {
                            $inc: { likes: +1 },
                            $push: { usersLiked: userId }
                        })
                        .then(() => res.status(200).json({ message: "Sauce liker" }))
                        .catch(error => res.status(400).json({ error }))
                    }
                    break;
                    
                case -1:
                    if(!sauce.usersDisliked.includes(userId)){
                    Sauce.updateOne({ _id: req.params.id },
                        {
                            $inc: { dislikes: +1 },
                            $push: { usersDisliked: userId }
                        }
                    )
                        .then(() => res.status(200).json({ message: "Sauce disliker" }))
                        .catch(error => res.status(400).json({ error }))
                    }
                    break;

                case 0:
                    if(sauce.usersLiked.includes(userId)){
                    Sauce.updateOne({ _id: req.params.id },
                        {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: userId }
                        }
                    )
                        .then(() => res.status(200).json({ message: "Like retiré" }))
                        .catch(error => res.status(400).json({ error }))
                    }
                    break;

                case 0:
                    if(sauce.usersDisliked.includes(userId)){
                    Sauce.updateOne({ _id: req.params.id },
                        {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: userId }
                        }
                    )
                        .then(() => res.status(200).json({ message: "Dislike retiré" }))
                        .catch(error => res.status(400).json({ error }))
                    }
                    break;
            }
        })

        .catch(error => res.status(500).json({ error }));
}



