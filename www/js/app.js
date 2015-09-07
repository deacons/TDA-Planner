"use strict";

var appPlanner = new Framework7();
var $$ = Dom7;
// Tabs
var mainView 		= appPlanner.addView(	'.view-main', 		{	dynamicNavbar: true });
var tabTDAInfo 	= appPlanner.addView(	'#tab-tda-info', 	{ dynamicNavbar: true });
var tabTDALogin	= appPlanner.addView(	'#tab-tda-login', { dynamicNavbar: true });

// News
$('#news').load('https://georgegarside.com/apps/tda-planner/remote/news/news.html #load-news');

var VLE = {};
VLE.login = {
	// Storing username and password in localStorage
	store: function() {
		localStorage.setItem("username", document.getElementById("username").value);
		localStorage.setItem("password", document.getElementById("password").value);
		return true;
	},
	retrieve: function(idUsername, idPassword) {
		document.getElementById(idUsername).value = localStorage.getItem("username");
		document.getElementById(idPassword).value = localStorage.getItem("password");
	},
	done: function(status) {
		// Reset submit button text
		$('button[type="submit"]').text('Sign in').removeAttr('style');
		$('input[id="curl"]').attr('value', VLE.login.arrayPaths[0]);
		if (status == false) {
			appPlanner.addNotification({
				title: 'Login Failed',
				message: 'Username or password incorrect',
				hold: 2000,
				closeIcon: false,
				closeOnClick: true
			});
		} else if (status == true) {
			appPlanner.closeModal();
		}
	},
	// Run on user log out
	reset: function() {
		displayUser = undefined;
		displayToday = undefined;
		loginParsedTimetableToday = undefined;
		loginParsedTimetableTodaySubjects = [];
		loginParsedTimetableTodayRooms = [];
		loginParsedTimetableTodayTeachers = [];
		loginParsedTimetableTodayPeriod = [];
		displayParsedTimetableTodayListViewRow = [];
	},
	arrayPaths: [
		// Disable mobile
		"Z2FstudentsZ2F_layoutsZ2F15Z2FmobileZ2Fmblwikia.aspxZ3FUrlZ3DZ252FstudentsZ252FSitePagesZ252FHomeZ252EaspxZ26MobileZ3D0",
		// Student home
		"Z2FstudentsZ2FSitePagesZ2FHomeZ252Easpx"
	]
};

$(document).ready(function(){
	// Show loading icon and disable button when login button tapped
	$('button[type="submit"]').click(function(){
		// Insert preloader wheel into log in button
		$('button[type="submit"]').html('<sub><span class="preloader"></span></sub>');
	});
});

// Run every time VLE tab is shown
$$('#tab-tda-login').on('show', function(){
	VLE.login.retrieve('username', 'password');
	if (navigator.network.connection.type == Connection.NONE) {
		// All this removes the title from the JS alert
		var iframe = document.createElement("IFRAME");
		iframe.setAttribute("src", 'data:text/plain,');
		document.documentElement.appendChild(iframe);
		window.frames[0].window.alert('No network connection is available. Make sure you are connected to Wi-Fi or a mobile network.');
		iframe.parentNode.removeChild(iframe);
	}
	$('form').ajaxForm(function(a) {
		// Notification if credentials are incorrect
		if ($(a).find('.wrng:first').text() == "You could not be logged on to Forefront TMG. Make sure that your domain name, user name, and password are correct, and then try again.") {
			VLE.login.done(false);
		} else {
			// No immediate error, move on. Second path & resubmit.
			$('input[id="curl"]').attr('value', VLE.login.arrayPaths[1]);
			$('form').ajaxSubmit(function(b) {
				VLE.login.reset();
				var response = $(b);
				VLE.parse(response);
				VLE.createPage();
				VLE.login.done(true);
			});
		}
	});
});

// Login screen hides status bar
$$('.login-screen').on('open', function(){
	// Set username/password inputs from localStorage
	VLE.login.retrieve();
	setTimeout(function(){
		StatusBar.hide();
	},200)
});
$$('.login-screen').on('close', function(){ StatusBar.show(); });

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
	'<li class="item-content">',
	'</div><div class="item-inner" style="',
	'"><div class="item-title">',
	'</div><div class="item-after">',
	'</div></div></li>'
];
// For replacing shorthand lesson titles
var dictSubjects = {
	'FM': 'Further Maths',
	'MAFM': 'Further Maths',
	'STY': 'Study',
	'PDE': 'PD'
};

