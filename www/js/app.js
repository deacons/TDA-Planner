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
		$('button[type="submit"]').html('<sub><span class="preloader preloader-white" style="height: 15px; width: 15px;"></span></sub>');
		window.setTimeout(function(){
			$('button[type="submit"]').prop('disabled', true);
		},100);
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
				loginCreateContentPage();
				loginDone();
			});
		}
	});
});

// For displaying to user, extracted from VLE
var displayUser; // User's full name per top bar
var displayToday; // Today's day from timetable (e.g. "Mon A")
var loginParsedTimetableToday; // Today's periods
var loginParsedTimetableTodaySubjects = []; // Array of subjects today
var loginParsedTimetableTodayRooms = []; // Array of rooms for loginParsedTimetableTodaySubjects
var loginParsedTimetableTodayTeachers = []; // Array of teachers for loginParsedTimetableTodaySubjects
var loginParsedTimetableTodayPeriod = []; // Array of periods for loginParsedTimetableToday
var displayParsedTimetableTodayListViewRow = []; // Array of list view rows to be displayed
// Rows of timetable to be shown on screen
var displayListViewRow = [
	'<li class="item-content"><div class="item-media">',
	'</div><div class="item-inner"><div class="item-title">',
	'</div><div class="item-after">',
	'</div></div></li>'
];

// Run once second submission is successful
function loginParseResponse() {
	// Remove extra accessibility element from user's name
	response.find('.ms-core-menu-root').first().children(':first').remove();
	// Save user's name
	displayUser = response.find('.ms-core-menu-root').first().text();
	// Check if today has a timetable
	if (response.find('.sor-current:first').children().first().text().length != 2) {
		displayToday = '<div class="content-block-title">' + response.find('.sor-current:first').children().first().text() + '</div>';
		// Today's timetable
		loginParsedTimetableToday = response.find('.sor-current:first').children().filter(':not(:first)');
		// Today's timetable subjects
		for (i = 0; i < loginParsedTimetableToday.length; ++i) {
			if ($(loginParsedTimetableToday[i]).children().filter(':nth-child(2)').contents().text().length != 1) {
				loginParsedTimetableTodaySubjects.push($(loginParsedTimetableToday[i]).children().filter(':nth-child(2)').contents().text());
			} else {
				loginParsedTimetableTodaySubjects.push(undefined);
			}
		}
		// Today's timetable rooms
		for (i = 0; i < loginParsedTimetableToday.length; ++i) {
			if ($(loginParsedTimetableToday[i]).children().filter(':nth-child(3)').contents().filter('a').length) {
				loginParsedTimetableTodayRooms.push($(loginParsedTimetableToday[i]).children().filter(':nth-child(3)').contents().attr('href').split('/')[4]);
			} else {
				loginParsedTimetableTodayRooms.push(undefined);
			}
		}
		// Today's timetable teachers
		for (i = 0; i < loginParsedTimetableToday.length; ++i) {
			if ($(loginParsedTimetableToday[i]).children().first().text().length != 1) {
				loginParsedTimetableTodayTeachers.push($(loginParsedTimetableToday[i]).children().first().text().trim());
			} else {
				loginParsedTimetableTodayTeachers.push(undefined);
			}
		}
		// Today's timetable periods
		for (i = 0; i < loginParsedTimetableToday.length+1; ++i) {
			switch (true) {
				case ($(loginParsedTimetableToday[i]).attr('colspan') == '1'):
					loginParsedTimetableTodayPeriod.push(i+1);
					break;
				case ($(loginParsedTimetableToday[i]).attr('colspan') == '2'):
					loginParsedTimetableTodayPeriod.push((i+1).toString() + '–' + (i+2).toString());
					i++;
					break;
				default:
					loginParsedTimetableTodayPeriod.push(i+1);
			}
		}
		for (i = 0; i < loginParsedTimetableToday.length; ++i) {
			if (typeof loginParsedTimetableTodaySubjects[i] == 'undefined') {
				loginParsedTimetableTodaySubjects[i] = '';
				loginParsedTimetableTodayRooms[i] = '';
			}
		}
		for (i = 0; i < loginParsedTimetableToday.length; ++i) {
			var displayListViewRowRight;
			if (typeof loginParsedTimetableTodayTeachers[i] != 'undefined') {
				displayListViewRowRight = loginParsedTimetableTodayRooms[i] + ' ' + loginParsedTimetableTodayTeachers[i];
			} else {
				displayListViewRowRight = loginParsedTimetableTodayRooms[i];
			}
			displayParsedTimetableTodayListViewRow.push(displayListViewRow[0] + loginParsedTimetableTodayPeriod[i] + displayListViewRow[1] + loginParsedTimetableTodaySubjects[i] + displayListViewRow[2] + displayListViewRowRight + displayListViewRow[3]);
		}
	} else {
		displayToday = '';
		displayParsedTimetableTodayListViewRow.push(displayListViewRow[0] + displayListViewRow[1] + 'No timetable' + displayListViewRow[2]);
	}
}

// Generate dynamic page
function loginCreateContentPage() {
	tabTDALogin.router.loadContent(
		'<div class="navbar"><div class="navbar-inner"><div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Logout</span></a></div>' +
		'<div class="center sliding">' + displayUser + '</div></div></div>' +
		'<div class="pages"><div data-page="vle-landing" class="page"><div class="page-content">' +
		displayToday +
		'<div class="list-block inset"><ul>' +
		displayParsedTimetableTodayListViewRow.join('') +
		'</ul></div>' +
		'</div></div></div></div></div>'
	);
}
