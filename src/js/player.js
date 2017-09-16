


function Player() {

  var self = this;

  // 선택된 플레이리스트
  this.choicePlaylist;

  // 재생중인 파일
  this.choiceMusic = null;

  // 타게팅된 파일
  this.targitingMusic == null;
  this.targitingTimtout = null;

  // 경과시간
  this.spendTime = 0;
  this.timer = null;

  this.$playbutton = document.getElementById("play");
  this.$stopbutton = document.getElementById("stop");
  this.$nextbutton = document.getElementById("next");
  this.$prevbutton = document.getElementById("prev");

  EventUtil.addHandler(this.$prevbutton, "click", function(event) {
    self.prev();
  });

  EventUtil.addHandler(this.$nextbutton, "click", function(event) {
    self.next();
  });

  EventUtil.addHandler(this.$stopbutton, "click", function(event) {
    self.stop();
  });

  EventUtil.addHandler(this.$playbutton, "click", function(event) {
    self.play();
  });
}

Player.prototype.prev = function() {
  var self = this;

  if (self.targitingMusic) {
    self.choiceMusic = self.targitingMusic;
    self.targitingMusic = null;
  }

  var nextIdx = self.choicePlaylist.findIdx(self.choiceMusic.seq) - 1;
  if(-1 == nextIdx)  {
    nextIdx = self.choicePlaylist.list.length - 1;
  }

  self.spendTime = 0;
  self.choiceMusic = self.choicePlaylist.list[nextIdx];

  self.stop();
  self.play();

}

Player.prototype.next = function() {
  var self = this;

  if (self.targitingMusic) {
    self.choiceMusic = self.targitingMusic;
    self.targitingMusic = null;
  }

  var nextIdx = self.choicePlaylist.findIdx(self.choiceMusic.seq) + 1;
  if(self.choicePlaylist.list.length == nextIdx)  {
    nextIdx = 0;
  }

  self.spendTime = 0;
  self.choiceMusic = self.choicePlaylist.list[nextIdx];

  self.stop();
  self.play();

}

Player.prototype.smartPlay = function() {
  var self = this;
  if (self.choiceMusic && (self.choiceMusic != self.targitingMusic)) {
    self.stop();
    self.spendTime = 0;
    self.play();
  }
  else if (self.choiceMusic == null) {
    self.stop();
    self.play();
  }
}

Player.prototype.stop = function() {
  clearTimeout(this.timer);
  this.timer = null
  this.$playbutton.className = "inline";
  this.$stopbutton.className = "hide";
}

Player.prototype.play = function() {
  var self = this;

  if (self.choicePlaylist == null) {
    alert('선택된 리스트가 없습니다.');
    return;
  }

  self.$playbutton.className = "hide";
  self.$stopbutton.className = "inline";

  // 선택된 곡도 없고 타켓팅 된 곡도 없으면 처음곡을 선택한다.
  if (self.choiceMusic == null && self.targitingMusic == null) {
    console.log("jinwoo");
    self.choiceMusic = self.choicePlaylist.list[0];
    console.log(self.choicePlaylist);
  }
  else if (self.choiceMusic  && self.targitingMusic == null) {
    self.choiceMusic = self.choiceMusic;
  }
  // 타켓팅된 곡이 있으면
  else if (self.choiceMusic != self.targitingMusic) {
    self.changePlayMusic();
    self.spendTime = 0;
    self.choiceMusic = self.targitingMusic;
  }

  self.choicePlaylist.changePlay(self.choiceMusic.seq);

  self.timer = setInterval(function() {
    self.spendTime++;

    // 한곡이 끝나면 다음곡으로 변경
    if (self.choiceMusic.term == self.spendTime) {
      self.next();
    }

    var replaceHtml = template(document.getElementById("file-info-item").innerHTML,{
      "name": self.choiceMusic.name,
      "term": calculterm(self.choiceMusic.term - self.spendTime)
    });
    document.getElementById("file-info").innerHTML = replaceHtml;
  }, 1000);

}


Player.prototype.changePlayMusic = function() {

  var replaceHtml = template(document.getElementById("file-info-item").innerHTML,{
    "name": this.targitingMusic.name,
    "term": calculterm(this.targitingMusic.term)
  });
  document.getElementById("file-info").innerHTML = replaceHtml;

}

Player.prototype.changeTargetMusic = function(targetMusic) {


  this.targitingMusic = targetMusic;

  if (this.targitingTimtout) {
    clearTimeout(this.targitingTimtout);
  }

  this.cancelActiveSeqId();

}

Player.prototype.cancelActiveSeqId = function() {
  // 재생중일때만 지움
  if (this.timer) {
    this.targitingTimtout = setTimeout(function() {
      this.choicePlaylist.cancelActiveSeqId();
      this.targitingMusic = null;
    }.bind(this),3000);
  }
}

