
function FileList () {
  this.list = [];
}

FileList.prototype.createFile = function() {
  console.log("createfile");

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


FileList.prototype.printFile = function() {
  console.log("printFile");

  var $filelist = document.getElementById("filelist");
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
  $filelist.innerHTML = appendListHtmlArray.join("");
}

function calculterm(term) {
	var minute = String(Math.floor(term/60));
  var second = String(term%60);

	minute = (minute.length == 1)?"0"+minute:minute;
	second = (second.length == 1)?"0"+second:second;
	return minute+":"+second;
}




