(function() {

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

  var beacon = new createjs.Bitmap('images/ibeacon.png');
  var moving = false;
  var self = this;

  Object.keys(data).forEach(function(key) {
    beacon[key] = data[key];
  });

  beacon.show = function() {
    var cm = new createjs.ColorMatrix();
    cm.adjustColor(0, 0, 0, 0);
    var color = new createjs.ColorMatrixFilter(cm);
    this.filters = [color];
    this.cache(0, 0, 100, 100);
  };

  beacon.hide = function() {
    var cm = new createjs.ColorMatrix();
    cm.adjustColor(0, 0, -100, 0);
    var color = new createjs.ColorMatrixFilter(cm);
    this.filters = [color];
    this.cache(0, 0, 100, 100);
  };

  beacon.on('mousedown', function(event) {
    moving = false;
    this.offset = {
      x: this.x - event.stageX,
      y: this.y - event.stageY
    };
  });
  
  beacon.on('pressmove', function(event) {
    moving = true;
    this.x = event.stageX + this.offset.x;
    this.y = event.stageY + this.offset.y;
  });

  beacon.on('pressup', function(event) {
    self.save();
    self.trigger('change');
  });

  beacon.on('click', function(event) {
    // ドラッグアンドドロップ終了時もclickイベント発火するので、動かした
    // 後はclickイベント発火しないようにする
    if (!moving) {
      alert(JSON.stringify(this));
    }
  });

  beacon.toJSON = function() {
    return {
      id: this.id,
      uuid: this.uuid,
      major: this.major,
      minor: this.minor,
      x: this.x,
      y: this.y
    };
  };

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

// expose
window.Beacons = Beacons;

})();
