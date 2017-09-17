
function PlayLists (player) {


  this.lastSeq = 0;

  this.activeList = "allfile";

  // 목록
  this.list = [];

	var $playlistnav = document.getElementById("playlistnav");

  this.$sortNameButton = document.getElementById("sortName");
  this.$sortRandomButton = document.getElementById("sortRandom");
  this.$deletePlaylist = document.getElementById("playlistDelete");

  this.sortRandomHandler = sortRandom.bind(this);
  this.sortNameHandler = sortName.bind(this);

  EventUtil.addHandler(this.$deletePlaylist, "click", function(event) {
    console.log(player.choicePlaylist.seq);

    player.choicePlaylist.clear();
    player.choicePlaylist = null;



    var deltetargetName = this.activeList;
    this.activeList = "allfile";

    document.getElementById("allfile").click();


    var deleteIdx = this.findIdx(Number(deltetargetName.replace(/listnum/g,"")));
    this.list.splice(deleteIdx,1);


    var deleteTargetDom = document.getElementById(deltetargetName);
    document.getElementById("playlistnav").removeChild(deleteTargetDom);




  }.bind(this));
    
  EventUtil.addHandler(this.$sortRandomButton, "click", this.sortRandomHandler);
  EventUtil.addHandler(this.$sortNameButton, "click", this.sortNameHandler);

  function sortRandom(event) {
    player.choicePlaylist.sort("random");
  }

  function sortName(event) {
    player.choicePlaylist.sort("name");
  }

	EventUtil.addHandler($playlistnav, "dblclick", function (event) {

    if (EventUtil.getTarget(event).tagName != "LI") {
      return;
    }

    var self = this;

    var $listButton =  EventUtil.getTarget(event);
    this.activeList = $listButton.id;
    if (this.activeList == "allfile") {
      return;
    }
    var $input = $listButton.getElementsByTagName("input")[0];
    $input.style.display = "block";
    $input.focus();

    EventUtil.addHandler($input, "focusout", focusoutEvent);
    EventUtil.addHandler($input, "keydown", keydown);

    function keydown(event) {
      if (event.keyCode != 13) {
        return;
      }
      focusoutEvent(event);
    }
    function focusoutEvent(event) {
      self.rename($input.value,$listButton);
      $input.style.display = "none";
      EventUtil.removeHandler($input,"keydown", keydown);
      EventUtil.removeHandler($input,"focusout", focusoutEvent);
    }

  }.bind(this));

	EventUtil.addHandler($playlistnav, "click", function (event) {
    if (EventUtil.getTarget(event).tagName != "LI") {
      return;
    }

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

PlayLists.prototype.rename = function (rename, $listButton) {

  $listButton.innerHTML = rename+"<input type='text' value='"+rename+"' />";

  var activePlaylist = this.findBySeq(Number(this.activeList.replace(/listnum/g,"")));
  activePlaylist.name = rename;
  //activePlaylist
  //rename

}

PlayLists.prototype.findIdx = function(seq) {
  var idx = 0;
  this.list.forEach(function(element,arrIdx) {
    if (element.seq == seq) {
      idx = arrIdx;
    }
  });
  return idx;
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
  $li.innerHTML = playlist.name+"<input type='text' value='"+playlist.name+"' />";

}

PlayLists.prototype.generateName = function () {
  return "Playlist " + String(this.lastSeq+1);
}



