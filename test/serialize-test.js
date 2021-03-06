var should    = require('should')
  , generator = new (require('../lib/mapping-generator'))
  , serialize = require('../lib/serialize')
  , mongoose  = require('mongoose')
  , Schema    = mongoose.Schema
  , ObjectId  = Schema.Types.ObjectId;

var BowlingBall = mongoose.model('BowlingBall', new Schema({

}));
var PersonSchema22 = new Schema({
  name: {
      first: String
    , last: String
  },
  dob: Date,
  bowlingBall: {type:Schema.ObjectId, ref:'BowlingBall'},
  games: [{score: Number, date: Date}]
});

var Person = mongoose.model('Person22', PersonSchema22);

var mapping;

// Serialize method requires a schema mapping
generator.generateMapping(PersonSchema22, function(err, tmp) {
  mapping = tmp;
});

describe('serialize', function(){
  var dude = new Person({
    name: {first:'Jeffrey', last:'Lebowski'},
    dob: new Date(Date.parse('05/17/1962')),
    bowlingBall: new BowlingBall(),
    games: [{score: 80, date: new Date(Date.parse('05/17/1962'))}, {score: 80, date: new Date(Date.parse('06/17/1962'))}]
  });

  // another person with missing parts to test robustness
  var millionnaire = new Person({
    name: {first:'Jeffrey', last:'Lebowski'},
  });

  it('should serialize a document with missing bits', function(){
    var serialized = serialize(millionnaire, mapping);
    serialized.should.have.property('games', []);
  });

  describe('with no indexed fields', function(){
    var serialized = serialize(dude, mapping);
    it('should serialize model fields', function(){
      serialized.name.first.should.eql('Jeffrey');
      serialized.name.last.should.eql('Lebowski');
    });
    it('should serialize object ids as strings', function(){
      serialized.bowlingBall.should.eql(dude.bowlingBall);
    });
    it('should serialize dates in ISO 8601 format', function(){
      serialized.dob.should.eql(dude.dob);
    });
    it('should serialize nested arrays', function(){
      serialized.games.should.have.lengthOf(2);
      serialized.games[0].should.have.property('score', 80);
    });
  });

  describe('indexed fields', function(){

  });
});
