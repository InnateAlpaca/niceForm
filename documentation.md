# Documentation

## methods
### constructor(options[)
You can customise the niceForm webserver according to your needs (if you don't add an option default value will be used):
* hostname: domain where forms are being sent (whose address is the very server/pc where niceForm is being hosted). Default value is `0.0.0.0` (which means that all requests made to this server will be considered).
* cert_folder: if you are using an https website you need to add a ssl certificate (cert.pem and key.pem). Default folder is `./ssl`.
* http: `true` or `false`. Use true if you want the a http server receiver (typically you will need it if you are hosting a http website).
* https: `true` or `false`. Use true if you want the a https server receiver (typically you will need it if you are hosting a http website).
* http_port: port where you will be receiving forms. Default is `80`. If you are not using port 80 you will need t specify it in the form url (e.g. `url=http://mywebsite.com:60/submissions`)
* https_port: default `443`.
* version: supported version (only '5.1.5' for now)
#### example
```
const { niceForm } = require('./niceForm');

const options = {
    hostname: 'submissions.mywebsite.com',
    http: true,
    https: false // we don't need https server, since our website is http only
}
const form_server = new niceForm(options);
form_server.listen();
```
Note that we have used a subdomain in this example. 
If you can handle domain records and your website is not hosted on the same server where you will send forms it's a good idea to make a subdomain which will redirect forms to this machine (where the niceForm is hosted).
Also some browsers don't allow "cross-origin" requests so using a subdomain will avoid this issue. This is the best practice if you are not hosting the website on the same machhine as the niceForm server.

## events
Everytime a niceForm receives a form-request it will emit an event with the name of the webpage (with `/` before). You can listen to any webpage url where your form will be sent to.
#### example
Suppose that we have created two forms on our website: *info* in order to request custom information, and *enroll* in order to subscribe to our mailing list.
We have setup the two urls as `https://forms.mywebsite.com/info`, and `https://forms.mywebsite.com/enrolling`
```
const { niceForm } = require('./src/niceForm');

const form_server = new niceForm({hostname: 'forms.mywebsite.com'});
form_server.listen();

form_server.on('/info', (form_object, accept, deny)=>{
    console.log(form_object); 
    accept();
})
form_server.on('/enrolling', (form_object, accept, deny)=>{
    console.log(form_object);
    accept();
})
```
Other events you can listen to are errors (and you should listen to them so to avoid server crash):
* error
* http_error
* http_clientError
* https_error
* https_clientError
