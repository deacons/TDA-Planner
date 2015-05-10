// Initialize your app
var appPlanner = new Framework7();

// Export selectors engine
var $$ = Dom7;

// Add views
var mainView = appPlanner.addView('.view-main', {
	// Because we use fixed-through navbar we can enable dynamic navbar
	dynamicNavbar: true
});
var tabTDAInfo = appPlanner.addView('#tab-tda-info', {
	dynamicNavbar: true
});
var tabTDALogin = appPlanner.addView('#tab-tda-login', {
	dynamicNavbar: true
});

// Storing username and password in localStorage
function store(){
	var inputUser = document.getElementById("username");
	localStorage.setItem("username", inputUser.value);
	var inputPass = document.getElementById("password");
	localStorage.setItem("password", inputPass.value);
	return true;
}
var inputUser = localStorage.getItem("username");
var inputPass = localStorage.getItem("password");

// This is the response HTML from ajax login form submission
var response;

// CURL values
var arrayPaths = [
	// Disable mobile
	"Z2FstudentsZ2F_layoutsZ2F15Z2FmobileZ2Fmblwikia.aspxZ3FUrlZ3DZ252FstudentsZ252FSitePagesZ252FHomeZ252EaspxZ26MobileZ3D0",
	// Student home
	"Z2FstudentsZ2FSitePagesZ2FHomeZ252Easpx"
];

$(document).ready(function(){
	// Show loading icon and disable button when login button tapped
	$('button[type="submit"]').click(function(){
		$('button[type="submit"]').attr('disabled','').html('<sub><span class="preloader preloader-white" style="height: 15px; width: 15px;"></span></sub>');
	});
});

function loginDone() {
	// Reset submit button text
	$('button[type="submit"]').text('Login').removeAttr('disabled');
	$('input[id="curl"]').attr('value', arrayPaths[0]);
}

// Run every time VLE tab is shown
$$('#tab-tda-login').on('show', function(){
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
		// jQuery the response once
		response = $(a);
		// Notification if credentials are incorrect
		if (response.find('.wrng:first').text() == "You could not be logged on to Forefront TMG. Make sure that your domain name, user name, and password are correct, and then try again.") {
			appPlanner.addNotification({
				title: 'Login Failed',
				message: 'Username or password incorrect',
				hold: 2000,
				closeIcon: false,
				closeOnClick: true
			});
		} else {
			$('input[id="curl"]').attr('value', arrayPaths[1]);
			$('form').ajaxSubmit(function(b) {
				response = $(b);
				loginParseResponse();
				loginDone();
			});
		}
	});
});

// Username as shown in top bar
var displayUser;

// Run once second submission is successful
function loginParseResponse() {
	response.find('.ms-core-menu-root').first().children(':first').remove();
	displayUser = response.find('.ms-core-menu-root').first().text();
}

// Generate dynamic page
function loginCreateContentPage() {
	tabTDALogin.router.loadContent(
		'<div class="navbar">' +
		'  <div class="navbar-inner">' +
		'    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Logout</span></a></div>' +
		'    <div class="center sliding">' + displayUser + '</div>' +
		'  </div>' +
		'</div>' +
		'<div class="pages">' +
		'  <div data-page="dynamic-pages" class="page">' +
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
}
