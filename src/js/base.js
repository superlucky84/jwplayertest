
var EventUtil = {
	addHandler: function( element, type, handler ) {
		if ( element.addEventListener ) {
			element.addEventListener ( type, handler, false );
		} else if ( element.attachEvent ) {
			element.attachEvent ( "on" + type, handler );
		} else {
			element["on" + type] = handler;
		}
	},

	getEvent: function ( event ) {
		return event ? event : window.event;
	},

	getTarget: function ( event ) {
		return event.target || event.srcElement;
	},

	preventDefault: function ( event ) {
		if ( event.preventDefault ) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	},

	removeHandler: function( element, type, handler ) {
		if ( element.removeEventListener ) {
			element.removeEventListener ( type, handler, false );
		} else if ( element.detachEvent ) {
			element.detachEvent ( "on" + type, handler );
		} else {
			element["on" + type] = null;
		}
	},

	stopPropagation: function ( event ) {
		if ( event.stopPropagation ) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
	},
  addClass: function (target, className) {
    if (target) {
      var origClassName = target.className;
      target.className = origClassName+" "+className;
    }
  },
  removeClass: function (target, className) {
    if (target) {
      var origClassName = target.className;
      var re = new RegExp("\s?"+className+"\s?","g");
      target.className = origClassName.replace(re,"");
    }
  }

};
if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      // 우리는 반드시 특정한 케이스에 대해서 확인해야 합니다.
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}

if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // ECMAScript 5 내부 IsCallable 함수와
      // 가능한 가장 가까운 것
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    if (this.prototype) {
      // Function.prototype은 prototype 속성이 없음
      fNOP.prototype = this.prototype;
    }
    fBound.prototype = new fNOP();

    return fBound;
  };
}

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {

    var k;

    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    var o = Object(this);
    var len = o.length >>> 0;

    if (len === 0) {
      return -1;
    }

    var n = fromIndex | 0;

    if (n >= len) {
      return -1;
    }
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
    while (k < len) {
      if (k in o && o[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}

if (!Array.prototype.forEach) {
  Array.prototype.forEach = function forEach (callback, thisArg) {
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    var array = this;
    thisArg = thisArg || this;
    for (var i = 0, l = array.length; i !== l; ++i) {
      callback.call(thisArg, array[i], i, array);
    }
  };
}

String.prototype.matchAll = function(regexp) {
  var matches = [];
  this.replace(regexp, function() {
    var arr = ([]).slice.call(arguments, 0);
    var extras = arr.splice(-2);
    arr.index = extras[0];
    arr.input = extras[1];
    matches.push(arr);
  });
  return matches.length ? matches : null;
};

function inherit(subType, superType) {
  var prototype = object(superType.prototype);
  prototype.constructor = subType;
}

function template (template, map) { 
	var template_new = template; 
  if (template.matchAll(/{\$([^}]+)}/g)) { 
    template.matchAll(/{\$([^}]+)}/g).forEach(function(searchItem) { 
      template_new = template_new.replace(searchItem[0],map[searchItem[1]]) 
    }); 
  } 
  return template_new;
}
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}



var filenamelist=["Take Five", "All Of Me (MBC `우리 결혼했어요` 삽입곡)", "It`s a Sin To tell a Lie", "Straight No Chaser", "Lullaby of Birdland", "Absolutely", "Bach-Ing Mad", "Take a Letter", "Steps Behind", "Oleo", "No It Ain't", "Canteloupe Island", "Lover Come Back To Me", "Stardust", "Lullaby of Birdland", "In The Mood", "How High the Moon", "The Sex Pest", "Footprints", "Startin' out Again", "The Jester", "Chocolate", "Fly Me To The Moon", "I Tried to Tell You", "Waltz for Joshua", "Black Orpheus", "Your Song", "That's What You Get", "Knuckle Shuffle", "Monkey Jazz", "Harry Hates Ham", "Chill Baby", "Do It Anyway", "Freddie Freeloader", "Maiden Voyage", "Bossa Scousa", "Think It Over", "Cheeky", "Caravan", "Cha Cha Charlie", "Oh When The Saints Go Marching In", "Summertime", "Why Don`t You Do Right", "Jazz", "Minor Swing", "Love Me Or Leave Me", "A Taste Of Honey", "Georgia On My Mind", "It`s Too Late", "Stardust", "Antonio`s Song (The rainbow)", "Jazz", "Chattanooga Choo Choo", "Moon Light Serenade", "My Man", "Saint Louis Blues", "Take The A Train", "Nuages", "Taking A Chance On Love", "The Scat Song", "You Rascal You", "I Got Rhythm", "Round Midnight (Live)", "Ain`t Misbehavin`", "The Calypso", "Jazz (We've Got)", "Oo-Wee Walkie Talkie", "Waltz For Debby", "Love Letter", "Jazz-Suite No. 2: Lyric Waltz. Allegretto", "Jazz", "Jazz (We've Got)", "All Or Nothing At All", "Jazz-Suite Nr.1: Waltz", "Jazz", "Love Again (Feat. Jill Scott)", "Jazz (New Jazz Ver.)", "Jazz-Bar", "Fare Thee Well; Annabelle", "Jazz!", "Jazz 01", "빈 바다", "Growing Grooves (Marimba Chill Out Mix)", "The Battle Hymn of the Republic / When Johhny Comes...", "Mr. Wonder", "Hot Piano", "When I Fall In Love", "Jazz 07", "Jazz 16", "Jazz 05", "Jazz 02", "Jazz 18", "Jazz 09", "Jazz 03", "Jazz 06", "Jazz 10", "Jazz 04", "Jazz 08", "Jazz 11", "Jazz 17", "Jazz 14", "Jazz 12", "Don't Get Around Much Anymore", "Lizard Skin", "Wishing On a Star", "Jazz-Suite No. 2: Finale. Allegro moderato", "Jazz 13", "Jazz 15", "I`m A Fool To Want You", "Lover", "Night & Day", "Jazz-Suite No. 2: Waltz I", "Renacido", "Jazz-Suite No. 2: Dance I. Presto", "Jazz-Suite No. 2: Waltz II. Allegretto poco moderato", "Jazz-Suite No. 2: Marcia", "Jazz-Suite No. 2: Dance II. Allegretto scherzando", "Jazz-Suite No. 2: Little Polka. Allegretto", "아리랑 (구전 민요)", "You Do Something To Me", "Closing Time Blues", "Jazz (Ain`t Nothin` But Soul)", "The Duke", "I'm Thru With Love", "한오백년 (구전 민요)", "해맑은 아침 (Softly, As In A Morning Sunrise)", "Sometimes I'm happy", "Serious", "Indiana", "I Can't Believe That You're In Love With Me", "Let'S Face The Music And Dance", "I Let A Song Go Out Of My Heart", "Solitude", "If It's a Game", "The Things We Did Last Summer", "Here's to Horace", "Love Walked In", "Round Midnight", "가시리", "Jazz", "When Lights Are Low", "Splanky", "Li'l Darlin", "Den Lyssnande Maria", "Come Sunday", "Strawberry Fields Forever", "I've Found A New Baby", "Good Bait", "There Will Never Be Another You", "Jazz (We've Got) (Re-Recording)"];







