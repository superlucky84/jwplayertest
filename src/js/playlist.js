function PlayList(playListName, player) {
  this.name = playListName;
  this.list = []; // add filenumber;
  this.activeSeqId = 0;
  this.playSeqId = 0;
  this.thisHandler = playlistClicnHandler.bind(this);
  this.thisDblHandler = playlistDblClickHandler.bind(this);
  this.$playlist = document.getElementById('playlist');
  this.sortNameDesc = true;


  function playlistDblClickHandler() {
    player.smartPlay();
  }

  function playlistClicnHandler(event) {
    var $item = EventUtil.getTarget(event);

    if ($item.tagName === 'SPAN') {
      var deleteSeq = Number($item.id.replace(/deleteitem-/g, ''));

      if (this.list.length === 1) {
        alert('마지막 곡은 지우지 못합니다.');
        return;
      }

      // 재생중인 곡 삭제일때
      if (this.playSeqId === deleteSeq) {
        player.next();
      }

      this.findFileDelete([deleteSeq]);
      this.draw();

      return;
    }

    if (this.activeSeqId !== Number($item.id.replace(/playlist-/g, ''))) {
      if (this.activeSeqId) {
        EventUtil.removeClass(document.getElementById('playlist-' + this.activeSeqId), 'active');
      }

      EventUtil.addClass($item, 'active');
      this.activeSeqId = Number($item.id.replace(/playlist-/g, ''));
      var targetMusic = this.findBySeq(this.activeSeqId);
      player.changeTargetMusic(targetMusic);
    }
  }
}

PlayList.prototype.findFileDelete = function _FINDFILEDELETE(checkedlist) {
  var self = this;
  this.list.forEach(function _LOOP(fileObj) {
    if (checkedlist.indexOf(fileObj.seq) >= 0) {
      var delIdx = self.findIdx(Number(fileObj.seq));
      self.list.splice(delIdx, 1);
    }
  });
};

PlayList.prototype.findFileSeq = function _FINDFILESEQ(checkedlist) {
  var self = this;
  var alertList = [];
  this.list.forEach(function _LOOP(fileObj) {
    if (checkedlist.indexOf(fileObj.seq) >= 0) {
      alertList.push(self.name + ':' + fileObj.name);
    }
  });
  return alertList;
};

PlayList.prototype.sort = function _SORT(sortType) {
  if (sortType === 'random') {
    this.list = shuffle(this.list);
  } else if (sortType === 'name') {
    if (this.sortNameDesc === true) {
      this.sortNameDesc = false;
      this.list.sort(function _SORTDESC(a, b) {
        return a.name > b.name ? -1 : a.name < b.name ? 1 : 0;
      });
    } else {
      this.sortNameDesc = true;
      this.list.sort(function _SORTASC(a, b) {
        return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
      });
    }
  }

  this.draw();
};

PlayList.prototype.changePlay = function _CHANGEPLAY(seq) {
  if (this.playSeqId) {
    EventUtil.removeClass(document.getElementById('playlist-' + this.playSeqId), 'play');
  }
  EventUtil.addClass(document.getElementById('playlist-' + seq), 'play');

  this.playSeqId = seq;
};

PlayList.prototype.cancelActiveSeqId = function _CANCELACTIVESEQID() {
  EventUtil.removeClass(document.getElementById('playlist-' + this.activeSeqId), 'active');
  this.activeSeqId = 0;
};

PlayList.prototype.findIdx = function _FINDIDX(seq) {
  var idx = 0;
  this.list.forEach(function _LOOP(element, arrIdx) {
    if (element.seq === seq) {
      idx = arrIdx;
    }
  });
  return idx;
};

PlayList.prototype.findBySeq = function _FINDBYSEQ(seq) {
  var targetPlaylist = null;
  this.list.forEach(function _LOOP(element) {
    if (element.seq === seq) {
      targetPlaylist = element;
    }
  });
  return targetPlaylist;
};


PlayList.prototype.add = function _ADD(fileObj) {
  var self = this;
  var insertAble = true;

  self.list.forEach(function _LOOP(listItem) {
    if (listItem.seq === fileObj.seq) {
      insertAble = false;
    }
  });
  if (insertAble) {
    self.list.push(fileObj);
  }
};

PlayList.prototype.clear = function _CLEAR() {
  this.list = [];
  this.removeHandler();
};

PlayList.prototype.addHandler = function _ADDHANDLER() {
  EventUtil.addHandler(this.$playlist, 'click', this.thisHandler);
  EventUtil.addHandler(this.$playlist, 'dblclick', this.thisDblHandler);
};

PlayList.prototype.removeHandler = function _REMOVEHANDLER() {
  this.activeSeqId = 0;
  EventUtil.removeHandler(this.$playlist, 'click', this.thisHandler);
  EventUtil.removeHandler(this.$playlist, 'dblclick', this.thisDblHandler);
};

PlayList.prototype.draw = function _DRAW() {
  var playlistItemHTML = document.getElementById('playlist-item').innerHTML;
  var appendListHtmlArray = [];

  this.list.forEach(function _LOOP(listItem) {
    appendListHtmlArray.push(template(playlistItemHTML, {
      'seq': listItem.seq,
      'name': listItem.name,
      'term': calculterm(listItem.term)
    }));
  });

  this.$playlist.innerHTML = appendListHtmlArray.join('');
  this.addHandler();
  this.changePlay(this.playSeqId);
};

