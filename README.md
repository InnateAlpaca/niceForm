# niceForm
Easily receive and parse forms from a  website created with Nicepage. Thank to this repository you can now easily setup your forms so to send data directly to your server or pc, without constraints. And manage approval/denial instalty. All easily managable by listening to some events.

## example

```
const { niceForm } = require('./niceForm')
const form_server = new niceForm();
form_server.listen();

form_server.on('/info/submissions', (form_object, accept, deny)=>{
    console.log(form_object)  // visualising the form
    if (form_object.email.includes('@gmail.com')){
        accept() // we are only accepting gmail emails
    }
    else{
        deny() // the deny-message will now be displayed on client's page
    }    
})
```
