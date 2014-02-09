var IBeaconController = function() {

    // beacon の増減のチェック用
    this.beacons = iBeaconMap.getBeacons();
    /*
    this.beacons = [
        {
            uuid: '000000008e5b1001b000001c4db3db2c',
            major: 0,
            minor: 0
        }, {
            uuid: '000000008e5b1001b000001c4db3db2c',
            major: 0,
            minor: 1
        }, {
            uuid: '000000008e5b1001b000001c4db3db2c',
            major: 0,
            minor: 2
        }
     ];
     */

    // person の座標の計算用
    this.coordinates = this.beacons;
    /*
    this.coordinates = [
        {
            uuid: '000000008e5b1001b000001c4db3db2c',
            major: 0,
            minor: 0,
            x: 0,
            y: 0
        }, {
            uuid: '000000008e5b1001b000001c4db3db2c',
            major: 0,
            minor: 1,
            x: 800,
            y: 0
        }, {
            uuid: '000000008e5b1001b000001c4db3db2c',
            major: 0,
            minor: 2,
            x: 0,
            y: 600
        }
    ];
     */

    // person の増減のチェック用
    this.persons = [];
    /*
    this.persons = ['hokaccha', 'nakakura', 'otsuya'];
    */
};

IBeaconController.prototype.initialize = function() {

//    iBeaconClient.getBeacons();
    var adapter = new DataMapper.Adapter();
    adapter.set_callback(this.getBeaconsHandler.bind(this));

    //iBeaconMap.getCoordinates(this.getCoordinatesHandler.bind(this));
};

IBeaconController.prototype.getBeaconsHandler = function(data) {
    for (var i = 0, il = data.length; i < il; i++) {
        // person の loop 開始
        var person = data[i];

        // immediate, near, far の数を数える
        // ついでに座標の平均を取る準備をしておく
        var proximity = {
            immediate: {
                x: [],
                y: []
            },
            near: {
                x: [],
                y: []
            },
            far: {
                x: [],
                y: []
            }
        };

        for (var j = 0, jl = person.data.length; j < jl; j++) {
            // beacon の loop 開始
            var beacon = person.data[j];

            switch (beacon.proximity) {
                case 'immediate':
                case 'near':
                case 'far':
                    //この beacon の座標を調べる
                    var uuid = beacon.uuid.toLowerCase();
                    var major = beacon.major.toLowerCase();
                    var minor = beacon.minor.toLowerCase();

                    for (var k = 0, kl = this.coordinates.length; k < kl; k++) {
                        var coordinate = this.coordinates[k];
                        if (uuid === coordinate.uuid.toLowerCase()
                                && major === coordinate.major.toLowerCase()
                                && minor === coordinate.minor.toLowerCase()) {
                            //座標が見つかったら、平均計算用のオブジェクトに代入する
                            proximity[beacon.proximity].x.push(coordinate.x);
                            proximity[beacon.proximity].y.push(coordinate.y);
                            break;
                        }
                    }

                    break;
                case 'lost':
                    // ひとりの person から beacon が見えなくなっただけで、
                    // beacon が消えたとは限らないから、beacon は消さない。
                    //iBeaconMap.hideBeacon(beacon.uuid, beacon.major, beacon.minor);
                    break;
            }

            //初めて見た beacon の uuid / major / minor かを調べる
            //this.beacons の loop を開始
            //var isNewBeacon = true;
            //for (var k = 0, kl = this.beacons.length; k < kl; k++) {
            //    var thisBeacon = this.beacons[k];
            //    if (thisBeacon.uuid === beacon.uuid && thisBeacon.major === beacon.major && thisBeacon.minor === beacon.minor) {
            //        isNewBeacon = false;
            //    }
            //}

            //if (isNewBeacon) {
            //    //増減チェック用の配列に格納し、
            //    this.beacons.push({uuid: beacon.uuid, major: beacon.major, minor: beacon.minor});
            //    //beacon を map に表示する
            //    iBeaconMap.addBeacon({
            //      uuid: beacon.uuid,
            //      major: beacon.major,
            //      minor: beacon.minor
            //    });
            //    return;
            //}
        }

        //汚いコード・・・

        console.log('person.id = ' + person.id + ', immediate = ' + proximity.immediate.x.length + ', near = ' + proximity.near.x.length
            + ', far = ' + proximity.far.x.length);

        if (proximity.immediate.x.length >= 1) {
            // immediate が1個以上なので、immediateの平均を計算
            person.x = proximity.immediate.x.reduce(function(prev, current) {return (prev - 0) + (current - 0)})
                / proximity.immediate.x.length;
            person.y = proximity.immediate.y.reduce(function(prev, current) {return (prev - 0) + (current - 0)})
                / proximity.immediate.y.length;
        } else if (proximity.near.x.length >= 1) {
            // near が1個以上なので、immediateの平均を計算
            person.x = proximity.near.x.reduce(function(prev, current) {return (prev - 0) + (current - 0)})
                / proximity.near.x.length;
            person.y = proximity.near.y.reduce(function(prev, current) {return (prev - 0) + (current - 0)})
                / proximity.near.y.length;
        } else if (proximity.far.x.length >= 1) {
            // far が1個以上なので、immediateの平均を計算
            person.x = proximity.far.x.reduce(function(prev, current) {return (prev - 0) + (current - 0)})
                / proximity.far.x.length;
            person.y = proximity.far.y.reduce(function(prev, current) {return (prev - 0) + (current - 0)})
                / proximity.far.y.length;
        } else {
            // immediate も near も far もないので、消滅
            iBeaconMap.removePerson(person.id);
            return;
        }

        //初めて見た person.id だったら
        if (this.persons.indexOf(person.id) === -1) {
            //増減チェック用の配列に格納し、
            this.persons.push(person.id);

            //person を map から消す
            iBeaconMap.addPerson(person.id, { x: person.x, y: person.y });
            return;
        }

        //既に表示済みの person.id の場合は、移動する
        iBeaconMap.movePerson(person.id, { x: person.x, y: person.y });
    }
};

IBeaconController.prototype.getCoordinatesHandler = function(data) {
    // 座標が通知されたので代入
    this.coordinates = data;

    // 何でこんなコードを書いたのか思い出せない
    /*
    for (var i = 0, il = data.length; i < il; i++) {
        var cordinate = data[i];
        var uuid = cordinate.uuid;
        var major = cordinate.major;
        var minor = cordinate.minor;
        var x = cordinate.x;
        var y = cordinate.y;

        for (var j = 0, jl = this.coordinates.length; j < jl; j++) {
            var beacons = this.beacons[j];
            if (!(uuid === beacons.uuid && major === beacons.major && minor === beacons.minor)) {
                this.beacons.push(cordinate);
                break;
            }
            if (x !== beacons.x || y !=== beacons.y) {
                this.beacons[j].x = x;
                this.beacons[j].y = y;
            }
        }
    }
    */

};
