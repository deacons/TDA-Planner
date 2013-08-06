//Copyright (c) 2003-2006 Microsoft Corporation.  All rights reserved.

function onld()
{
}

function chkCookies()
{
	// Are cookies enabled?
	//
	var sCN = "cookieTest";

	// Get Date in the future so this will expire
	//
	var dt = new Date();
	dt.setSeconds(dt.getSeconds() + 2);

	document.cookie = sCN + "=1; expires=" + dt.toGMTString();
	var cookiesEnabled = document.cookie.indexOf(sCN + "=") != -1;

	if (cookiesEnabled == false)
	{
		shw(gbid("tblMid2"));
		hd(gbid("tblMid"));
	}
	
	return cookiesEnabled;
}

function ldCookie(un, next)
{
	// Check for username cookie
	//	
	var re = /(^|; )logondata=acc=([0|1])&lgn=([^;]+)(;|$)/;
	var rg = re.exec(document.cookie);
	
	if (rg)
	{
		// Fill in username, set security to private, and restore the "use basic" selection
		//
		
		gbid(un).value = rg[3];
		gbid(next).focus();
		gbid("rdoPrvt").click();
	}
	else
	{
		// The variable g_fFcs is set to false when the password gains focus,
		// so that we don't accidentally set focus to the username field while
		// the user is typing their password
		//
		if (g_fFcs)
			gbid(un).focus();
	}
}

function clkExp(o)
{
    switch(o)
    {
        case lnkShwSec:
               hd(lnkShwSec);
               shw(lnkHdSec);
               shw(trPubExp);
               shw(trPrvtExp);
               lnkHdSec.focus();
               break;
        case lnkHdSec:
                shw(lnkShwSec);
                hd(lnkHdSec);
                hd(trPubExp);
                hd(trPrvtExp);
                lnkShwSec.focus();
                break;
    }
}

function clkExp2(o)
{
    switch(o)
    {
        case lnkShwSec2:
                hd(lnkShwSec2);
                shw(lnkHdSec2);
                shw(trPrvtExp2);
                lnkHdSec2.focus();
                break;
        case lnkHdSec2:
                shw(lnkShwSec2);
                hd(lnkHdSec2);
                hd(trPrvtExp2);
                lnkShwSec2.focus();
                break;
    }
}

function clkExp3(o)
{
    switch(o)
    {
        case lnkShwSec3:
            hd(lnkShwSec3);
            shw(lnkHdSec3);
            shw(trPrvtExp3);
            lnkHdSec3.focus();
            break;
        case lnkHdSec3:
            shw(lnkShwSec3);
            hd(lnkHdSec3);
            hd(trPrvtExp3);
            lnkShwSec3.focus();
            break;
    }
}

function clkExp4(o)
{
    switch(o)
    {
        case lnkShwExp4:
            hd(lnkShwExp4);
            shw(lnkHdExp4);
            shw(trPinSysExp);
            shw(trPinUserExp);
            lnkHdExp4.focus();
            break;
        case lnkHdExp4:
            shw(lnkShwExp4);
            hd(lnkHdExp4);
            hd(trPinSysExp);
            hd(trPinUserExp);
            lnkShwExp4.focus();
            break;
    }
}

function shw(o)
{
    o.style.display = "";
}

function hd(o)
{
    o.style.display = "none"
}

function clkLgn()
{
	// If security is set to private, add a cookie to persist username and basic setting
	// Cookie format: logondata=acc=<1 or 0>&lgn=<username>
	//
	if (gbid("rdoPrvt").checked)
	{
		// Calculate the expires time for two weeks
		//
		var oD = new Date();
		oD.setTime(oD.getTime() + 2*7*24*60*60*1000);
		var sA = "acc=" + 0;
		var sL = "lgn=" + getUser().value;
		document.cookie = "logondata=" + sA + "&" + sL + "; expires=" + oD.toUTCString();
	}
}

function clkSec()
{
    var rdoPrvt = document.getElementById('rdoPrvt');
    var c = rdoPrvt.checked;
    if (c)
    {
	    trPrvtWrn.style.display = "";
    } else
    {
		trPrvtWrn.style.display = "none";
		// Remove the cookie by expiring it
		//
		var oD = new Date();
		oD.setTime(oD.getTime() - 9999);
		document.cookie = "logondata=; expires=" + oD.toUTCString();
    }
}

function clkBsc()
{
    var chkBsc = document.getElementById('chkBsc');
    if (chkBsc.checked)
    {
        trBscExp.style.display = "";
        chkBsc.value = 1;
    } else {
        trBscExp.style.display = "none";
        chkBsc.value = 0;
    }
}

function clkChpwd()
{
    var chkChpwd = document.getElementById('chpwd');
    if (chkChpwd.checked)
    {
		trChpwdExp.style.display = "";
		chkChpwd.value = "on";
    } else
    {
		trChpwdExp.style.display = "none";
		chkChpwd.value = "";
    }
}

function optClkSec()
{
    var optClk = document.getElementById('optClk');
    var c = optClk.checked;
    var un = document.getElementById('un');
    un.style.display = c ? "" : "none";
}

function clkPin()
{
    var chkPin = document.getElementById('rdoCPinSys');
    var newPin = document.getElementById('newpin');
    var nextPrn = document.getElementById('nextprn');
    if (chkPin.checked)
    {
        newPin.disabled = true;
        nextPrn.disabled = true;
    }
    else
    {
        newPin.disabled = false;
        nextPrn.disabled = false;
    }
}

function clkRtry()
{
	window.location.reload();
}

function gbid(s)
{
	return document.getElementById(s);
}

function getUser()
{
	var un = gbid("userid");
	if (!un)
	{
		return gbid("username");
	}
	return un;
}

function IsIE()
{
	var iVO = navigator.appVersion.indexOf("MSIE ");  // Version offset

	// Check for IE-only property to thwart clients masquerading as IE
	//
	if (iVO != -1 && typeof window.external == "object")
	{
		var iVerT = parseInt(navigator.appVersion.substring(iVO + 5, iVO + 6), 10);

		if (!isNaN(iVerT))
		{
			return true;
		}
	}

	return false;
}
