var DataMapper = {};

(function (DataMapper) { "use strict";
var $estr = function() { return js.Boot.__string_rec(this,''); };
var HxOverrides = function() { }
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var Lambda = function() { }
Lambda.__name__ = true;
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
}
var Main = function() {
};
Main.__name__ = true;
Main.main = function() {

}
Main.prototype = {
	__class__: Main
}
var IMap = function() { }
IMap.__name__ = true;
var Std = function() { }
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	addSub: function(s,pos,len) {
		this.b += len == null?HxOverrides.substr(s,pos,null):HxOverrides.substr(s,pos,len);
	}
	,__class__: StringBuf
}
var controllers = {}
controllers.MainController = function() {
	this.callback = null;
	this._personMap = new haxe.ds.StringMap();
	(this._sendPersons())();
};
controllers.MainController.__name__ = true;
controllers.MainController.prototype = {
	_sendPersons: function() {
		var _g = this;
		var send = (function($this) {
			var $r;
			var send1 = null;
			send1 = function() {
				haxe.Timer.delay(function() {
					var array = [];
					var $it0 = _g._personMap.keys();
					while( $it0.hasNext() ) {
						var key = $it0.next();
						var person = js.Boot.__cast(_g._personMap.get(key) , models.Person);
						var obj = person.jsObject();
						if(obj != null) array.push(person.jsObject());
					}
					if(_g.callback != null) _g.callback(array);
					send1();
				},500);
			};
			$r = send1;
			return $r;
		}(this));
		return send;
	}
	,recieveMessage: function(message) {
		var beaconObj = haxe.Json.parse(message);
		if(this._personMap.exists(beaconObj.id)) {
			var person = js.Boot.__cast(this._personMap.get(beaconObj.id) , models.Person);
			person.setBeacon(beaconObj);
		} else {
			var person = new models.Person(beaconObj.id);
			person.setBeacon(beaconObj);
			this._personMap.set(beaconObj.id,person);
		}
	}
	,__class__: controllers.MainController
}
var haxe = {}
haxe.Json = function() {
};
haxe.Json.__name__ = true;
haxe.Json.parse = function(text) {
	return new haxe.Json().doParse(text);
}
haxe.Json.prototype = {
	parseNumber: function(c) {
		var start = this.pos - 1;
		var minus = c == 45, digit = !minus, zero = c == 48;
		var point = false, e = false, pm = false, end = false;
		while(true) {
			c = this.str.charCodeAt(this.pos++);
			switch(c) {
			case 48:
				if(zero && !point) this.invalidNumber(start);
				if(minus) {
					minus = false;
					zero = true;
				}
				digit = true;
				break;
			case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
				if(zero && !point) this.invalidNumber(start);
				if(minus) minus = false;
				digit = true;
				zero = false;
				break;
			case 46:
				if(minus || point) this.invalidNumber(start);
				digit = false;
				point = true;
				break;
			case 101:case 69:
				if(minus || zero || e) this.invalidNumber(start);
				digit = false;
				e = true;
				break;
			case 43:case 45:
				if(!e || pm) this.invalidNumber(start);
				digit = false;
				pm = true;
				break;
			default:
				if(!digit) this.invalidNumber(start);
				this.pos--;
				end = true;
			}
			if(end) break;
		}
		var f = Std.parseFloat(HxOverrides.substr(this.str,start,this.pos - start));
		var i = f | 0;
		return i == f?i:f;
	}
	,invalidNumber: function(start) {
		throw "Invalid number at position " + start + ": " + HxOverrides.substr(this.str,start,this.pos - start);
	}
	,parseString: function() {
		var start = this.pos;
		var buf = new StringBuf();
		while(true) {
			var c = this.str.charCodeAt(this.pos++);
			if(c == 34) break;
			if(c == 92) {
				buf.addSub(this.str,start,this.pos - start - 1);
				c = this.str.charCodeAt(this.pos++);
				switch(c) {
				case 114:
					buf.b += "\r";
					break;
				case 110:
					buf.b += "\n";
					break;
				case 116:
					buf.b += "\t";
					break;
				case 98:
					buf.b += "";
					break;
				case 102:
					buf.b += "";
					break;
				case 47:case 92:case 34:
					buf.b += String.fromCharCode(c);
					break;
				case 117:
					var uc = Std.parseInt("0x" + HxOverrides.substr(this.str,this.pos,4));
					this.pos += 4;
					buf.b += String.fromCharCode(uc);
					break;
				default:
					throw "Invalid escape sequence \\" + String.fromCharCode(c) + " at position " + (this.pos - 1);
				}
				start = this.pos;
			} else if(c != c) throw "Unclosed string";
		}
		buf.addSub(this.str,start,this.pos - start - 1);
		return buf.b;
	}
	,parseRec: function() {
		while(true) {
			var c = this.str.charCodeAt(this.pos++);
			switch(c) {
			case 32:case 13:case 10:case 9:
				break;
			case 123:
				var obj = { }, field = null, comma = null;
				while(true) {
					var c1 = this.str.charCodeAt(this.pos++);
					switch(c1) {
					case 32:case 13:case 10:case 9:
						break;
					case 125:
						if(field != null || comma == false) this.invalidChar();
						return obj;
					case 58:
						if(field == null) this.invalidChar();
						obj[field] = this.parseRec();
						field = null;
						comma = true;
						break;
					case 44:
						if(comma) comma = false; else this.invalidChar();
						break;
					case 34:
						if(comma) this.invalidChar();
						field = this.parseString();
						break;
					default:
						this.invalidChar();
					}
				}
				break;
			case 91:
				var arr = [], comma = null;
				while(true) {
					var c1 = this.str.charCodeAt(this.pos++);
					switch(c1) {
					case 32:case 13:case 10:case 9:
						break;
					case 93:
						if(comma == false) this.invalidChar();
						return arr;
					case 44:
						if(comma) comma = false; else this.invalidChar();
						break;
					default:
						if(comma) this.invalidChar();
						this.pos--;
						arr.push(this.parseRec());
						comma = true;
					}
				}
				break;
			case 116:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 114 || this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return true;
			case 102:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 97 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 115 || this.str.charCodeAt(this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return false;
			case 110:
				var save = this.pos;
				if(this.str.charCodeAt(this.pos++) != 117 || this.str.charCodeAt(this.pos++) != 108 || this.str.charCodeAt(this.pos++) != 108) {
					this.pos = save;
					this.invalidChar();
				}
				return null;
			case 34:
				return this.parseString();
			case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:case 45:
				return this.parseNumber(c);
			default:
				this.invalidChar();
			}
		}
	}
	,invalidChar: function() {
		this.pos--;
		throw "Invalid char " + this.str.charCodeAt(this.pos) + " at position " + this.pos;
	}
	,doParse: function(str) {
		this.str = str;
		this.pos = 0;
		return this.parseRec();
	}
	,__class__: haxe.Json
}
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = true;
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
}
haxe.Timer.prototype = {
	run: function() {
		console.log("run");
	}
	,stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,__class__: haxe.Timer
}
haxe.ds = {}
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,__class__: haxe.ds.StringMap
}
var js = {}
js.Boot = function() { }
js.Boot.__name__ = true;
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					if(cl == Array) return o.__enum__ == null;
					return true;
				}
				if(js.Boot.__interfLoop(o.__class__,cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Browser = function() { }
js.Browser.__name__ = true;
var models = {}
models.Adapter = function() {
	this._mainController = new controllers.MainController();
	this.set_callback(null);
	var socketManager = new models.SocketManager("http://html5-export-hackathon-ibeacon.herokuapp.com/");
	socketManager.addListener(($_=this._mainController,$bind($_,$_.recieveMessage)));
};
models.Adapter.__name__ = true;
models.Adapter.prototype = {
	set_callback: function(callback) {
		this.callback = callback;
		this._mainController.callback = this.get_callback();
		return callback;
	}
	,get_callback: function() {
		return this.callback;
	}
	,__class__: models.Adapter
}
models.BeaconData = function(uuid,proximity,major,minor,accuracy,rssi) {
	this.uuid = uuid;
	this.set_proximity(proximity);
	this.major = major;
	this.minor = minor;
	this.accuracy = accuracy;
	this.rssi = rssi;
	this._isUnknown = false;
};
models.BeaconData.__name__ = true;
models.BeaconData.prototype = {
	_checkUnknown: function(counter) {
		var _g = this;
		haxe.Timer.delay(function() {
			if(!_g._isUnknown) return;
			if(counter > 2) {
				_g.set_proximity(models.Proximity.Lost);
				return;
			}
			_g._checkUnknown(counter + 1);
		},500);
	}
	,set_proximity: function(proximity) {
		if(proximity != models.Proximity.Unknown) {
			this.proximity = proximity;
			return this.get_proximity();
		}
		this._isUnknown = true;
		this._checkUnknown(0);
		return this.get_proximity();
	}
	,get_proximity: function() {
		return this.proximity;
	}
	,jsObject: function() {
		try {
			var rangeString = (function($this) {
				var $r;
				var _g = $this.get_proximity();
				$r = (function($this) {
					var $r;
					try {
						switch( (_g)[1] ) {
						case 0:
							$r = "immediate";
							break;
						case 1:
							$r = "near";
							break;
						case 2:
							$r = "far";
							break;
						case 3:
							$r = "unknown";
							break;
						case 4:
							$r = "lost";
							break;
						}
						return $r;
					}
					catch (e) {
						console.error(e);
					}
				}($this));
				return $r;
			}(this));
			return { uuid : this.uuid, proximity : rangeString, major : this.major, minor : this.minor, accuracy : this.accuracy, rssi : this.rssi};
		} catch( message ) {
			if( js.Boot.__instanceof(message,String) ) {
				throw "error in beacondata";
			} else throw(message);
		}
		return null;
	}
	,__class__: models.BeaconData
}
models.Person = function(id) {
	this._id = id;
	this._beaconMap = new haxe.ds.StringMap();
};
models.Person.__name__ = true;
models.Person.prototype = {
	_getProximity: function(proxi) {
		var range;
		if(proxi == "immediate") range = models.Proximity.Immediate; else if(proxi == "near") range = models.Proximity.Near; else if(proxi == "far") range = models.Proximity.Far; else range = models.Proximity.Unknown;
		return range;
	}
	,jsObject: function() {
		try {
			if(Lambda.count(this._beaconMap) == 0) return { };
			var array = [];
			var $it0 = this._beaconMap.keys();
			while( $it0.hasNext() ) {
				var key = $it0.next();
				var beacon = this._beaconMap.get(key);
				if(beacon.get_proximity() == models.Proximity.Lost) this._beaconMap.remove(key);
				var obj = beacon.jsObject();
				if(obj != null) array.push(beacon.jsObject());
			}
			return { id : this._id, data : array};
		} catch( message ) {
			if( js.Boot.__instanceof(message,String) ) {
				console.log("error in person");
				console.log(message);
				console.log(this._id);
			} else throw(message);
		}
		return null;
	}
	,setBeacon: function(beaconObj) {
		try {
			var key = Std.string(beaconObj.uuid) + "-" + Std.string(beaconObj.major) + "-" + Std.string(beaconObj.minor);
			var beacon = this._beaconMap.exists(key)?(function($this) {
				var $r;
				var range = $this._getProximity(beaconObj.proximity);
				var beacon1 = $this._beaconMap.get(key);
				beacon1.set_proximity(range);
				beacon1.accuracy = beaconObj.accuracy;
				beacon1.rssi = beaconObj.rssi;
				$r = beacon1;
				return $r;
			}(this)):(function($this) {
				var $r;
				var range = $this._getProximity(beaconObj.proximity);
				$r = new models.BeaconData(beaconObj.uuid,range,beaconObj.major,beaconObj.minor,beaconObj.accuracy,beaconObj.rssi);
				return $r;
			}(this));
			this._beaconMap.set(key,beacon);
		} catch( msg ) {
			if( js.Boot.__instanceof(msg,String) ) {
				console.log(msg);
			} else throw(msg);
		}
	}
	,__class__: models.Person
}
models.Proximity = { __ename__ : true, __constructs__ : ["Immediate","Near","Far","Unknown","Lost"] }
models.Proximity.Immediate = ["Immediate",0];
models.Proximity.Immediate.toString = $estr;
models.Proximity.Immediate.__enum__ = models.Proximity;
models.Proximity.Near = ["Near",1];
models.Proximity.Near.toString = $estr;
models.Proximity.Near.__enum__ = models.Proximity;
models.Proximity.Far = ["Far",2];
models.Proximity.Far.toString = $estr;
models.Proximity.Far.__enum__ = models.Proximity;
models.Proximity.Unknown = ["Unknown",3];
models.Proximity.Unknown.toString = $estr;
models.Proximity.Unknown.__enum__ = models.Proximity;
models.Proximity.Lost = ["Lost",4];
models.Proximity.Lost.toString = $estr;
models.Proximity.Lost.__enum__ = models.Proximity;
models.SocketManager = function(url) {
	this._startRecieving(url);
	this._listeners = [];
};
models.SocketManager.__name__ = true;
models.SocketManager.prototype = {
	addListener: function(callback) {
		this._listeners.push(callback);
	}
	,_startRecieving: function(url) {
		var _g = this;
		this._eventSource = new EventSource(url);
		this._eventSource.onmessage = function(e) {
			var _g1 = 0, _g2 = _g._listeners;
			while(_g1 < _g2.length) {
				var listener = _g2[_g1];
				++_g1;
				listener(e.data);
			}
		};
	}
	,__class__: models.SocketManager
}
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; };
String.prototype.__class__ = String;
String.__name__ = true;
Array.prototype.__class__ = Array;
Array.__name__ = true;
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
if(typeof(JSON) != "undefined") haxe.Json = JSON;
js.Browser.window = typeof window != "undefined" ? window : null;

DataMapper.Adapter = models.Adapter;
})(DataMapper);

