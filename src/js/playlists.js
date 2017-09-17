
function PlayLists (player) {


  this.lastSeq = 0;

  this.activeList = "allfile";

  // 목록
  this.list = [];

	var $playlistnav = document.getElementById("playlistnav");

  this.$sortNameButton = document.getElementById("sortName");
  this.$sortRandomButton = document.getElementById("sortRandom");

    
  EventUtil.addHandler(this.$sortRandomButton, "click", function(event) {
    player.choicePlaylist.sort("random");
  });

  EventUtil.addHandler(this.$sortNameButton, "click", function(event) {
    player.choicePlaylist.sort("name");
  });

	EventUtil.addHandler($playlistnav, "click", function (event) {

    if (this.activeList != "allfile") {
      var preActivePlaylist = this.findBySeq(Number(this.activeList.replace(/listnum/g,"")));
      preActivePlaylist.removeHandler();
    }

    // 하이라이트
    document.getElementById(this.activeList).className = "";
    EventUtil.getTarget(event).className = "active";
    this.activeList = EventUtil.getTarget(event).id;

    var seq = 0;
    if (this.activeList != "allfile") {

      // 플레이리스트 찾기
      seq = Number(this.activeList.replace(/listnum/g,""));
      var targetPlaylist = this.findBySeq(seq);


      // 플레이리스트 그리기
      targetPlaylist.draw();

      // 플레이리스트에게 선택된 리스트 보내기
      player.choicePlaylist = targetPlaylist;

      document.getElementById("filelistWrap").className = "hide";
      document.getElementById("playlistWrap").className = "show";
    }
    else {

      //player.choicePlaylist = null;

      document.getElementById("filelistWrap").className = "show";
      document.getElementById("playlistWrap").className = "hide";
    }


	}.bind(this));
}

PlayLists.prototype.findBySeq = function (seq) {
  var targetPlaylist = null;

  this.list.forEach(function(element) {
    if (element.seq == seq) {
      targetPlaylist = element.playlist;
    }
  });
  return targetPlaylist;
}

PlayLists.prototype.add = function (playlist) {
  
  this.list.push({
    'seq': ++this.lastSeq,
    'playlist': playlist
  });

  // 플레이리스트 리스트 영역에 그려준다
  var $playlistnav = document.getElementById('playlistnav');
  var $li = document.createElement('li');
  $li.id = "listnum"+this.lastSeq;
  var div = $playlistnav.appendChild($li);
  $li.innerHTML = playlist.name;

}

PlayLists.prototype.generateName = function () {
  return "Playlist " + String(this.lastSeq+1);
}



