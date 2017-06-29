import mongoose from 'mongoose';
import User from './user.js';
import Profile from './profile.js';

const foodSchema = new mongoose.Schema({
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  },
  // FACTORY
  food: {
    nameFood: {
      type: String
    },
    countVote: {
      type: [Boolean]
    },
    doNotEat: {
      type: Boolean,
      default: false
    },
    toTaste: {
      type: Boolean,
      default: false
    }
  },
});

function arrayLimit(val) {
  return val.length <= 3;
}

let model = mongoose.model('Food', foodSchema);

export default class Food {

  findAll(req, res) {
    model.find({})
      .populate('profile')
      .exec(function(err, foods) {
        if (err || !foods) {
          res.sendStatus(403);
        } else {
          console.log("FOOD POPULATE", 'profile');
          res.json(foods);
        }
      });
  }

  findByProfile(req, res) {
    model.find({
      profile: req.params.id
    })
    .exec(function(err, foods) {
      if (err || !foods) {
        res.sendStatus(403);
        console.log("findByProfile does not work");
      } else {
        res.json(foods);
      }
    });
  }

  notEating(req, res) {
    model.findOneAndUpdate({
        "food.nameFood": req.body.food.nameFood
      }, {
        $set: {
          "profile": req.body.profile,
          "food.countVote": req.body.food.countVote,
          "food.doNotEat": true,
          "food.toTaste": req.body.food.toTaste
        },
      }, {
        upsert: true,
        new: true
      },
      function(err, food) {
        if (err || !food) {
          res.status(500).send(err.message);
        } else {
          res.json(food);
        }
      });
  }

  taste(req, res) {
    model.findOneAndUpdate({
        "food.nameFood": req.body.food.nameFood
      }, {
        $set: {
          "profile": req.body.profile,
          "food.doNotEat": req.body.food.doNotEat,
          "food.toTaste": req.body.food.toTaste,
        },
      }, {
        upsert: true,
        new: true
      })
      .populate('profile')
      .exec(function(err, food) {
        if (err || !food) {
          res.status(500).send(err.message);
        } else {
          res.json(food);
        }
      });
  }

  // taste(req, res) {
  //   model.findOneAndUpdate({
  //       "food.nameFood": req.body.food.nameFood
  //     }, {
  //       $set: {
  //         "profile": req.body.profile,
  //         "food.doNotEat": req.body.food.doNotEat,
  //         "food.toTaste": req.body.food.toTaste,
  //       },
  //     }, {
  //       upsert: true,
  //       new: true
  //     },
  //     function(err, food) {
  //       if (err || !food) {
  //         res.status(500).send(err.message);
  //       } else {
  //         res.json(food);
  //       }
  //     });
  // }

  likeAll(req, res) {
    model.findOneAndUpdate({
        "food.nameFood": req.body.food.nameFood
      }, {
        $set: {
          "profile": req.body.profile,
          "food.countVote": [true, true, true],
          "food.doNotEat": req.body.food.doNotEat,
          "food.toTaste": req.body.food.toTaste,
        },
      }, {
        upsert: true,
        new: true
      },
      function(err, food) {
        if (err || !food) {
          res.status(500).send(err.message);
        } else {
          res.json(food);
        }
      });
  }

  like(req, res) {
    model.findOneAndUpdate({
        "food.nameFood": req.body.food.nameFood
      }, {
        $set: {
          "profile": req.body.profile,
          "food.doNotEat": req.body.food.doNotEat,
          "food.toTaste": req.body.food.toTaste
        },
        $push: {
            "food.countVote": req.body.food.countVote,
            $slice: 3
        }
      }, {
        upsert: true,
        multi: true,
        new: true
      })
      .populate('profile')
      .exec(function(err, food) {
        if (err || !food) {
          res.status(500).send(err.message);
        } else {
          console.log("req.body.profile", req.body.profile);
          res.json(food);
        }
      });
  }

}
