


function Player() {

  var self = this;

  // 재생중인 파일
  this.choiceMusic;

  // 타게팅된 파일
  this.targitingMusic;

  // 경과시간
  this.spendTime = 0;

  this.$playbutton = document.getElementById("play");


  EventUtil.addHandler(this.$playbutton, "click", function(event) {

    self.changePlayMusic();

    self.choiceMusic = self.targitingMusic;

    setInterval(function() {
      self.spendTime++;
      var replaceHtml = template(document.getElementById("file-info-item").innerHTML,{
        "name": self.choiceMusic.name,
        "term": calculterm(self.choiceMusic.term - self.spendTime)
      });
      document.getElementById("file-info").innerHTML = replaceHtml;
    }, 1000);


  });
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
}

