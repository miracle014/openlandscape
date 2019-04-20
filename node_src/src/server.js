//require dependencies
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import xml2js from "xml2js";
import dateFormat from 'dateformat';
import _ from 'lodash';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs, { stat } from 'fs'
// import storage from 'node-persist'
import passport from 'passport'
import passportJWT from 'passport-jwt';
import multer from 'multer';

import conn from './shared/connection';
import global from './shared/global';
import * as XLSX from 'xlsx'
const app = express();
const parser = new xml2js.Parser();

const LOCALHOST = `http://reverse-proxy/`;

const TOKENSECRET = `msecret@`

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = TOKENSECRET;

const saltRounds = 10;


var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  next(null, jwt_payload);
});


var authorizeWithRoles = (roles) => {
  return (req, res, next) => {
    if (roles.length == 0)
      next()
    else if (roles.includes(req.user.role))
      next()
    else
      global.HTTPSTATUS(res,403)
  }
}

passport.use(strategy);
app.use(passport.initialize());
// app.use(passport.authenticate('jwt', { session: false }))

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization,password');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
}); 


app.get('/', (req, res, ) => {
  res.json({'status':'open'}).end();
});

app.get('/error/:id', (req, res, ) => {
  global.HTTPSTATUS(res,req.params.id,null)
});


var upload = multer({ dest: 'uploads/' })

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/asset/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

var upload = multer({ storage: storage })
app.post('/uploads',upload.single('files'), (req, res, ) => {
  try {
    const workbook = XLSX.readFile(req.file.path, {cellDates:true, cellNF: false, cellText:false})
    const sheet_name_list = workbook.SheetNames;
    // console.log(XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1));
    

    var result = XLSX.utils.sheet_to_row_object_array(workbook.Sheets.Sheet1,{'date_format':'dd/mm/yyyy'})
    result.shift()

    var s = JSON.stringify(result);
    var t = s.replace(/"sep="/g, '"Time"');
    t = t.replace(/"__EMPTY"/g, '"CPU_USAGE"');
    t = t.replace(/"__EMPTY_1"/g, '"MEMORY_USAGE"');
    t = t.replace(/"__EMPTY_2"/g, '"Disk_write"');
    t = t.replace(/"__EMPTY_3"/g, '"Disk_read"');
    t = t.replace(/"__EMPTY_4"/g, '"TX_total"');
    t = t.replace(/"__EMPTY_5"/g, '"TX_total_1"');
    t = t.replace(/"__EMPTY_6"/g, '"TX_error"');
    t = t.replace(/"__EMPTY_7"/g, '"TX_error_1"');
    t = t.replace(/"__EMPTY_8"/g, '"RX_total"');
    t = t.replace(/"__EMPTY_9"/g, '"RX_total_1"');
    t = t.replace(/"__EMPTY_10"/g, '"RX_error"');
    t = t.replace(/"__EMPTY_11"/g, '"RX_error_1"');

    var result = JSON.parse(t);
    
    var jsonResult = {Info:{Length:result.length,Filename:req.file.originalname,UploadDate:Date(),Day:diff_hours(_.maxBy(result, 'Time').Time, _.minBy(result, 'Time').Time)/24,Hours:diff_hours(_.maxBy(result, 'Time').Time, _.minBy(result, 'Time').Time)},Time:{max:_.maxBy(result, 'Time').Time,min:_.minBy(result, 'Time').Time},	
    CPU_USAGE:{max:_.maxBy(result, 'CPU_USAGE').CPU_USAGE,min:_.minBy(result, 'CPU_USAGE').CPU_USAGE,avg:_.meanBy(result, 'CPU_USAGE')},	
    MEMORY_USAGE:{max:_.maxBy(result, 'MEMORY_USAGE').MEMORY_USAGE,min:_.minBy(result, 'MEMORY_USAGE').MEMORY_USAGE,avg:_.meanBy(result, 'MEMORY_USAGE')},	
    Disk_write:{max:_.maxBy(result, 'Disk_write').Disk_write,min:_.minBy(result, 'Disk_write').Disk_write,avg:_.meanBy(result, 'Disk_write')},	
    Disk_read:{max:_.maxBy(result, 'Disk_read').Disk_read,min:_.minBy(result, 'Disk_read').Disk_read,avg:_.meanBy(result, 'Disk_read')},	
    TX_total:{max:_.maxBy(result, 'TX_total').TX_total,min:_.minBy(result, 'TX_total').TX_total,avg:_.meanBy(result, 'TX_total')},	
    TX_total_1:{max:_.maxBy(result, 'TX_total_1').TX_total_1,min:_.minBy(result, 'TX_total_1').TX_total_1,avg:_.meanBy(result, 'TX_total_1')},	
    TX_error:{max:_.maxBy(result, 'TX_error').TX_error,min:_.minBy(result, 'TX_error').TX_error,avg:_.meanBy(result, 'TX_error')},	
    TX_error_1:{max:_.maxBy(result, 'TX_error_1').TX_error_1,min:_.minBy(result, 'TX_error_1').TX_error_1,avg:_.meanBy(result, 'TX_error_1')},	
    RX_total:{max:_.maxBy(result, 'RX_total').RX_total,min:_.minBy(result, 'RX_total').RX_total,avg:_.meanBy(result, 'RX_total')},	
    RX_total_1:{max:_.maxBy(result, 'RX_total_1').RX_total_1,min:_.minBy(result, 'RX_total_1').RX_total_1,avg:_.meanBy(result, 'RX_total_1')},	
    RX_error:{max:_.maxBy(result, 'RX_error').RX_error,min:_.minBy(result, 'RX_error').RX_error,avg:_.meanBy(result, 'RX_error')},	
    RX_error_1:{max:_.maxBy(result, 'RX_error_1').RX_error_1,min:_.minBy(result, 'RX_error_1').RX_error_1,avg:_.meanBy(result, 'RX_error_1')}}
  
    global.HTTPSTATUS(res,200,null,jsonResult)
  } catch (error) {
    global.HTTPSTATUS(res,404,null,'Please , upload file xlsx only!!')
  }
  
});

