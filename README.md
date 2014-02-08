# iBeacon Map

IBeaconMap クラス (js/ibeaconmap.js) の使い方

## メソッド

### IBeaconMap()

* コンストラクタ。

### initialize()

* canvasを初期化します。

### addBeacon(id, x, y)

* iBeacon を canvas に表示します。未実装。

### moveBeacon(id, x, y)

* canvas 上の iBeacon を移動します。未実装。

### removeBeacon(id)

* iBeacon を canvas から削除します。未実装。

### addPerson(id, x, y)

* 人を canvas に表示します。画像ファイルは images/_id_.jpg が使われます。

### movePerson(id, x, y)

* canvas 上の人を移動します。未実装。

### removePerson(id)

* 人を canvas から削除します。未実装。

### _loadImage(id)

* 画像読み込み用。未実装。

### _draw(img, x, y)

* 画像をビットマップとして canvas に描画します。