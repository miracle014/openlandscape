const webhook = require("webhook-discord");
 
const Hook = new webhook.Webhook("https://discordapp.com/api/webhooks/574161391926378507/jG74zUujKFiteUrtGThXJuEsyNoXL-8ZH_D9bH185XtBtmAZDZpZYSF1xJUKAbJPlq0Z")
exports.HTTPSTATUS = function(res,status,msg,data){
	
    status = parseInt(status)
    isNaN(status) ? (status = 500 , data={MESSAGE:'STATUS NUMBER ONLY'}) : '' 
  
    var $text
    switch (status) {
        case 100: $text = 'Continue'; break;
        case 101: $text = 'Switching Protocols'; break;
        case 200: $text = 'OK'; break;
        case 201: $text = 'Created'; break;
        case 202: $text = 'Accepted'; break;
        case 203: $text = 'Non-Authoritative Information'; break;
        case 204: $text = 'No Content'; break;
        case 205: $text = 'Reset Content'; break;
        case 206: $text = 'Partial Content'; break;
        case 300: $text = 'Multiple Choices'; break;
        case 301: $text = 'Moved Permanently'; break;
        case 302: $text = 'Moved Temporarily'; break;
        case 303: $text = 'See Other'; break;
        case 304: $text = 'Not Modified'; break;
        case 305: $text = 'Use Proxy'; break;
        case 400: $text = 'Bad Request'; break;
        case 401: $text = 'Unauthorized'; break;
        case 402: $text = 'Payment Required'; break;
        case 403: $text = 'Forbidden'; break;
        case 404: $text = 'Not Found'; break;
        case 405: $text = 'Method Not Allowed'; break;
        case 406: $text = 'Not Acceptable'; break;
        case 407: $text = 'Proxy Authentication Required'; break;
        case 408: $text = 'Request Time-out'; break;
        case 409: $text = 'Conflict'; break;
        case 410: $text = 'Gone'; break;
        case 411: $text = 'Length Required'; break;
        case 412: $text = 'Precondition Failed'; break;
        case 413: $text = 'Request Entity Too Large'; break;
        case 414: $text = 'Request-URI Too Large'; break;
        case 415: $text = 'Unsupported Media Type'; break;
        case 500: $text = 'Internal Server Error'; break;
        case 501: $text = 'Not Implemented'; break;
        case 502: $text = 'Bad Gateway'; break;
        case 503: $text = 'Service Unavailable'; break;
        case 504: $text = 'Gateway Time-out'; break;
        case 505: $text = 'HTTP Version not supported'; break;
        default:
            $text = `ERROR STATUS ${status}`
            data = {STATUS:status}
            status = 505
            
        break;
    }
    var jsonError = {'STATUS':status,'MESSAGE':msg==null?$text:msg,'DATA':data==null?[]:data}
    return res.status(status).json(jsonError);
}


exports.randomtext = function (number) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < number; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}

exports.webhookdiscord = function (req,msg,type) {
   
    switch (type) {
        case "info":
            Hook.info("Server API",`${req.url} : ${msg}`)
            break;
        case "warn":
            Hook.warn("Server API",`${req.url} : ${msg}`)
                break;
        case "error":
            Hook.err("Server API",`${req.url} : ${msg}`)
            break;
        case "success":
            Hook.success("Server API",`${req.url} : ${msg}`)
            break;
        default:
            break;
    }
}
exports.webhooklogfile = function (length,time) {
    const message = new webhook.MessageBuilder()
                .setName("Server API")
                .setColor("#2ecc71")
                .setText("Generate logfile success!!")
                .addField("Logfile", `${length} files`)
                .addField("Time", time)
                .setTime();
 
    Hook.send(message);
}



