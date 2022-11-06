const Thing = require('../models/Thing');

exports.createThing = (req,res, next) => {
    const thingObject = JSON.parse(req.body.thing)   
        delete thingObject._id;
        delete thingObject.user_Id
    const thing = new Thing ({
        ...thingObject,
        userId : req.auth.userId,
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
      
    thing.save()
        .then(() => res.status(201).json({message : "Objet enregistré"}))
        .catch(error => res.status(400).json({error}));
        
};

exports.modifyThing = (req, res, next) => {
    Thing.UpdateOne({ _id: req.params.id }, {...req.body, _id: req.params.id})
        .then(() => res.status(200).json({message: "Objet modifié"}))
        .catch(error => res.status(400).json({error}));
}

exports.deleteThing = (req, res, next) => {
    Thing.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({message: "Objet supprimé"}))
        .catch(error => res.status(400).json({error}));
};

exports.getThings = (req, res, next) => {
    Thing.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(404).json({error}));
}

exports.getOnething = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({error}));
}

exports.getLikesThing = (req, res, next) => {
    const like = JSON.parse(req.body.thing)
    delete like._id;
    delete like.user_Id
    const thing = new Thing ({
        ...like,
        userId: req.auth.userId       
    })   
    thing.save()
        .then(() => res.status(201).json({message: "Objet liké"}))
        .catch(error => res.status(400).json({ error }));
}
