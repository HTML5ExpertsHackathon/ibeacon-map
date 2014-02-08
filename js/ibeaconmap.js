/**
 * Created by Ryosuke Otsuya, Kazuhito Hokamura at HTML5 Experts Hackathon on 2014/02/08.
 * iBeacon Map
 */

var IBeaconMap = function() {
  this.beacons = new Beacons();
  this.persons = new Persons();
  this.stageWidth = 0;
  this.stageHeight = 0;
};

IBeaconMap.prototype.initialize = function() {
  var $stage = $('#stage');
  this.stageWidth = $stage.width();
  this.stageHeight = $stage.height();
  $stage.attr({
    width: this.stageWidth,
    height: this.stageHeight
  });
  this.stage = new createjs.Stage($stage.get(0));
  createjs.Ticker.addEventListener('tick', this.stage.update.bind(this.stage));

  // localStorageのデータを復元
  this.beacons.forEach(function(beacon) {
    this.stage.addChild(beacon);
  }, this);
};

IBeaconMap.prototype.getBeacons = function() {
  return this.beacons.all();
};

IBeaconMap.prototype.addBeacon = function(data) {
  var beacon = this.beacons.create(data, { save: true });
  this.stage.addChild(beacon);
};

IBeaconMap.prototype.hideBeacon = function(id) {
  this.beacons.findById(id).hide();
};

IBeaconMap.prototype.showBeacon = function(id) {
  this.beacons.findById(id).show();
};

IBeaconMap.prototype.removeBeacon = function(id) {
  var beacon = this.beacons.removeById(id);
  if (beacon) this.stage.removeChild(beacon);
};

IBeaconMap.prototype.addPerson = function(id, position) {
  var person = this.persons.create(id, position);
  this.stage.addChild(person);
};

IBeaconMap.prototype.movePerson = function(id, position) {
  this.persons.findById(id).move(position);
};

IBeaconMap.prototype.removePerson = function(id) {
  var person = this.persons.removeById(id);
  if (person) this.stage.removeChild(person);
};
