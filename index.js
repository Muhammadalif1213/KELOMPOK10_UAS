// Definisi Library yang digunakan
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const flash = require("req-flash");
const app = express();
const port = 3000                 
const baseUrl = "http://localhost:3000/"; // Sesuaikan dengan URL aplikasi Anda
app.locals.baseUrl = baseUrl; // Set URL base ke app locals                                                                                                                                                      


// Definisi lokasi file router
const loginRoutes = require("./src/routes/authRoutes");
const homeRoutes = require("./src/routes/homeRoutes");
const homeAdminRoutes = require("./src/routes/admin");
const homeDhewanRoutes = require("./src/routes/dokter");
const homeKeeperRoutes = require("./src/routes/keeper");

// Untuk melayani gambar dari folder 'public/images'
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: "kelompok10",
      name: "secretName",
      cookie: {
        sameSite: true,
        maxAge: false,
      },
    })
);


// Configurasi dan gunakan library
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());

app.use(function (req, res, next) {
    res.setHeader(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    res.setHeader("Pragma", "no-cache");
    next();
  });

// Setting folder views
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");


// Gunakan routes yang telah didefinisikan
app.use("/login", loginRoutes);
app.use("/",homeRoutes);
app.use("/",homeAdminRoutes);
app.use("/",homeDhewanRoutes);
app.use("/",homeKeeperRoutes)


// Middleware untuk public folder
app.use(express.static(path.join(__dirname, "public")));

console.log(app._router.stack);

app.listen(port, () => {
    console.log(`Server sedang berjalan di port : http://localhost:${port}`);
});