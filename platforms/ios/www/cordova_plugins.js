cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.rjfun.cordova.plugin.iad/www/iAd.js",
        "id": "com.rjfun.cordova.plugin.iad.iAd",
        "clobbers": [
            "window.plugins.iAd"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.statusbar/www/statusbar.js",
        "id": "org.apache.cordova.statusbar.statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.rjfun.cordova.plugin.iad": "0.1.2",
    "org.apache.cordova.statusbar": "0.1.7-dev"
}
// BOTTOM OF METADATA
});