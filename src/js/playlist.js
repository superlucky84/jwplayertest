


function PlayList (playListName, player) {

  this.name = playListName;
  this.list = []; // add filenumber;
  this.activeSeqId = 0;
  this.playSeqId = 0;
  this.thisHandler = playlistClicnHandler.bind(this);
  this.thisDblHandler = playlistDblClickHandler.bind(this);
	this.$playlist = document.getElementById("playlist");
  this.sortNameDesc = true;

  function playlistDblClickHandler(event) {
    console.log("jinwoo");
    player.smartPlay();

  }

  function playlistClicnHandler(event) {

    var $item = EventUtil.getTarget(event);


    if (this.activeSeqId != Number($item.id.replace(/playlist-/g,""))) {

      if (this.activeSeqId) {
        EventUtil.removeClass(document.getElementById("playlist-"+this.activeSeqId),"active");
      }

      EventUtil.addClass($item,"active");
      this.activeSeqId = Number($item.id.replace(/playlist-/g,""));
      var targetMusic = this.findBySeq(this.activeSeqId);
      player.changeTargetMusic(targetMusic);
    }



  }
}

PlayList.prototype.sort = function(sortType) {

  if (sortType == "random") {
		this.list = shuffle(this.list);
  }
  else if (sortType == "name") {
    if (this.sortNameDesc == true) {
      this.sortNameDesc = false;
      this.list.sort(function(a, b) {
        return a.name > b.name ? -1 : a.name < b.name ? 1 : 0;
      });
    }
    else {
      this.sortNameDesc = true;
      this.list.sort(function(a, b) {
        return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
      });
    }
  }

  this.draw();

}

PlayList.prototype.changePlay = function(seq) {

  if (this.playSeqId) {
    EventUtil.removeClass(document.getElementById("playlist-"+this.playSeqId),"play");
  }
  EventUtil.addClass(document.getElementById("playlist-"+seq),"play");

  this.playSeqId = seq;

}

PlayList.prototype.cancelActiveSeqId = function() {

  EventUtil.removeClass(document.getElementById("playlist-"+this.activeSeqId),"active");
  this.activeSeqId = 0;
}

PlayList.prototype.findIdx = function(seq) {
  var idx = 0;
  this.list.forEach(function(element,arrIdx) {
    if (element.seq == seq) {
      idx = arrIdx;
    }
  });
  return idx;

}

PlayList.prototype.findBySeq = function(seq) {
  var targetPlaylist = null;
  this.list.forEach(function(element) {
    if (element.seq == seq) {
      targetPlaylist = element;
    }
  });
  return targetPlaylist;
}


PlayList.prototype.add = function (fileObj) {

  var self = this;
  var insertAble = true;

  self.list.forEach(function(listItem) {
    if (listItem.seq == fileObj.seq) {
      insertAble = false;
    }
  });
  if (insertAble) {
    self.list.push(fileObj);
  }


}

PlayList.prototype.addHandler = function () {
	EventUtil.addHandler(this.$playlist, "click", this.thisHandler);
	EventUtil.addHandler(this.$playlist, "dblclick", this.thisDblHandler);
}

PlayList.prototype.removeHandler = function () {
  this.activeSeqId = 0;
	EventUtil.removeHandler(this.$playlist, "click", this.thisHandler);
	EventUtil.removeHandler(this.$playlist, "dblclick", this.thisDblHandler);
}

PlayList.prototype.draw = function () {

  var playlistItemHTML = document.getElementById("playlist-item").innerHTML;
  var appendListHtmlArray = [];

  this.list.forEach(function(listItem) {

    appendListHtmlArray.push(template(playlistItemHTML, {
      'seq': listItem.seq,
      'name': listItem.name,
      'term': calculterm(listItem.term)
    }));

  });

  this.$playlist.innerHTML = appendListHtmlArray.join("");
  this.addHandler();
}










