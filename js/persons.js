(function() {

function Persons() {
  this.persons = {};
}

Persons.prototype.create = function(id, position) {
  if (this.persons[id]) {
    throw new Error(id + ' is already exists');
  }

  var person = new createjs.Bitmap('images/person/' + id + '.jpg');

  person.x = position.x;
  person.y = position.y;

  person.move = function(position) {
    createjs.Tween.get(this).to(position, 500);
  };

  this.persons[id] = person;

  return person;
};

Persons.prototype.findById = function(id) {
  return this.persons[id] || null;
};

Persons.prototype.removeById = function(id) {
  var person = this.persons[id];

  if (person) {
    delete this.persons[id];
    return person;
  }
};

// expose
window.Persons = Persons;

})();
