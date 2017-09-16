


window.onload = function () {

  // 하나만 생성
	var playLists = new PlayLists();
	var fileList = new FileList(playLists);

  // 파일생성 후 출력
	fileList.createFile();
	fileList.draw();


}

