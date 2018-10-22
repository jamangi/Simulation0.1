window.onload = function() {

	////////// Datastore //////////
	let ds = new Datastore();

	////////// Set (set username, character, and ip) ///////////
	let setForm = document.getElementById('setForm');
	setForm.addEventListener('submit', function (evnt) {
		evnt.preventDefault();
		setSend();
	});




	//////////  Dump (multiple file upload) ////////////// 
	let fileCatcher = document.getElementById('file-catcher');
	let fileInput = document.getElementById('file-input');
	let fileListDisplay = document.getElementById('dumpContent');

	let fileList = [];

	fileCatcher.addEventListener('submit', function (evnt) {
	  	evnt.preventDefault();
	  	fileListDisplay.innerHTML = '';
	    fileList.forEach(function (file) {
	    	sendFile(file, addToModal);
	    });
	 });

	fileInput.addEventListener('change', function (evnt) {
			fileList = [];
	  	for (var i = 0; i < fileInput.files.length; i++) {
	    	fileList.push(fileInput.files[i]);
	    }
	    renderFileList(fileList, fileListDisplay);
	});

}