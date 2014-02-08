# iBeacon Map

IBeaconMap クラス (js/ibeaconmap.js) の使い方

## メソッド

### IBeaconMap()

* コンストラクタ。

### initialize()

* canvasを初期化します。

### getBeacons()

* 設置されているビーコンの情報を返します

```javascript
iBeaconMap.getBeacons();
// =>
[
    { id: 1, uuid: 'b9407f30f5f8466eaff925556b57fe6d', major: 1, minor: 1, x: 10, y: 100 },
    { id: 2, uuid: 'b9407f30f5f8466eaff925556b57fe6d', major: 1, minor: 2, x: 20, y: 200 },
    { id: 3, uuid: 'b9407f30f5f8466eaff925556b57fe6d', major: 1, minor: 3, x: 30, y: 300 },
    { id: 4, uuid: 'b9407f30f5f8466eaff925556b57fe6d', major: 1, minor: 4, x: 40, y: 400 },
    { id: 5, uuid: 'b9407f30f5f8466eaff925556b57fe6d', major: 1, minor: 5, x: 50, y: 500 },
    { id: 6, uuid: 'b9407f30f5f8466eaff925556b57fe6d', major: 1, minor: 6, x: 60, y: 600 },
    { id: 7, uuid: 'b9407f30f5f8466eaff925556b57fe6d', major: 1, minor: 7, x: 70, y: 700 },
    { id: 8, uuid: 'b9407f30f5f8466eaff925556b57fe6d', major: 1, minor: 8, x: 80, y: 800 },
    { id: 9, uuid: 'b9407f30f5f8466eaff925556b57fe6d', major: 1, minor: 9, x: 90, y: 900 }
]
```

### addBeacon(data)

* iBeacon を canvas に表示します。

```javascript
iBeaconMap.addBeacon({ uuid: 'xxx', major: 1, minor: 2 });
```

### hideBeacon(id)

* canvas 上の iBeacon を非表示状態（グレイアウト）にします。

### showBeacon(id)

* canvas 上の iBeacon を表示状態（グレイアウト解除）にします。

### removeBeacon(id)

* iBeacon を canvas から削除します。

### addPerson(id, position)

* 人を canvas に表示します。画像ファイルは images/person/_id_.jpg が使われます。

```javascript
IBeaconMap.addPerson('hokaccha', { x: 100, y: 100 });
```

### movePerson(id, position)

* canvas 上の人を移動します。

```javascript
IBeaconMap.movePerson('hokaccha', { x: 200, y: 200 });
```

### removePerson(id)

* 人を canvas から削除します。
