const Sauce = require('../models/Sauces');


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



