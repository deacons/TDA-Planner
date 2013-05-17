window.onload = function() {
    var a = document.getElementById("testext");
    a.onclick = function() {
    	var ref = window.open('http://georgegarside.x10.bz/testpg.html', '_blank', 'location=no');
    	ref.addEventListener('loadstart', function(event) {
    	    var urlSuccessPage = "http://georgegarside.x10.bz/testpgsuccess.html";
    	    if (event.url == urlSuccessPage) {
    	    	ref.close();
    	    	window.location.href="index.html"
    	    }
    	});
    	return false;
    }
}
