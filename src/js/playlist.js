


function PlayList (playListName, player) {

  this.name = playListName;
  this.list = []; // add filenumber;
  this.activeSeqId = 0;
  this.thisHandler = playlistClicnHandler.bind(this);
	this.$playlist = document.getElementById("playlist");



  function playlistClicnHandler(event) {
    var $item = EventUtil.getTarget(event);
    $item.className = "active";

    if (this.activeSeqId) {
      console.log(this.name);
      document.getElementById("playlist-"+this.activeSeqId).className = "";
    }
    this.activeSeqId = Number($item.id.replace(/playlist-/g,""));
    var targetMusic = this.findBySeq(this.activeSeqId);

    player.changeTargetMusic(targetMusic);
  }


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
}

PlayList.prototype.removeHandler = function () {
  this.activeSeqId = 0;
	EventUtil.removeHandler(this.$playlist, "click", this.thisHandler);
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











