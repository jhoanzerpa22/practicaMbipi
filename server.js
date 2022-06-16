const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();

// var corsOptions = {
  // Admin
  // origin: "http://localhost:4222",
  // Landing
  // origin: "http://localhost:4200"
// };

// app.use(cors(corsOptions));
app.use(cors({ origin: true, credentials: true, methods: 'GET,POST,PUT,DELETE,OPTIONS' }));

// parse requests of content-type - application/json
//app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
//app.use(express.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json({limit: '50mb'}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '50mb' ,extended: true }));

// simple route
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to bezkoder application." });
// });

// envia email route articulador
app.post("/api/sendmail-articulador", (req, res) => {
  console.log("request came");
  let user = req.body;
  sendMailArticulador(user, info => {
    console.log(`The mail has beed send and the id is ${info.messageId}`);
    res.send(info);
  });

});

app.post("/api/sendmailInterna", (req, res) => {
  let user = req.body;
  sendMailInterna(user, info => {
    console.log(`The mail has beed send and the id is ${info.messageId}`);
    res.send(info);
  });
});

// Carpeta Static y Views
//app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname, '/static'));
//app.use(express.static(path.join(__dirname, '/static')));

app.use('/', express.static(path.join(__dirname,'static/home/')));        
app.use('/admin', express.static(path.join(__dirname,'static/admin/')));
app.use('/admin/*', express.static(path.join(__dirname,'static/admin/')));

//app.use(express.static(path.join(__dirname, 'dist/the-app')));
// app.use('/calendario', express.static(path.join(__dirname,'static/home/')));
// app.use('/admin/page', express.static(path.join(__dirname,'static/admin/')));

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/usuario.routes')(app);
require('./app/routes/rol.routes')(app);
require('./app/routes/course.routes')(app);
require('./app/routes/lesson.routes')(app);

app.all('/api/*', (req, res) => {
  res.status(404).json({code:404, msg: 'Ruta API no reconocida.'});
});

app.use('/*', express.static(path.join(__dirname,'static/home/'))); 

// RUTA FRONT (POR SI SE HACE SEPARADO O SE USA ANGULAR)
// app.all('/admin', (req, res) => {
//   res.render('admin/index');
// });


// RUTA ADMIN (POR SI SE HACE SEPARADO O SE USA ANGULAR)
app.all('*', (req, res) => {
  res.status(404).json({msg: 'Recurso no encontrado.'});
  //res.render('landing/index');
});

// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const db = require("./app/models");
// const path = require("path/posix");
const Role = db.role;
const User = db.user;
const Usuario = db.usuario;

db.sequelize.sync().then(() => {
  console.log("Seeder db.");
  initial();
});
/*db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
  initial();
});
*/
function initial() {

  User.findOne({
    where: {
      correo_login: "hughes.brian@company.com"
    }
  }).then(user_valid => {
      if (!user_valid) {

		  Role.create({
		    id: 1,
		    nombre: "Administrador",
		    createdAt: "2021-11-02 00:00:00",
		    updatedAt: "2021-11-02 00:00:00"
		  });

		  Role.create({
		    id: 2,
		    nombre: "Usuario",
		    createdAt: "2021-11-02 00:00:00",
		    updatedAt: "2021-11-02 00:00:00"
		  });

		  User.create({
		  	id: 1,
		  	correo_login: "hughes.brian@company.com",
		    pass_hash: bcrypt.hashSync("admin", 8),
		    pass_recovery_hash: "",
		    pass_recovery_time: null,
		    tipo_rol: "Administrador"
		  }).then(user => {
					user.setRoles([1]);
		  });

		  Usuario.create({
		  	id: 1,
		  	nombre: "Admin",
		    rut: "12345678-5",
		    fono: "+573213354666",
		    correo: "hughes.brian@company.com",
		    //direccion: "Santiago de Chile",
		    login_id: 1
		  });

		}
    });
    }

async function sendMailArticulador(user, callback) {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "innovago.tresidea.cl",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'innovago@innovago.tresidea.cl',
      pass: 'Innovago123'
    }
  });

  let mailOptions = {
    from: 'innovago@innovago.tresidea.cl', // sender address
    to: user.email, // list of receivers user.email
    subject: "Contacto Innovago", // Subject line
    html:
    `<div class="border" style="width: 600px; height: 300px; border-top-color: rgb(0,188,212); border-color: black;">
    <div class="border" style="width: 600px; height: 10px; background-color: rgb(0,188,212);border-color: rgb(0,188,212);">
    </div>
    <div class="border" style="width: 600px; height: 70px; background-color: #F6F6F6; border-color: #F6F6F6; font-family: 'Raleway', sans-serif;" >
        <h1 style="text-align: center; padding-top: 12px;">AntofaInnova<span style="font-weight: bold; color: #23909F;">.</span></h1>
    </div>
    <div class="container">
      <h3 style="text-align: center; padding-top: 20px;">¡Gracias por usar nuestro canal `+user.nombre+` `+user.apellidos+`!</h3>
    </div>
    <div class="container">
      <h4 style="text-align: center; padding-top: 20px;">Tu mensaje ha sido enviado y será atendido a la brevedad por el articulador seleccionado.</h4>
      <h4 style="text-align: center; padding-top: 20px;">Mensaje: `+ user.mensaje +`</h4>
    </div>
  </div>
    `
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  callback(info);


}

async function sendMailInterna(user, callback) {

	Contacto.create({
		  	nombre: "Innovago",
		    apellidos: "Contacto",
		    email: user.email,
		    mensaje: user.mensaje,
		    tipo: "Sent",
		    fecha: user.fecha
		  });

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "innovago.tresidea.cl",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'innovago@innovago.tresidea.cl',
      pass: 'Innovago123'
    }
  });

  let mailOptions = {
    from: 'innovago@innovago.tresidea.cl', // sender address
    to: user.email, // list of receivers user.email
    subject: user.subject, // Subject line
    html: user.mensaje
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  callback(info);


}
