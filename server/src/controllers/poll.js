const HttpStatus = require('http-status-codes');
var jwt = require('jsonwebtoken');
const Poll = require('../models/Poll');
const config = require('../config/config.json');
const utils = require('../utils/index');

// JSON API for list of polls
exports.list = function (req, res) {
  Poll.find({}, ['owner', 'question', 'choices'])
    .populate('owner', 'email')
    .exec(function (error, polls) {
      res.send({
        polls: polls,
      });
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
  var pollId = req.body.pollId;
  var choiceId = req.body.choiceId;
  var userId = null;
  var token = utils.getTokenFromReq(req);
  console.log('token ', token);
  if (token) {
    try {
      var decoded = jwt.verify(token, config.secret);
      console.log('decoded', decoded);
      userId = decoded.userid;
    } catch (error) {
      console.log('error ', error);
    }
  }
  const ip = req.header('x-forwarded-for') || req.ip;

  Poll.update({
      _id: pollId,
      "choices.votes.user_id": userId,
      "choices.votes.ip": ip
    }, {
      $pull: {
        "choices.$.votes": {
          ip: ip,
          user_id: userId
        }
      }
    }, {
      multi: true
    },
    function (err, pollupdated) {
      if (err) {
        console.log("error", err);
      }
      console.log("pollupdated", pollupdated);
      Poll.findById(pollId, function (err, poll) {
        var choice = poll.choices.id(choiceId);
        if (!choice.votes) {
          choice.votes = [];
        }
        choice.votes.push({
          ip: ip,
          user_id: userId
        });
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
                  text: choice.text
                };
              }
            }
          }
          res.send({
            poll: theDoc,
          });
        });
      });
    });
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