function diff_hours(dt2, dt1) 
 {
  dt2 = new Date(dt2)
  dt1 = new Date(dt1)
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60);
  return Math.abs(Math.round(diff));
  
 }

app.post('/auth/token/gen', async (req, res) => {
  var {  password } = req.body
  var userInfo
  var payload
  
    try {
      userInfo = await conn.query("SELECT * FROM CONFIG_SETTING WHERE NAME = 'TOKENCODE'")
    } catch (err) {
      global.HTTPSTATUS(res,500,null,{ 'error': err.code, message: err.sqlMessage })
    }
    // found check password
    if (userInfo.length === 1) {
      if (!bcrypt.compareSync(password + '', userInfo[0].VALUE)) return global.HTTPSTATUS(res,401)
      payload = {
        id: 'userAdminInfo[0].ID',
        username: 'userAdminInfo[0].USERNAME',
        role: 'appAdmin'
      }
      var ip = (req.headers['x-forwarded-for'] || '').split(',').pop() || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         req.connection.socket.remoteAddress
      let text  = 'API : GEN TOKEN SUCCESS By ip : '+ip
      global.messageLine(text)
  } else {
    global.HTTPSTATUS(res,403)
  }
  
  

  // not found in all api unauthenticated
  if (!payload) {
    global.HTTPSTATUS(res,401)
  }

  var token = jwt.sign(payload, jwtOptions.secretOrKey);
  var resData = {
    message: 'Authenticated',
    payload: {
      ...payload,
      token: token
    }
  }
  global.HTTPSTATUS(res,200,null,resData)
})

app.post('/auth/token/gen/login', async (req, res) => {
  var { username, password } = req.body
  var userInfo
  var payload
  
    try {
      let sqlString = "SELECT * FROM M_USER WHERE USERNAME = ?";
     userInfo = await conn.query(sqlString, [username]);
    } catch (err) {
      return res.status(500).json({ 'error': err.code, message: err.sqlMessage });
    }
    // found check password
    if (userInfo.length === 1) {
      if (!bcrypt.compareSync(password + '', userInfo[0].PASSWORD)) global.HTTPSTATUS(res,401)
      payload = {
        id: userInfo[0].ID,
        username: userInfo[0].USERNAME,
        active: userInfo[0].ACTIVE_KEY,
        money:userInfo[0].MONEY,
        status:userInfo[0].STATUS
      }
  } else {
    global.HTTPSTATUS(res,403)
  }
  
  

  // not found in all api unauthenticated
  if (!payload) {
    return global.HTTPSTATUS(res,401)
  }

  let sqlString = "SELECT * FROM M_KEY WHERE CREATE_BY = ?";
  let keyGen = await conn.query(sqlString, [username]);
   sqlString = "SELECT * FROM M_KEY_MONEY WHERE CREATE_BY = ?";
  let keyGenMoney = await conn.query(sqlString, [username]);

  var token = jwt.sign(payload, jwtOptions.secretOrKey);
  var resData = {
    message: 'Authenticated',
    payload: {
      ...payload,
      token: token
    }
  }
  global.HTTPSTATUS(res,200,null,resData)
})


http.createServer(app).listen(80, () => console.log('Server listening'));
