const HttpStatus = require('http-status-codes');
var jwt = require('jsonwebtoken');
const Poll = require('../models/Poll');
const config = require('../config/config.json');
const utils = require('../utils/index');

// JSON API for list of polls
exports.list = function (req, res) {
  Poll.find({
    "isDeleted" : false
  }, ['owner', 'question', 'choices'])
    .populate('owner', 'email')
    .exec(function (error, polls) {
      res.send({
        polls: polls,
      });
    });
};

// JSON API for list of polls
exports.mypolls = function (req, res) {

  let token = utils.getTokenFromReq(req);
  console.log('mypolls token ', token);
  var userId = req.user.userid;
  console.log("userID mypolls ", userId);
  Poll.find({
      "owner": userId,
      "isDeleted" : false
    }, ['owner', 'question', 'choices'])
    .populate('owner', 'email')
    .exec(function (error, polls) {
      if (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          error: {
            msg: error,
          },
        });
      } else {
        res.send({
          polls: polls,
        });
      }
    });
};
// JSON API for getting a single poll
exports.poll = function (req, res) {
  var pollId = req.query.pollid;
  Poll.findById(
    pollId,
    '', {
      lean: true,
    },
    function (err, poll) {
      if (poll) {
        var userVoted = false,
          userChoice,
          totalVotes = 0;
        for (c in poll.choices) {
          var choice = poll.choices[c];
          for (v in choice.votes) {
            var vote = choice.votes[v];
            totalVotes++;
            if (vote.ip === (req.header('x-forwarded-for') || req.ip)) {
              userVoted = true;
              userChoice = {
                _id: choice._id,
                text: choice.text,
              };
            }
          }
        }
        poll.userVoted = userVoted;
        poll.userChoice = userChoice;
        poll.totalVotes = totalVotes;
        res.json(poll);
      } else {
        res.json({
          error: true,
        });
      }
    },
  );
};

// JSON API for getting a single poll
exports.vote = function (req, res) {
  let pollId = req.body.pollId;
  let choiceId = req.body.choiceId;
  let newChoice = req.body.newChoice;
  let userId = null;
  let token = utils.getTokenFromReq(req);
  console.log('token ', token);
  if (token) {
    try {
      var decoded = jwt.verify(token, config.secret);
      console.log('decoded', decoded);
      userId = decoded.userid;
    } catch (error) {
      console.log('error json token error');
    }
  }
  const ip = req.header('x-forwarded-for') || req.ip;

  // remove the vote that match ip and userId
  Poll.update({
      _id: pollId,
      'choices.votes.user_id': userId,
      'choices.votes.ip': ip,
    }, {
      $pull: {
        'choices.$.votes': {
          ip: ip,
          user_id: userId,
        },
      },
    }, {
      multi: true,
    },
    function (err, pollupdated) {
      if (err) {
        console.log('error', err);
      }
      console.log('pollupdated', pollupdated);
      Poll.findById(pollId, function (err, poll) {
        let choice;
        if (choiceId) {
          choice = poll.choices.id(choiceId);
          if (!choice) {
            return res.status(HttpStatus.BAD_REQUEST).send({
              error: {
                msg: 'The request params is not correct.',
              },
            });
          }
          if (!choice.votes) {
            choice.votes = [];
          }
          choice.votes.push({
            ip: ip,
            user_id: userId,
          });
        } else if (newChoice) {
          choice = {
            text: newChoice,
            votes: [{
              ip: ip,
              user_id: userId,
            }, ],
          };
          poll.choices.push(choice);
        }
        poll.save(function (err, doc) {
          if (err) {
            return res.status(HttpStatus.CONFLICT).send({
              error: {
                msg: err,
              },
            });
          }
          var theDoc = {
            question: doc.question,
            _id: doc._id,
            choices: doc.choices,
            userVoted: false,
            totalVotes: 0,
          };
          for (var i = 0, ln = doc.choices.length; i < ln; i++) {
            var choice = doc.choices[i];
            for (var j = 0, jLn = choice.votes.length; j < jLn; j++) {
              var vote = choice.votes[j];
              theDoc.totalVotes++;
              theDoc.ip = ip;
              if (vote.ip === ip) {
                theDoc.userVoted = true;
                theDoc.userChoice = {
                  _id: choice._id,
                  text: choice.text,
                };
              }
            }
          }
          res.send({
            poll: theDoc,
          });
        });
      });
    },
  );
};


// JSON API for getting a single poll
exports.remove = function (req, res) {
  let pollId = req.params.pollId;
  let userId = req.user.userid;;

  Poll.update({
      _id: pollId,
    }, {
      $set: {
        'isDeleted': true,
      },
    },
    function (err, result) {
      if (err) {
        console.log('error', err);
        return res.status(HttpStatus.CONFLICT).send({
          error: {
            msg: err,
          },
        });
      }

      return res.send({
          msg: __("The poll is removed.")
      });
    },
  );
};

// JSON API for creating a new poll
exports.create = function (req, res) {
  var userid = req.user.userid;

  console.log('create polls req body', req.body);
  var reqBody = req.body;
  var choices = reqBody.choices.filter(function (v) {
    return v.text != '';
  });
  choices = choices.map(choice => {
    var choiceObj = {
      text: choice,
      votes: [],
    };
    return choiceObj;
  });
  var question = reqBody.question;
  console.log('create polls req question', question);
  console.log('create polls req typeof choice ', typeof choices);
  var pollObj = {
    owner: userid,
    question: question,
    choices: choices,
  };
  var poll = new Poll(pollObj);
  poll.save(function (err, doc) {
    if (err || !doc) {
      console.log('err', err);
      console.log('doc', doc);
      throw 'Error';
    } else {
      res.json(doc);
    }
  });
};