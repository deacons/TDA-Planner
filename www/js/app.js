// Initialize your app
var appPlanner = new Framework7();

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = appPlanner.addView('.view-main', {
	// Because we use fixed-through navbar we can enable dynamic navbar
	dynamicNavbar: true
});

function store(){
	var inputUser = document.getElementById("username");
	localStorage.setItem("username", inputUser.value);
	var inputPass = document.getElementById("password");
	localStorage.setItem("password", inputPass.value);
	return true;
}

var inputUser = localStorage.getItem("username");
var inputPass = localStorage.getItem("password");

var response;

appPlanner.onPageInit('login', function (page) {
	if (inputUser) {
		document.getElementById('username').value = inputUser;
		document.getElementById('password').value = inputPass;
	}
	var networkState = navigator.network.connection.type;
	if (networkState == Connection.NONE) {
		var iframe = document.createElement("IFRAME");
		iframe.setAttribute("src", 'data:text/plain,');
		document.documentElement.appendChild(iframe);
		window.frames[0].window.alert('No network connection is available. Make sure you are connected to Wi-Fi or a mobile network.');
		iframe.parentNode.removeChild(iframe);
	}
	$('form').ajaxForm(function(a) {
		console.log('Submit');
		response = a;
	});
});

// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage() {
	mainView.router.loadContent(
		'<!-- Top Navbar-->' +
		'<div class="navbar">' +
		'  <div class="navbar-inner">' +
		'    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
		'    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
		'  </div>' +
		'</div>' +
		'<div class="pages">' +
		'  <!-- Page, data-page contains page name-->' +
		'  <div data-page="dynamic-pages" class="page">' +
		'    <!-- Scrollable page content-->' +
		'    <div class="page-content">' +
		'      <div class="content-block">' +
		'        <div class="content-block-inner">' +
		'          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
		'          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>' +
		'        </div>' +
		'      </div>' +
		'    </div>' +
		'  </div>' +
		'</div>'
	);
	return;
}