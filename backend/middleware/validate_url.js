var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var validate = function(url){
    var http = new XMLHttpRequest();

    http.open('HEAD', url, false);
    http.send();

    if(http.status == 200){
        return true;
    }

    return false;
}

module.exports = validate