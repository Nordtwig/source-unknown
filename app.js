//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dbConf from "./db_config.json" assert { type: "json" };
import ejs from "ejs";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: dbConf.database,
    password: dbConf.password,
    port: dbConf.port
})

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    console.log(req.body);
    const user = await db.query({
        text: "INSERT INTO users(email, password) VALUES($1, $2)",
        values: [req.body.username, req.body.password]
    }).catch(error => {
        console.log("Query Error: " + error);
    }).finally(() => {
        console.log("Reached finally");
        res.redirect("/");
    })   
});

app.listen(port, () => {
    console.log("Server is running on port " + port);
});