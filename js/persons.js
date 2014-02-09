(function() {

    function Persons() {
        this.persons = {};
    }

    Persons.prototype.create = function(id, position) {
        if (this.persons[id]) {
            throw new Error(id + ' is already exists');
        }

        var isKnownPersonId = ['hokaccha', 'nakakura', 'rotsuya'].indexOf(id) !== -1;
        var filename = isKnownPersonId ? 'images/person/' + id + '.jpg' : 'images/person/default.jpg';

        var person = new createjs.Bitmap(filename);

        person.x = position.x;
        person.y = position.y;

        if (isKnownPersonId) {
            person.scaleX = 0.5;
            person.scaleY = 0.5;
        }

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
