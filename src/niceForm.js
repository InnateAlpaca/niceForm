const http = require("http");
const https = require('https');
const fs = require('fs');
const { EventEmitter } = require("events");

const form_parser = {
    '5.1.5': async (requestBody)=>{
        const result = {}
        for (const field of requestBody.split('------').slice(1, -1)){
            const lines = field.split('\r\n');
            const name = lines[1].split('name=')[1].replaceAll('"', '')
            result[name] = lines[3]
        }
        return result;
    }
}

const default_options = {
    hostname: '0.0.0.0',
    cert_folder: './ssl',
    http: true,
    https: true,
    http_port: 80,
    https_port: 443,
    version: '5.1.5'
}
class niceForm extends EventEmitter{
    constructor(options=default_options){
        super()
        this.http_port = (options.http_port) ? options.http_port :  default_options.http_port;
        this.https_port = (options.https_port) ? options.https_port :  default_options.https_port;
        this.hostname = (options.hostname) ? options.hostname: default_options.hostname;
        this.cert_folder = (options.cert_folder) ? options.cert_folder: default_options.cert_folder;
        this.version = (options.version) ? options.version: default_options.version;
        this.#http_enabled = ('http' in options) ? options.http: default_options.http;
        this.#https_enabled = ('https' in options) ? options.https: default_options.https;

        if (this.#http_enabled){
            this.#setup_http();
        }
        if (this.#https_enabled){
            this.#setup_https();
        }
    }
    #setup_https(){
        try {
            const https_options = {
                key: fs.readFileSync(this.cert_folder+'/key.pem'),
                cert: fs.readFileSync(this.cert_folder+'/cert.pem'),
                hostname: this.hostname
            };
            this.#https = https.createServer(https_options, async (req, res)=>{
                var requestBody = '';
                req.on('data', (data)=>{
                    requestBody += data;        
                });
                req.on('end', async ()=>{
                    if(requestBody.length > 1e7) {
                        res.writeHead(413, 'Request Entity Too Large', {'Content-Type': 'text/html'});
                        res.end();
                    }
                    const form = await form_parser[this.version](requestBody).catch(err=>{
                        res.writeHead(501);
                        res.end();
                        this.emit('error', 'error while parsing form data')
                    });
                    const action = new Promise((acc, rej)=>{
                        this.emit(req.url, form, acc, rej)
                    })
                    action.then(()=>{
                        res.writeHead(200, 'ok', {"Access-Control-Allow-Origin": '*'});
                        res.end('{"success": true}');
                    }, ()=>{
                        res.writeHead(400);
                        res.end('{"success": false}');
                    })                
                });
            });
            this.#https.on('error', err=>this.emit('https_error', err));
            this.#https.on('clientError', err=>this.emit('https_clientError', err));
        }
        catch(err){
            this.emit('error', err)
        }
    }
    #setup_http(){
        try {
            this.#http = http.createServer(async (req, res)=>{
                var requestBody = '';
                req.on('data', (data)=>{
                    requestBody += data;        
                });
                req.on('end', async ()=>{
                    if(requestBody.length > 1e7) {
                        res.writeHead(413, 'Request Entity Too Large', {'Content-Type': 'text/html'});
                        res.end();
                    }
                    const form = await form_parser[this.version](requestBody).catch(err=>{
                        res.writeHead(501);
                        res.end();
                        this.emit('error', 'error while parsing form data')
                    });
                    const action = new Promise((acc, rej)=>{
                        this.emit(req.url, form, acc, rej)
                    })
                    action.then(()=>{
                        res.writeHead(200, 'ok', {"Access-Control-Allow-Origin": '*'});
                        res.end('{"success": true}');
                    }, ()=>{
                        res.writeHead(400);
                        res.end('{"success": false}');
                    })               
                });
            });
            this.#http.on('error', err=>this.emit('http_error', err));
            this.#http.on('clientError', err=>this.emit('http_clientError', err));
        }
        catch(err){
            this.emit('error', err)
        }
    }
    listen(){
        if (this.#http_enabled){
            this.#http.listen(this.http_port, this.hostname);
        }
        if (this.#https_enabled)
            this.#https.listen(this.https_port);
    }

    #https
    #https_enabled
    #http
    #http_enabled
}

const a = new niceForm({
    http_port:71,
    https_port:70
});

module.exports = {niceForm};