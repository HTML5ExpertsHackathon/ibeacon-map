/**
 * Created by Ryosuke Otsuya at HTML5 Experts Hackathon on 2014/02/08.
 * iBeacon Map
 */

var IBeaconMap = function () {
    this.beacons = [];
    this.persons = [];
    this.stageWidth = 0;
    this.stageHeight = 0;
    this.loader = new createjs.LoadQueue();
};

IBeaconMap.prototype.initialize = function() {
    var $stage = $('#stage');
    this.stageWidth = $stage.width();
    this.stageHeight = $stage.height();
    $stage.attr({
        width: this.stageWidth,
        height: this.stageHeight
    });
    window.stage = new createjs.Stage($stage.get(0));
};

IBeaconMap.prototype.addBeacon = function(id, x, y) {
};

IBeaconMap.prototype.moveBeacon = function(id, x, y) {
};

IBeaconMap.prototype.removeBeacon = function(id) {
};

IBeaconMap.prototype.addPerson = function(id, x, y) {
    this.loader.addEventListener('complete', completeHandler.bind(this));
    this.loader.loadFile({
        src: 'images/' + id + '.jpg',
        id: id
    });

    function completeHandler (event) {
        var loader = event.target;
        loader.removeEventListener('complete', completeHandler);
        var img = loader.getResult(id);
        this.persons.push({
            id: id,
            img: img
        });
        this._draw(img, x, y);
    }
};

IBeaconMap.prototype.movePerson = function(id, x, y) {
};

IBeaconMap.prototype.removePerson = function(id) {
};

IBeaconMap.prototype._loadImage = function() {
};

IBeaconMap.prototype._draw = function(img, x, y) {
    var bitmap = new createjs.Bitmap(img);
    bitmap.x = x;
    bitmap.y = y;
    stage.addChild(bitmap);
    stage.update();
};

var iBeaconMap = new IBeaconMap();

