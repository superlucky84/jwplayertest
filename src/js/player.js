function Player() {
  var self = this;

  // 선택된 플레이리스트
  this.choicePlaylist = null;

  // 플레이된 플레이리스트
  this.lastPlayPlaylist = null;

  // 재생중인 파일
  this.choiceMusic = null;

  // 타게팅된 파일
  this.targitingMusic = null;
  this.targitingTimtout = null;

  // 경과시간
  this.spendTime = 0;
  this.timer = null;

  this.$playbutton = document.getElementById('play');
  this.$stopbutton = document.getElementById('stop');
  this.$nextbutton = document.getElementById('next');
  this.$prevbutton = document.getElementById('prev');

  EventUtil.addHandler(this.$prevbutton, 'click', function _EVENT() {
    self.prev();
  });

  EventUtil.addHandler(this.$nextbutton, 'click', function _EVENT() {
    self.next();
  });

  EventUtil.addHandler(this.$stopbutton, 'click', function _EVENT() {
    self.stop();
  });

  EventUtil.addHandler(this.$playbutton, 'click', function _EVENT() {
    self.play();
  });
}

Player.prototype.prev = function _PREV() {
  var self = this;

  if (self.choicePlaylist === null) {
    alert('선택된 리스트가 없습니다.');
    return;
  }

  if (self.targitingMusic) {
    self.choiceMusic = self.targitingMusic;
    self.targitingMusic = null;
  }

  var nextIdx = self.choicePlaylist.findIdx(self.choiceMusic.seq) - 1;
  if (nextIdx === -1)  {
    nextIdx = self.choicePlaylist.list.length - 1;
  }

  self.spendTime = 0;
  self.choiceMusic = self.choicePlaylist.list[nextIdx];

  self.stop();
  self.play();
};

Player.prototype.next = function _NEXT() {
  var self = this;

  if (self.choicePlaylist === null) {
    alert('선택된 리스트가 없습니다.');
    return;
  }

  if (self.targitingMusic) {
    self.choiceMusic = self.targitingMusic;
    self.targitingMusic = null;
  }

  var nextIdx = self.choicePlaylist.findIdx(self.choiceMusic.seq) + 1;
  if (self.choicePlaylist.list.length === nextIdx)  {
    nextIdx = 0;
  }

  self.spendTime = 0;
  self.choiceMusic = self.choicePlaylist.list[nextIdx];

  self.stop();
  self.play();
};

Player.prototype.smartPlay = function _SMARTPLAY() {
  var self = this;
  if (self.choiceMusic && (self.choiceMusic !== self.targitingMusic)) {
    self.stop();
    self.spendTime = 0;
    self.play();
  } else if (self.choiceMusic === null) {
    self.stop();
    self.play();
  }
};

Player.prototype.stop = function _STOP() {
  clearTimeout(this.timer);
  this.timer = null;
  this.$playbutton.className = 'inline';
  this.$stopbutton.className = 'hide';
};

Player.prototype.play = function _PLAY() {
  var self = this;

  if (self.choicePlaylist === null) {
    alert('선택된 리스트가 없습니다.');
    return;
  }

  self.$playbutton.className = 'hide';
  self.$stopbutton.className = 'inline';

  // 선택된 곡도 없고 타켓팅 된 곡도 없으면 처음곡을 선택한다.
  if (self.choiceMusic === null && self.targitingMusic === null) {
    self.choiceMusic = self.choicePlaylist.list[0];
  } else if (self.choiceMusic  && self.targitingMusic === null) {
    self.choiceMusic = self.choiceMusic;
  } else if (self.choiceMusic !== self.targitingMusic) {
    // 타켓팅된 곡이 있으면
    self.changePlayMusic();
    self.spendTime = 0;
    self.choiceMusic = self.targitingMusic;
  }

  // 마지막으로 선택된 플레이리스트체크
  self.lastPlayPlaylist = self.choicePlaylist;

  self.choicePlaylist.changePlay(self.choiceMusic.seq);

  self.timer = setInterval(function _TIMEOUT() {
    self.spendTime++;

    // 한곡이 끝나면 다음곡으로 변경
    if (self.choiceMusic.term === self.spendTime) {
      self.next();
    }

    var replaceHtml = template(document.getElementById('file-info-item').innerHTML, {
      'name': self.choiceMusic.name,
      'term': calculterm(self.choiceMusic.term - self.spendTime)
    });
    var percent = parseInt((self.spendTime / self.choiceMusic.term * 100));
    document.getElementById('progressGage').style.width = percent + '%';
    document.getElementById('file-info').innerHTML = replaceHtml;
  }, 1000);
};


Player.prototype.changePlayMusic = function _CHANGEPLAYMUSIC() {
  var replaceHtml = template(document.getElementById('file-info-item').innerHTML, {
    'name': this.targitingMusic.name,
    'term': calculterm(this.targitingMusic.term)
  });

  document.getElementById('file-info').innerHTML = replaceHtml;
};

Player.prototype.changeTargetMusic = function _CHANGETARGETMUSIC(targetMusic) {
  this.targitingMusic = targetMusic;

  if (this.targitingTimtout) {
    clearTimeout(this.targitingTimtout);
  }

  this.cancelActiveSeqId();
};

Player.prototype.cancelActiveSeqId = function _CANCELACTIVESEQID() {
  // 재생중일때만 지움
  if (this.timer) {
    this.targitingTimtout = setTimeout(function _TIMEOUT() {
      this.choicePlaylist.cancelActiveSeqId();
      this.targitingMusic = null;
    }.bind(this), 3000);
  }
};

