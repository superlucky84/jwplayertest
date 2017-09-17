window.onload = function _ONLOAD() {
  var player = new Player();
  var playLists = new PlayLists(player);
  var fileList = new FileList(playLists, player);

  fileList.createFile();
  fileList.draw();
};
