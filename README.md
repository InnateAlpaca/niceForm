# niceForm
Easily receive and parse forms from a  website created with [Nicepage](https://nicepage.com/). Thank to this repository you can now easily setup your forms so to send data directly to your server or pc, without constraints. And manage approval/denial instalty. All easily managable by listening to some events.

## Usage
Using the repository is very easy. With the "standard" setup you just create a niceForm object and listen to the address where your website will be sending the form (or the forms). You will receive a JSON object which you can handle as you wish: store it on disk, send it by email, use it inside your application...
You can easily accept or reject the submission by calling the function `accept` or `reject`.
Check the [documentation](https://github.com/InnateAlpaca/niceForm/blob/main/documentation.md) for more information.
```
const { niceForm } = require('./niceForm');

const form_server = new niceForm();
form_server.listen();

form_server.on('/info/submissions', (form_object, accept, deny)=>{

    console.log(form_object);  // visualising the form
    
    if (form_object.email.includes('@gmail.com')){
        accept(); // we are only accepting gmail emails
    }
    else{
        deny(); // the deny-message will now be displayed on client's page
    }    
})
```
