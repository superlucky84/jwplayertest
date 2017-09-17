


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
    player.smartPlay();
  }

  function playlistClicnHandler(event) {

    var $item = EventUtil.getTarget(event);

    if ($item.tagName == "SPAN") {
      console.log('aa');
      var deleteSeq = Number($item.id.replace(/deleteitem-/g,""));

      if (this.list.length == 1) {
        alert('마지막 곡은 지우지 못합니다.');
        return;
      }

      // 재생중인 곡 삭제일때
      if (this.playSeqId == deleteSeq) {
        player.next();
      }

      this.findFileDelete([deleteSeq]);
      this.draw();

      return;
    }

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

PlayList.prototype.findFileDelete = function(checkedlist) {

  var self = this;
  this.list.forEach(function(fileObj){
    if (checkedlist.indexOf(fileObj.seq) >= 0) {
      var delIdx = self.findIdx(fileObj.seq);
      self.list.splice(delIdx,1);
    }
  });

}

PlayList.prototype.findFileSeq = function(checkedlist) {

  var self = this;
  var alertList = [];
  this.list.forEach(function(fileObj){
    if (checkedlist.indexOf(fileObj.seq) >= 0) {
      alertList.push(self.name+":"+fileObj.name);
    }
  });
  return alertList;
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

PlayList.prototype.clear = function () {
  this.list = [];
  this.removeHandler();
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
  this.changePlay(this.playSeqId);
}











