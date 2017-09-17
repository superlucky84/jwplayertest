function FileList(playLists, player) {
  var self = this;

  this.list = [];

  this.$filelist = document.getElementById('filelist');


  // ADD EVENT
  var $createPlayletButton = document.getElementById('craeatePlaylist');
  var $deleteFileButton = document.getElementById('deleteFile');

  EventUtil.addHandler($createPlayletButton, 'click', function () {
    this.createPlaylist(playLists, player);
  }.bind(this));

  EventUtil.addHandler(this.$filelist, 'dblclick', function _EVENT(event) {
    // 선택된 파일 가져오기
    var $item = EventUtil.getTarget(event);
    if ($item.tagName !== 'SPAN') {
      return;
    }
    var seq = Number($item.getElementsByTagName('input')[0].value);
    var fileObj = self.findBySeq(seq);

    var targetPlaylist = null;

    // 플레이 했던 플레이리스타가 있으면 그곳에 추가
    if (player.lastPlayPlaylist) {
      targetPlaylist = player.lastPlayPlaylist;
      player.lastPlayPlaylist.add(fileObj);
      alert(player.lastPlayPlaylist.name + '에 추가되었습니다.');
    } else {
      targetPlaylist = new PlayList(playLists.generateName(), player);
      targetPlaylist.add(fileObj);
      playLists.add(targetPlaylist);
    }

    // 해당 리스트에가서 플레이 시킨다.
    player.choiceMusic = fileObj;
    player.choicePlaylist = targetPlaylist;
    player.smartPlay();
  });


  EventUtil.addHandler($deleteFileButton, 'click', function _EVENT() {
    var checkedlist = [];
    var inputs = this.$filelist.getElementsByTagName('input');
    for ( var inputIdx in inputs) {
      if (!inputs[inputIdx].checked) {
        continue;
      }
      checkedlist.push(Number(inputs[inputIdx].value));
      inputs[inputIdx].checked = false;
    }
    this.deleteFileChk(playLists, checkedlist);
  }.bind(this));
}

FileList.prototype.findFileDelete = function _FINDFILEDELETE(playLists, checkedlist) {
  var self = this;
  this.list.forEach(function _LOOP(fileObj) {
    if (checkedlist.indexOf(fileObj.seq) >= 0) {
      var delIdx = self.findIdx(Number(fileObj.seq));
      self.list.splice(delIdx, 1);
    }
  });

  playLists.list.forEach(function _LOOP(listItem) {
    var playlist = listItem.playlist;
    playlist.findFileDelete(checkedlist);
  });

  this.draw();
};


FileList.prototype.deleteFileChk = function _DELETEFILECHK(playLists, checkedlist) {
  // 해당 시퀀스를 가지고 있는 플레이리스트를 찾는다

  if (checkedlist.length === 0) {
    alert('체크박스를 선택해주세요.');
    return;
  }

  var alertAll = [];
  playLists.list.forEach(function _LOOP(listItem) {
    var playlist = listItem.playlist;
    var alertList = playlist.findFileSeq(checkedlist);
    if (alertList.length > 0) {
      alertAll.push(alertList);
    }
  });
  if (alertAll.length > 0) {
    if (!confirm('플레이리스트에 포함되어 있습니다! 정말 지웁니까 ->\n ' + alertAll.join(', '))) {
      return;
    }
    this.findFileDelete(playLists, checkedlist);
  } else {
    this.findFileDelete(playLists, checkedlist);
  }
};

FileList.prototype.findIdx = function _FINDIDX(seq) {
  var idx = 0;
  this.list.forEach(function _LOOP(element, arrIdx) {
    if (element.seq === seq) {
      idx = arrIdx;
    }
  });
  return idx;
};


FileList.prototype.createPlaylist = function _CREATEPLAYLIST(playLists, player) {
  var checkedlist = [];
  var inputs = this.$filelist.getElementsByTagName('input');

  for ( var inputIdx in inputs) {
    if (!inputs[inputIdx].checked) {
      continue;
    }
    checkedlist.push(this.findBySeq(Number(inputs[inputIdx].value)));
    inputs[inputIdx].checked = false;
  }

  if (checkedlist.length === 0 ) {
    alert('하나로도 선택해야 합니다.');
    return;
  }

  // 플래이리스트에 리스트 추가
  var playList = new PlayList(playLists.generateName(), player);
  checkedlist.forEach(function _LOOP(fileObj) {
    playList.add(fileObj);
  });

  // 플래이 리스트목록에 플레이리스트 추가
  playLists.add(playList);
};

FileList.prototype.findBySeq = function _FINDBYSEQ(seq) {
  var targetPlaylist = null;
  this.list.forEach(function _LOOP(element) {
    if (element.seq === seq) {
      targetPlaylist = element;
    }
  });
  return targetPlaylist;
};


FileList.prototype.createFile = function _CAEATEFILE() {
  var seq = 1;
  var chkFilenameArr = [];
  for (var i = 0; i < 20; i++) {
    var newfilename = filenamelist[Math.floor((Math.random() * 150))]; // 149 까지 나와야함
    var term = Math.floor(Math.random() * 61) + 10;

    if (chkFilenameArr.indexOf(newfilename) < 0) {
      chkFilenameArr.push(newfilename);
      this.list.push({
        'seq': seq++,
        'name': newfilename,
        'term': term
      });
    }
  }

  this.list.sort(function _SORT(a, b) {
    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
  });
};


FileList.prototype.draw = function _DRAW() {
  var filelistItemHTML = document.getElementById('filelist-item').innerHTML;
  var appendListHtmlArray = [];


  this.list.forEach(function _LOOP(listItem) {
    if (!listItem.seq) {
      return;
    }

    appendListHtmlArray.push(template(filelistItemHTML, {
      'seq': listItem.seq,
      'name': listItem.name,
      'term': calculterm(listItem.term)
    }));
  });

  this.$filelist.innerHTML = appendListHtmlArray.join('');
};

function calculterm(term) {
  var minute = String(Math.floor(term / 60));
  var second = String(term % 60);

  minute = (minute.length === 1) ? '0' + minute : minute;
  second = (second.length === 1) ? '0' + second : second;
  return minute + ':' + second;
}
