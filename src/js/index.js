


window.onload = function () {

  // 하나만 생성
	var player = new Player();
	var playLists = new PlayLists();
	var fileList = new FileList(playLists, player);

  // 파일생성 후 출력
	fileList.createFile();
	fileList.draw();


}

