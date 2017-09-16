
function FileList (playLists, player) {
  this.list = [];

  this.$filelist = document.getElementById("filelist");

  // ADD EVENT
	var $createPlayletButton = document.getElementById("craeatePlaylist");
	var $deleteFileButton = document.getElementById("deleteFile");

	EventUtil.addHandler($createPlayletButton, "click", function () {
		this.createPlaylist(playLists, player);
	}.bind(this));

	EventUtil.addHandler($deleteFileButton, "click", function () {

    var checkedlist = [];
    var inputs = this.$filelist.getElementsByTagName("input");

    for ( var inputIdx in inputs) {
      if (!inputs[inputIdx].checked) { 
        continue;
      }
      checkedlist.push(parseInt(inputs[inputIdx].value));
      inputs[inputIdx].checked = false;
    }

  
    this.deleteFileChk(playLists, checkedlist);

	}.bind(this));

}

FileList.prototype.findFileDelete = function(playLists, checkedlist) {

  var self = this;
  var alertList = [];
  this.list.forEach(function(fileObj){
    if (checkedlist.indexOf(fileObj.seq) >= 0) {
      var delIdx = self.findIdx(fileObj.seq);
      self.list.splice(delIdx,1);
    }
  });

  playLists.list.forEach(function(listItem) {
    var playlist = listItem.playlist;
    playlist.findFileDelete(checkedlist);
  });

  this.draw();

}


FileList.prototype.deleteFileChk = function(playLists, checkedlist) {
  // 해당 시퀀스를 가지고 있는 플레이리스트를 찾는다

  if (checkedlist.length == 0) {
    alert("체크박스를 선택해주세요.");
    return;
  }

  var alertAll = [];
  playLists.list.forEach(function(listItem) {
    var playlist = listItem.playlist;
    var alertList = playlist.findFileSeq(checkedlist);
    if (alertList.length > 0) {
      alertAll.push(alertList);
    }
  });
  if (alertAll.length > 0) {
    //console.log(alertAll);
    if (!confirm("플레이리스트에 포함되어 있습니다! 정말 지웁니까 ->\n "+alertAll.join(", "))) {
      return false;
    }
    this.findFileDelete(playLists, checkedlist);
  }
  else {
    this.findFileDelete(playLists, checkedlist);
  }
}

FileList.prototype.findIdx = function(seq) {
  var idx = 0;
  this.list.forEach(function(element, arrIdx) {
    if (element.seq == seq) {
      idx = arrIdx;
    }
  });
  return idx;
}


FileList.prototype.createPlaylist = function(playLists, player) {

    var checkedlist = [];
    var inputs = this.$filelist.getElementsByTagName("input");

    for ( var inputIdx in inputs) {
      if (!inputs[inputIdx].checked) { 
        continue;
      }
      checkedlist.push(this.findBySeq(inputs[inputIdx].value));
      inputs[inputIdx].checked = false;
    }

    if (checkedlist.length == 0 ) {
      alert('하나로도 선택해야 합니다.');
      return;
    }

    // 플래이리스트에 리스트 추가
    var playList = new PlayList(playLists.generateName(), player);
    checkedlist.forEach(function(fileObj){
      playList.add(fileObj);
    });

    // 플래이 리스트목록에 플레이리스트 추가
    playLists.add(playList);

}

FileList.prototype.findBySeq = function(seq) {
  var targetPlaylist = null;
  this.list.forEach(function(element) {
    if (element.seq == seq) {
      targetPlaylist = element;
    }
  });
  return targetPlaylist;
}


FileList.prototype.createFile = function() {

  var seq = 1;
  var chkFilenameArr = [];
  for (var i=0 ; i<20 ; i++) {
    var newfilename = filenamelist[Math.floor((Math.random() * 150))]; // 149 까지 나와야함
    var term = Math.floor(Math.random()*61) + 10;

		if (chkFilenameArr.indexOf(newfilename) < 0) {
			chkFilenameArr.push(newfilename);
			this.list.push({
				'seq': seq++,
				'name': newfilename,
				'term': term
			});
    }
  }

	this.list.sort(function(a, b) {
			return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
	});

}


FileList.prototype.draw = function() {

  //var $filelist = document.getElementById("filelist");
  var filelistItemHTML = document.getElementById("filelist-item").innerHTML;
  var appendListHtmlArray = [];

  for ( var listIdx in this.list) {
    var listItem = this.list[listIdx];

    if(!listItem.seq) {
      continue;
    }

    appendListHtmlArray.push(template(filelistItemHTML, {
      'seq': listItem.seq,
      'name': listItem.name,
      'term': calculterm(listItem.term)
    }));
  }
  this.$filelist.innerHTML = appendListHtmlArray.join("");

}

function calculterm(term) {
	var minute = String(Math.floor(term/60));
  var second = String(term%60);

	minute = (minute.length == 1)?"0"+minute:minute;
	second = (second.length == 1)?"0"+second:second;
	return minute+":"+second;
}




