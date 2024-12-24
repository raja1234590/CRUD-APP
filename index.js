const express = require('express');
const mysql = require('mysql2');
var bodyParser = require('body-parser');
const app = express();
const port = 1234;
const path = require('path');
const { resourceLimits } = require('worker_threads');
app.set('views', path.join(__dirname, 'views'));


app.set('view engine','ejs');

app.use(express.static('public'));
app.use(express.static('views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.redirect('/create.html');
});
//read data
app.get("/data",(req,res)=>{
  con.query("SELECT * FROM registerform ",(err,rows)=>{
    if (err) {
      console.log(err);
      res.status(500).send('Error inserting data into the database');
    } else {
      res.render("read",{rows});
    }

  });

});
//delete data
app.get("/delete-data",(req,res)=>{
  con.query("DELETE FROM `registerform` WHERE id=?",[req.query.id],(err,rows)=>{
    if (err) {
      console.log(err);
      res.status(500).send('Error inserting data into the database');
    } else {
      res.redirect("/data");
     
    }
  });
});
//edit data
app.get("/edit-data",(req,res)=>{
  con.query("SELECT * FROM registerform where id=? ",[req.query.id],(err,eachROW)=>{
    if (err) {
      console.log(err);
      res.status(500).send('Error inserting data into the database');
    } else {
      var result=JSON.parse(JSON.stringify(eachROW[0]));
      res.render("edit.ejs",{result});
    }

  });
});
  //final-update
  app.post("/final-update",(req,res)=>{
    const name = req.body.uname;
  
    const email = req.body.uemail;
    
    const job = req.body.ujob;
    const id = req.body.uid;
  
    //console.log(req.body);
  
    try {
      con.query("UPDATE registerform SET name=?, email = ?, job=?  WHERE id=?",
        [name, email, job,id],
        (err, rows) => {
          if (err) {
            console.log(err);
            res.status(500).send('Error inserting data into the database');
          } else {
            //res.send(rows);
            res.redirect("/data");
          }
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal server error');
    }
  });
  


 


// Database connections
var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'wordpress',
  port: 3307
});

con.connect((err) => {
  if (err) {
    console.error('Error connecting:', err);
    return;
  }
  console.log('Connected to the database');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
//inserting data

app.post('/create', (req, res) => {
  const name = req.body.uname;
  
  const email = req.body.uemail;
  
  const job = req.body.ujob;

  console.log(req.body);

  try {
    con.query(
      'INSERT INTO `registerform`(`name`, `email`, `job`) VALUES (?, ?, ?)',
      [name, email, job],
      (err, rows) => {
        if (err) {
          console.log(err);
          res.status(500).send('Error inserting data into the database');
        } else {
          //res.send(rows);
          res.redirect("/data");
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error');
  }
});
