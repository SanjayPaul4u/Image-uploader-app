const express  = require('express');
const app = express();
const path = require('path')
const port = process.env.PORT || 5000
const hbs = require('hbs');
// mongodb connection 
require('./server/database/database')();

const partials_path = path.join(__dirname, "./views_folder/partials")

app.use(express.json());
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "./views_folder"));
hbs.registerPartials(partials_path)

// serving static file
app.use(express.static(path.join(__dirname, "./public")));

// route calling
app.use('/', require('./server/router/router.js'))


app.listen(port, ()=>{
    console.log(`http://localhost:${port}`);
})