// Run once second submission is successful
VLE.parse = function loginParseResponse(response) {
	// Remove extra accessibility element from user's name
	response.find('.ms-core-menu-root').first().children(':first').remove();
	// Save user's name
	displayUser = response.find('.ms-core-menu-root').first().text();
	// Check if today has a timetable
	if (response.find('.sor-current:first').children().first().text().length != 2) {
		displayToday = '<div class="content-block-title">' + response.find('.sor-current:first').children().first().text() + '</div>';
		// Today's timetable
		loginParsedTimetableToday = response.find('.sor-current:first').children().filter(':not(:first)');
		var i;
		for (i = 0; i < loginParsedTimetableToday.length; ++i) {
			// Today's timetable subjects
			if ($(loginParsedTimetableToday[i]).children().filter(':nth-child(2)').contents().text().length != 1) {
				loginParsedTimetableTodaySubjects.push($(loginParsedTimetableToday[i]).children().filter(':nth-child(2)').contents().text());
			} else {
				loginParsedTimetableTodaySubjects.push(undefined);
			}
			// Today's timetable rooms
			if ($(loginParsedTimetableToday[i]).children().filter(':nth-child(3)').contents().filter('a').length) {
				loginParsedTimetableTodayRooms.push($(loginParsedTimetableToday[i]).children().filter(':nth-child(3)').contents().attr('href').split('/')[4]);
			} else {
				loginParsedTimetableTodayRooms.push(undefined);
			}
			// Today's timetable teachers
			if ($(loginParsedTimetableToday[i]).children().first().text().length != 1) {
				loginParsedTimetableTodayTeachers.push($(loginParsedTimetableToday[i]).children().first().text().trim());
			} else {
				loginParsedTimetableTodayTeachers.push(undefined);
			}
			// Don't show undefined for undefined
			if (typeof loginParsedTimetableTodaySubjects[i] == 'undefined') {
				loginParsedTimetableTodaySubjects[i] = '';
				loginParsedTimetableTodayRooms[i] = '';
			}
		}
		// Today's timetable periods
		for (i = 0; i < loginParsedTimetableToday.length+1; ++i) {
			switch (true) {
				case ($(loginParsedTimetableToday[i]).attr('colspan') == '1'):
					loginParsedTimetableTodayPeriod.push('<div class="item-media">' + (i+1).toString());
					break;
				case ($(loginParsedTimetableToday[i]).attr('colspan') == '2'):
					loginParsedTimetableTodayPeriod.push('<div class="item-media" style="line-height: 35px;	padding-top: 0; padding-bottom: 0;">' + (i+1).toString() + '<br>' + (i+2).toString());
					i++;
					break;
				default:
					loginParsedTimetableTodayPeriod.push('<div class="item-media">' + (i+1).toString());
			}
		}
		// Don't show undefined for undefined
		for (i = 0; i < loginParsedTimetableTodaySubjects.length; ++i) {
			if (typeof dictSubjects[loginParsedTimetableTodaySubjects[i]] != 'undefined') {
				loginParsedTimetableTodaySubjects[i] = dictSubjects[loginParsedTimetableTodaySubjects[i]];
			}
		}
		// Construct list view row
		// if check that there are any lessons obtained
		if (loginParsedTimetableToday.length != 0) {
			for (i = 0; i < loginParsedTimetableToday.length; ++i) {
				// Right side of list row showing room and teacher
				var displayListViewRowRight;
				if (typeof loginParsedTimetableTodayRooms[i] == 'undefined' && typeof loginParsedTimetableTodayTeachers[i] == 'undefined') {
					displayListViewRowRight = '';
				} else if (typeof loginParsedTimetableTodayRooms[i] == 'undefined') {
					displayListViewRowRight = loginParsedTimetableTodayTeachers[i];
				} else if (typeof loginParsedTimetableTodayTeachers[i] == 'undefined') {
					displayListViewRowRight = loginParsedTimetableTodayRooms[i];
				} else {
					displayListViewRowRight = loginParsedTimetableTodayRooms[i] + ' ' + loginParsedTimetableTodayTeachers[i];
				}
				// Double period lesson
				if (loginParsedTimetableTodayPeriod[i].length == 92) {
					var displayListViewRowVertical2 = 'height: 70px;';
				} else {
					displayListViewRowVertical2 = '';
				}
				displayParsedTimetableTodayListViewRow.push(displayListViewRow[0] + loginParsedTimetableTodayPeriod[i] + displayListViewRow[1] + displayListViewRowVertical2 + displayListViewRow[2] + loginParsedTimetableTodaySubjects[i] + displayListViewRow[3] + displayListViewRowRight + displayListViewRow[4]);
			}
		} else {
			displayToday = '';
			displayParsedTimetableTodayListViewRow.push(displayListViewRow[0] + 'Error obtaining timetable' + displayListViewRow[1] + displayListViewRow[2] + displayListViewRow[3]);
		}
	} else {
		displayToday = '';
		displayParsedTimetableTodayListViewRow.push(displayListViewRow[0] + 'No timetable today' + displayListViewRow[1] + displayListViewRow[2] + displayListViewRow[3]);
	}
};

// Generate dynamic page
VLE.createPage = function loginCreateContentPage() {
	tabTDALogin.router.loadContent(
		'<div class="navbar"><div class="navbar-inner"><div class="center sliding">' + displayUser + '</div></div></div>' +
		'<div class="pages"><div data-page="vle-landing" class="page"><div class="page-content">' + displayToday +
		'<div class="list-block inset"><ul>' + displayParsedTimetableTodayListViewRow.join('') + '</ul></div>' +
		'<div class="content-block"><a href="#" class="back link"><span>Logout</span></a></div></div>' +
		'</div></div></div></div></div>'
	);
};
