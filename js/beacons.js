(function() {

/**
 * @class Beacons
 */
function Beacons(opts) {
  opts = opts || {};

  Array.call(this);
  this.storageKey = opts.storageKey || 'beacons';
  this.observer = jQuery({});
  this.restore();
}

// 配列を継承するよ！
Beacons.prototype = Object.create(Array.prototype, {
  constructor: {
    value: Beacons,
    enumerable: false,
    writable: true,
    configurable: true
  }
});

// jQueryのイベントモデルを丸パクリ
Beacons.prototype.on = function() {
  this.observer.on.apply(this.observer, arguments);
};

Beacons.prototype.trigger = function() {
  this.observer.trigger.apply(this.observer, arguments);
};

// ローカルストレージに保存する
Beacons.prototype.save = function() {
  localStorage[this.storageKey] = JSON.stringify(this);
};

// ローカルストレージから復元する
Beacons.prototype.restore = function() {
  var result;

  try {
     result = JSON.parse(localStorage[this.storageKey]);
  }
  catch (e) {
    return;
  }

  result.forEach(function(data) {
    this.create(data, { save: false });
  }, this);
};

// idから探す
Beacons.prototype.findById = function(id) {
  for (var i = 0, len = this.length; i < len; i++) {
    if (this[i].id === id) return this[i];
  }

  return null;
};

Beacons.prototype.removeById = function(id) {
  for (var i = 0, len = this.length; i < len; i++) {
    var beacon = this[i];
    if (beacon.id === id) {
      this.splice(i, 1);
      this.save();
      return beacon;
    }
  }
};

// dataを元にcreatejs.Bitmapのインスタンスを作って返す
// stageには追加しないので呼び出す側で適時stageに追加する。
//
// Example:
//
//    var form = document.querySelector('.createForm');
//    form.addEventListener('submit', function(e) {
//      e.preventDefault();
//
//      var beacon = beacons.create({
//        uuid: form.querySelector('input[name="uuid"]').value,
//        major: form.querySelector('input[name="major"]').value,
//        minor: form.querySelector('input[name="minor"]').value,
//      }, { save: true });
//
//      stage.addChild(beacon);
//    });
//
Beacons.prototype.create = function(data, opts) {
  opts = opts || {};

  var isKnownBeacon = [19, 20, 21].indexOf(data.id) !== -1;
  var filename = isKnownBeacon ? 'images/ibeacon' + data.id + '.png' : 'images/ibeacon.png';

  var beacon = new Beacon(filename, { beacons: this });

  beacon.scaleX = 0.5;
  beacon.scaleY = 0.5;

  beacon.setData(data);

  this.push(beacon);

  if (opts.save) {
    this.save();
  }

  return beacon;
};

Beacons.prototype.toJSON = function() {
  return this.map(function(beacon) {
    return beacon.toJSON();
  });
};

Beacons.prototype.all = function() {
  return this.toJSON();
};


/**
 * @class Beacon
 */
function Beacon(src, opts) {
  createjs.Bitmap.call(this, src);

  this.moving = false;
  this.beacons = opts.beacons;

  this.on('mousedown', this._onMousedown.bind(this));
  this.on('pressmove', this._onPressmove.bind(this));
  this.on('pressup', this._onPressup.bind(this));
  this.on('click', this._onClick.bind(this));
}

Beacon.prototype = Object.create(createjs.Bitmap.prototype, {
  constructor: {
    value: Beacon,
    enumerable: false,
    writable: true,
    configurable: true
  }
});

Beacon.prototype.show = function() {
  var cm = new createjs.ColorMatrix();
  cm.adjustColor(0, 0, 0, 0);
  var color = new createjs.ColorMatrixFilter(cm);
  this.filters = [color];
  this.cache(0, 0, 100, 100);
};

Beacon.prototype.hide = function() {
  var cm = new createjs.ColorMatrix();
  cm.adjustColor(0, 0, -100, 0);
  var color = new createjs.ColorMatrixFilter(cm);
  this.filters = [color];
  this.cache(0, 0, 100, 100);
};

Beacon.prototype.setData = function(data) {
  Object.keys(data).forEach(function(key) {
    this[key] = data[key];
  }, this);
};

Beacon.prototype.toJSON = function() {
  return {
    id: this.id,
    uuid: this.uuid,
    major: this.major,
    minor: this.minor,
    x: this.x,
    y: this.y
  };
};

Beacon.prototype._onMousedown = function(event) {
  this.moving = false;
  this.offset = {
    x: this.x - event.stageX,
    y: this.y - event.stageY
  };
};

Beacon.prototype._onPressmove = function(event) {
  this.moving = true;
  this.x = event.stageX + this.offset.x;
  this.y = event.stageY + this.offset.y;
};

Beacon.prototype._onPressup = function(event) {
  this.beacons.save();
  this.beacons.trigger('change', this);
};

Beacon.prototype._onClick = function(event) {
  // ドラッグアンドドロップ終了時もclickイベント発火するので、動かした
  // 後はclickイベント発火しないようにする
  if (!this.moving) {
    alert(JSON.stringify(this));
  }
};

// expose
window.Beacons = Beacons;

})();
