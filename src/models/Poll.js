var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var voteSchema = new mongoose.Schema({ ip: 'String', user_id: 'String' });
var choiceSchema = new mongoose.Schema({
  text: String,
  votes: [voteSchema],
});
var PollSchema = new mongoose.Schema({
  ownerId: { type: ObjectId, ref: 'User', required: true },
  question: { type: String, required: true },
  choices: [choiceSchema],
});

const Poll = mongoose.model('Poll', PollSchema);

module.exports = Poll;
