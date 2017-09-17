function PlayLists(player) {
  var self = this;
  this.lastSeq = 0;
  this.activeList = 'allfile';

  // 목록
  this.list = [];

  var $playlistnav = document.getElementById('playlistnav');

  this.$sortNameButton = document.getElementById('sortName');
  this.$sortRandomButton = document.getElementById('sortRandom');
  this.$deletePlaylist = document.getElementById('playlistDelete');

  this.sortRandomHandler = sortRandom.bind(this);
  this.sortNameHandler = sortName.bind(this);

  EventUtil.addHandler(this.$deletePlaylist, 'click', function _EVENT() {
    if (player.lastPlayPlaylist === player.choicePlaylist) {
      alert('재생중인 플래이리스트는 삭제할수 없습니다.');
      return;
    }

    player.choicePlaylist.clear();
    player.choicePlaylist = null;

    var deltetargetName = self.activeList;
    self.activeList = 'allfile';

    document.getElementById('allfile').click();


    var deleteIdx = self.findIdx(Number(deltetargetName.replace(/listnum/g, '')));
    self.list.splice(deleteIdx, 1);


    var deleteTargetDom = document.getElementById(deltetargetName);
    document.getElementById('playlistnav').removeChild(deleteTargetDom);
  });

  EventUtil.addHandler(this.$sortRandomButton, 'click', this.sortRandomHandler);
  EventUtil.addHandler(this.$sortNameButton, 'click', this.sortNameHandler);

  function sortRandom() {
    player.choicePlaylist.sort('random');
  }

  function sortName() {
    player.choicePlaylist.sort('name');
  }

  EventUtil.addHandler($playlistnav, 'dblclick', function _EVENT(event) {
    if (EventUtil.getTarget(event).tagName !== 'LI') {
      return;
    }

    var $listButton =  EventUtil.getTarget(event);
    self.activeList = $listButton.id;
    if (self.activeList === 'allfile') {
      return;
    }
    var $input = $listButton.getElementsByTagName('input')[0];
    $input.style.display = 'block';
    $input.focus();

    EventUtil.addHandler($input, 'focusout', focusoutEvent);
    EventUtil.addHandler($input, 'keydown', keydown);

    function keydown(ev) {
      if (ev.keyCode !== 13) {
        return;
      }
      focusoutEvent(ev);
    }
    function focusoutEvent() {
      self.rename($input.value, $listButton);
      $input.style.display = 'none';
      EventUtil.removeHandler($input, 'keydown', keydown);
      EventUtil.removeHandler($input, 'focusout', focusoutEvent);
    }
  });

  EventUtil.addHandler($playlistnav, 'click', function _EVENT(event) {
    if (EventUtil.getTarget(event).tagName !== 'LI') {
      return;
    }

    if (self.activeList !== 'allfile') {
      var preActivePlaylist = self.findBySeq(Number(self.activeList.replace(/listnum/g, '')));
      preActivePlaylist.removeHandler();
    }

    // 하이라이트
    document.getElementById(self.activeList).className = '';
    EventUtil.getTarget(event).className = 'active';
    self.activeList = EventUtil.getTarget(event).id;

    var seq = 0;
    if (self.activeList !== 'allfile') {
      // 플레이리스트 찾기
      seq = Number(self.activeList.replace(/listnum/g, ''));
      var targetPlaylist = self.findBySeq(seq);


      // 플레이리스트 그리기
      targetPlaylist.draw();

      // 플레이리스트에게 선택된 리스트 보내기
      player.choicePlaylist = targetPlaylist;

      document.getElementById('filelistWrap').className = 'hide';
      document.getElementById('playlistWrap').className = 'show';
    } else {
      // player.choicePlaylist = null;
      document.getElementById('filelistWrap').className = 'show';
      document.getElementById('playlistWrap').className = 'hide';
    }
  });
}

PlayLists.prototype.rename = function _RENAME(rename, $listButton) {
  $listButton.innerHTML = rename + '<input type="text" value="' + rename + '" />';

  var activePlaylist = this.findBySeq(Number(this.activeList.replace(/listnum/g, '')));
  activePlaylist.name = rename;
};

PlayLists.prototype.findIdx = function _FINDIDX(seq) {
  var idx = 0;
  this.list.forEach(function _LOOP(element, arrIdx) {
    if (element.seq === seq) {
      idx = arrIdx;
    }
  });
  return idx;
};

PlayLists.prototype.findBySeq = function _FINDBYSEQ(seq) {
  var targetPlaylist = null;

  this.list.forEach(function _LOOP(element) {
    if (element.seq === seq) {
      targetPlaylist = element.playlist;
    }
  });
  return targetPlaylist;
};

PlayLists.prototype.add = function _ADD(playlist) {
  this.list.push({
    'seq': ++this.lastSeq,
    'playlist': playlist
  });

  // 플레이리스트 리스트 영역에 그려준다
  var $playlistnav = document.getElementById('playlistnav');
  var $li = document.createElement('li');
  $li.id = 'listnum' + this.lastSeq;
  $playlistnav.appendChild($li);
  $li.innerHTML = playlist.name + '<input type="text" value="' + playlist.name + '" />';
};

PlayLists.prototype.generateName = function _GENERATENAME() {
  return 'Playlist ' + String(this.lastSeq + 1);
};


