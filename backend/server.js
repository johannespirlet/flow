import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"; //vorerst auskommentiert

import "./userDetails.js";

const app = express(); 
app.use(express.json()); //automatisches konvertieren
app.use(cors()); //cors middleware erlaubt plattformuebergreifende http konversation
app.set("view engine", "ejs"); //baue ejs engine mit default views auf
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public")); 


const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

//Database mit MongoDB
const mongoUrl =
  "mongodb+srv://JP:9F55zat1g%23@users.wwngqkn.mongodb.net/?retryWrites=true&w=majority";
//verbinde mongo db, mit Urlparser
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  //logge, wenn Verbindung erfolgreich, ansonsten logge error
  .then(() => {
    console.log("Verbunden mit mongodb");
  })
  .catch((error) => console.log(error));

//halte Datenbank-User-model in Objekt fest
const User = mongoose.model("UserInfo");

//registrier anfrage vom frontend als async funktion
app.post("/register", async (req, res) => {
  //dekonstruiere anfrageobjekt
  const { fname, lname, email, password, userType } = req.body;
  //speichere verschluesseltes pw mit hash fkt von bcrypt
  const encryptedPassword = await bcrypt.hash(password, 10);
  //versuche
  try {
    //ob es den user bereits in db gibt (anhang email eintrag)
    const oldUser = await User.findOne({ email });
    //dann schicke sofort error-objekt nach vorne
    if (oldUser) {
      return res.json({ error: "User gibt es bereits" });
    }
    //ansonsten baue User mit verschluesseltem pw zusammen
    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
      userType,
    });
    //da post objekt erwartet, sende noch "ok" bzw "error" zurueck
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

//login anfrage vom frontend als async funktion weiterverarbeitet
app.post("/login-user", async (req, res) => {
  //dekonstruiere anfrage body, daraus email und pw
  const { email, password } = req.body;
  //falls guest user return status ok mit 'guest' als data
  if(email == 'guest' && res.status(201)) {
    const user = { fname: 'Guestuser', lname: '', userType: 'Guest'};
    return res.send({ status: "ok", data: JSON.stringify(user)});
  }
  //suche wieder ueber email ob user vorhanden und logge ggf objekt mit error
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User nicht gefunden" });
  }
  //bcrypts compare methode vergleicht uebergebenes pw mit entschluesseltem pw
  if (await bcrypt.compare(password, user.password)) {
    //falls pw korrekt, signiere login-token verschluesselt mit secret um
    //identitaet von user und dessen daten zu schuetzen
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      //setze ablauf auf 15 minuten
      expiresIn: "15m",
    });
    //wenn antwort ok, speichere token in data-schluessel des verpackten antwortobjekts
    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  } //ansonsten ist passwort nicht gleich und es wird in error schluessel zurueckgegeben
  res.json({ status: "error", error: "Ungueltiges Passwort" });
});

//api um userdaten auszulesen
app.post("/userData", async (req, res) => {
  //hole das token aus dem 
  const { token } = req.body;
  try {
    //if data token includes the 'Guest'- User 
    if(token.includes("Guest")) {
      return res.json({ status: "ok", data: JSON.parse(token) });
    }
    //verfiziere token mit secret, speichere userdaten = res des callback in "user"
    const user = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return "token abgelaufen";
      }
      return res;
    });
    //falls error bei verifikation des tokens, sende error status ins frontend
    if (user == "token abgelaufen") {
      return res.send({ status: "error", data: "token abgelaufen" });
    }
    //hole die useremail aus dem usertoken
    const useremail = user.email;
    //wenn es einen user mit der mail auch gibt
    User.findOne({ email: useremail })
      .then((data) => {
        //sende status ok ans frontend und daten in data-schluessel
        res.send({ status: "ok", data: data });
      })
      //catch den fehler, falls einer dabei auftritt und sende diesen
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {}
});

//starte Server auf Port 5000
app.listen(5000, () => {
  console.log("Server laeuft auf PORT 5000");
});

//passwort vergessen api
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  //probiere user anhand der email zu finden
  try {
    const oldUser = await User.findOne({ email });
    //falls nicht, sende json antwort mit status nachricht ins frontend
    if (!oldUser) {
      return res.json({ status: "User existiert nicht" });
    }
    //baue neues secret aus rnd secret und dem verschluesseltem passwort
    const secret = JWT_SECRET + oldUser.password;
    //baue token, mit email und id, signiert mit neuem secret und ablaufzeit von 10 min
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "10m",
    });
    //freischalt link fuer mail inkl user id und token
    const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;
    console.log(link);
//nodemailer erlaubt email von node.js aus zu senden
     let transporter = nodemailer.createTransport({
      //absender
      service: "gmail",
      auth: {
        user: "jpirlet32@gmail.com",
        pass: "9F55zat1g#"
      },
    });
    //empfaenger
    let mailOptions = {
      from: "jpirlet32@gmail.com",
      to: `${oldUser.email}`,
      subject: "Password Reset",  //betreff
      text: link    //nachricht
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) { }
});
//passwort-zuruecksetzen api soll link auffangen der in mail geklickt wird
//params liefern id und token, api link entsprechend mit :-notation
app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  //verfiziere ob User existiert, falls nicht sende status
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User existiert nicht" });
  }
  //ansonsten fuehre folgenden code aus
  //baue wieder das secret aus /forgot-passwort api zusammen
  const secret = JWT_SECRET + oldUser.password;
  try {
    //versuche token mit secret zu verfizieren
    const verify = jwt.verify(token, secret);
    //render index.ejs mit token email in email schluessel und status (noch)
    //nicht verifiziert. 
    res.render("index", { email: verify.email, status: "Nicht verifiziert" });
  } catch (error) {
    console.log(error);
    res.send("Token nicht verifiziert");
  }
});

//post api fuer passwort-bestaetigen fuer submit button in index.ejs
app.post("/reset-password/:id/:token", async (req, res) => {
  //id und token aus params holen
  const { id, token } = req.params;
  //passwort aus textinput daten im req body
  const { password } = req.body;
  //schaue wieder ob user mit id existiert
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User existiert nicht" });
  }
  //falls user existiert baue wieder secret, verfiziere token
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    //verschluesseltes neu eingegebenes passwort wie in /register
    const encryptedPassword = await bcrypt.hash(password, 10);
    //benutzte updateOne methode von mongodb um user mit id zu finden
    //und mit $set schluessel dessen passwort zu uberschreiben/updaten
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );
    //nachdem passwort updated, rendere wieder index mit email und 
    //verifiziertem status
    res.render("index", { email: verify.email, status: "verifiziert" });
  } catch (error) {
    //ansonsten zeige error und gib error status im objekt als response
    console.log(error);
    res.json({ status: "Oh no" });
  }
});

//get api fuer adminHome.js sammelt user aus mongo db
app.get("/getAllUser", async (req, res) => {
  try {
    //mit Hilfe von find({}) und await in allUser referenzieren
    const allUser = await User.find({});
    //und uebergebe sie in data schluessel als response
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.log(error);
  }
});
//als post api /deleteuser
app.post("/deleteUser", async (req, res) => {
  //dekonstruiere dir aus der anfrage die userid
  const { userid } = req.body;
  try {
    //falls user mit userid in _id vorhanden, loesche
    User.deleteOne({ _id: userid }, function (err, res) {});
    //und sende "geloescht" an frontend/adminHome
    res.send({ status: "ok", data: "geloescht" });
  } catch (error) {
    console.log(error);
  }
});