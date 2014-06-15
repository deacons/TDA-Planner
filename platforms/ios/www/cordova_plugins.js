cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.rjfun.cordova.plugin.iad/www/iAd.js",
        "id": "com.rjfun.cordova.plugin.iad.iAd",
        "clobbers": [
            "window.plugins.iAd"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.rjfun.cordova.plugin.iad": "0.1.2"
}
// BOTTOM OF METADATA
});