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
import * as math from 'mathjs'
import * as d3 from "d3";


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
    var JsonTime = [[],[],[],[],[],[]] 
    result.forEach(element => {
      let Time = new Date(element.Time)
      Time = Time.getUTCHours()
      if(Time >= 0 && Time <=4){
        JsonTime[0].push(element)
      }else if(Time > 4 && Time <=8){
        JsonTime[1].push(element)
      }else if(Time > 8 && Time <=12){
        JsonTime[2].push(element)
      }else if(Time > 12 && Time <=16){
        JsonTime[3].push(element)
      }else if(Time > 16 && Time <=20){
        JsonTime[4].push(element)
      }else if(Time > 20 && Time <=23){
        JsonTime[5].push(element)
      }
      
    });
    
    var jsonResult = {Info:{Length:result.length,Filename:req.file.originalname,UploadDate:Date(),Day:diff_hours(_.maxBy(result, 'Time').Time, _.minBy(result, 'Time').Time)/24,Hours:diff_hours(_.maxBy(result, 'Time').Time, _.minBy(result, 'Time').Time)},Time:{ENDDATE:_.maxBy(result, 'Time').Time,STARTDATE:_.minBy(result, 'Time').Time},	
    CPU_USAGE:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'CPU_USAGE').CPU_USAGE,min:_.minBy(JsonTime[0], 'CPU_USAGE').CPU_USAGE,avg:_.meanBy(JsonTime[0], 'CPU_USAGE')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'CPU_USAGE').CPU_USAGE,min:_.minBy(JsonTime[1], 'CPU_USAGE').CPU_USAGE,avg:_.meanBy(JsonTime[1], 'CPU_USAGE')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'CPU_USAGE').CPU_USAGE,min:_.minBy(JsonTime[2], 'CPU_USAGE').CPU_USAGE,avg:_.meanBy(JsonTime[2], 'CPU_USAGE')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'CPU_USAGE').CPU_USAGE,min:_.minBy(JsonTime[3], 'CPU_USAGE').CPU_USAGE,avg:_.meanBy(JsonTime[3], 'CPU_USAGE')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'CPU_USAGE').CPU_USAGE,min:_.minBy(JsonTime[4], 'CPU_USAGE').CPU_USAGE,avg:_.meanBy(JsonTime[4], 'CPU_USAGE')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'CPU_USAGE').CPU_USAGE,min:_.minBy(JsonTime[5], 'CPU_USAGE').CPU_USAGE,avg:_.meanBy(JsonTime[5], 'CPU_USAGE')}],	
    MEMORY_USAGE:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'MEMORY_USAGE').MEMORY_USAGE,min:_.minBy(JsonTime[0], 'MEMORY_USAGE').MEMORY_USAGE,avg:_.meanBy(JsonTime[0], 'MEMORY_USAGE')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'MEMORY_USAGE').MEMORY_USAGE,min:_.minBy(JsonTime[1], 'MEMORY_USAGE').MEMORY_USAGE,avg:_.meanBy(JsonTime[1], 'MEMORY_USAGE')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'MEMORY_USAGE').MEMORY_USAGE,min:_.minBy(JsonTime[2], 'MEMORY_USAGE').MEMORY_USAGE,avg:_.meanBy(JsonTime[2], 'MEMORY_USAGE')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'MEMORY_USAGE').MEMORY_USAGE,min:_.minBy(JsonTime[3], 'MEMORY_USAGE').MEMORY_USAGE,avg:_.meanBy(JsonTime[3], 'MEMORY_USAGE')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'MEMORY_USAGE').MEMORY_USAGE,min:_.minBy(JsonTime[4], 'MEMORY_USAGE').MEMORY_USAGE,avg:_.meanBy(JsonTime[4], 'MEMORY_USAGE')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'MEMORY_USAGE').MEMORY_USAGE,min:_.minBy(JsonTime[5], 'MEMORY_USAGE').MEMORY_USAGE,avg:_.meanBy(JsonTime[5], 'MEMORY_USAGE')}],
    Disk_write:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'Disk_write').Disk_write,min:_.minBy(JsonTime[0], 'Disk_write').Disk_write,avg:_.meanBy(JsonTime[0], 'Disk_write')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'Disk_write').Disk_write,min:_.minBy(JsonTime[1], 'Disk_write').Disk_write,avg:_.meanBy(JsonTime[1], 'Disk_write')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'Disk_write').Disk_write,min:_.minBy(JsonTime[2], 'Disk_write').Disk_write,avg:_.meanBy(JsonTime[2], 'Disk_write')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'Disk_write').Disk_write,min:_.minBy(JsonTime[3], 'Disk_write').Disk_write,avg:_.meanBy(JsonTime[3], 'Disk_write')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'Disk_write').Disk_write,min:_.minBy(JsonTime[4], 'Disk_write').Disk_write,avg:_.meanBy(JsonTime[4], 'Disk_write')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'Disk_write').Disk_write,min:_.minBy(JsonTime[5], 'Disk_write').Disk_write,avg:_.meanBy(JsonTime[5], 'Disk_write')}],	
    Disk_read:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'Disk_read').Disk_read,min:_.minBy(JsonTime[0], 'Disk_read').Disk_read,avg:_.meanBy(JsonTime[0], 'Disk_read')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'Disk_read').Disk_read,min:_.minBy(JsonTime[1], 'Disk_read').Disk_read,avg:_.meanBy(JsonTime[1], 'Disk_read')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'Disk_read').Disk_read,min:_.minBy(JsonTime[2], 'Disk_read').Disk_read,avg:_.meanBy(JsonTime[2], 'Disk_read')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'Disk_read').Disk_read,min:_.minBy(JsonTime[3], 'Disk_read').Disk_read,avg:_.meanBy(JsonTime[3], 'Disk_read')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'Disk_read').Disk_read,min:_.minBy(JsonTime[4], 'Disk_read').Disk_read,avg:_.meanBy(JsonTime[4], 'Disk_read')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'Disk_read').Disk_read,min:_.minBy(JsonTime[5], 'Disk_read').Disk_read,avg:_.meanBy(JsonTime[5], 'Disk_read')}],	
    TX_total:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'TX_total').TX_total,min:_.minBy(JsonTime[0], 'TX_total').TX_total,avg:_.meanBy(JsonTime[0], 'TX_total')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'TX_total').TX_total,min:_.minBy(JsonTime[1], 'TX_total').TX_total,avg:_.meanBy(JsonTime[1], 'TX_total')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'TX_total').TX_total,min:_.minBy(JsonTime[2], 'TX_total').TX_total,avg:_.meanBy(JsonTime[2], 'TX_total')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'TX_total').TX_total,min:_.minBy(JsonTime[3], 'TX_total').TX_total,avg:_.meanBy(JsonTime[3], 'TX_total')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'TX_total').TX_total,min:_.minBy(JsonTime[4], 'TX_total').TX_total,avg:_.meanBy(JsonTime[4], 'TX_total')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'TX_total').TX_total,min:_.minBy(JsonTime[5], 'TX_total').TX_total,avg:_.meanBy(JsonTime[5], 'TX_total')}],
    TX_total_1:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'TX_total_1').TX_total_1,min:_.minBy(JsonTime[0], 'TX_total_1').TX_total_1,avg:_.meanBy(JsonTime[0], 'TX_total_1')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'TX_total_1').TX_total_1,min:_.minBy(JsonTime[1], 'TX_total_1').TX_total_1,avg:_.meanBy(JsonTime[1], 'TX_total_1')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'TX_total_1').TX_total_1,min:_.minBy(JsonTime[2], 'TX_total_1').TX_total_1,avg:_.meanBy(JsonTime[2], 'TX_total_1')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'TX_total_1').TX_total_1,min:_.minBy(JsonTime[3], 'TX_total_1').TX_total_1,avg:_.meanBy(JsonTime[3], 'TX_total_1')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'TX_total_1').TX_total_1,min:_.minBy(JsonTime[4], 'TX_total_1').TX_total_1,avg:_.meanBy(JsonTime[4], 'TX_total_1')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'TX_total_1').TX_total_1,min:_.minBy(JsonTime[5], 'TX_total_1').TX_total_1,avg:_.meanBy(JsonTime[5], 'TX_total_1')}],
    TX_error:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'TX_error').TX_error,min:_.minBy(JsonTime[0], 'TX_error').TX_error,avg:_.meanBy(JsonTime[0], 'TX_error')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'TX_error').TX_error,min:_.minBy(JsonTime[1], 'TX_error').TX_error,avg:_.meanBy(JsonTime[1], 'TX_error')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'TX_error').TX_error,min:_.minBy(JsonTime[2], 'TX_error').TX_error,avg:_.meanBy(JsonTime[2], 'TX_error')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'TX_error').TX_error,min:_.minBy(JsonTime[3], 'TX_error').TX_error,avg:_.meanBy(JsonTime[3], 'TX_error')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'TX_error').TX_error,min:_.minBy(JsonTime[4], 'TX_error').TX_error,avg:_.meanBy(JsonTime[4], 'TX_error')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'TX_error').TX_error,min:_.minBy(JsonTime[5], 'TX_error').TX_error,avg:_.meanBy(JsonTime[5], 'TX_error')}],
    TX_error_1:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'TX_error_1').TX_error_1,min:_.minBy(JsonTime[0], 'TX_error_1').TX_error_1,avg:_.meanBy(JsonTime[0], 'TX_error_1')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'TX_error_1').TX_error_1,min:_.minBy(JsonTime[1], 'TX_error_1').TX_error_1,avg:_.meanBy(JsonTime[1], 'TX_error_1')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'TX_error_1').TX_error_1,min:_.minBy(JsonTime[2], 'TX_error_1').TX_error_1,avg:_.meanBy(JsonTime[2], 'TX_error_1')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'TX_error_1').TX_error_1,min:_.minBy(JsonTime[3], 'TX_error_1').TX_error_1,avg:_.meanBy(JsonTime[3], 'TX_error_1')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'TX_error_1').TX_error_1,min:_.minBy(JsonTime[4], 'TX_error_1').TX_error_1,avg:_.meanBy(JsonTime[4], 'TX_error_1')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'TX_error_1').TX_error_1,min:_.minBy(JsonTime[5], 'TX_error_1').TX_error_1,avg:_.meanBy(JsonTime[5], 'TX_error_1')}],	
    RX_total:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'RX_total').RX_total,min:_.minBy(JsonTime[0], 'RX_total').RX_total,avg:_.meanBy(JsonTime[0], 'RX_total')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'RX_total').RX_total,min:_.minBy(JsonTime[1], 'RX_total').RX_total,avg:_.meanBy(JsonTime[1], 'RX_total')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'RX_total').RX_total,min:_.minBy(JsonTime[2], 'RX_total').RX_total,avg:_.meanBy(JsonTime[2], 'RX_total')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'RX_total').RX_total,min:_.minBy(JsonTime[3], 'RX_total').RX_total,avg:_.meanBy(JsonTime[3], 'RX_total')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'RX_total').RX_total,min:_.minBy(JsonTime[4], 'RX_total').RX_total,avg:_.meanBy(JsonTime[4], 'RX_total')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'RX_total').RX_total,min:_.minBy(JsonTime[5], 'RX_total').RX_total,avg:_.meanBy(JsonTime[5], 'RX_total')}],
    RX_total_1:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'RX_total_1').RX_total_1,min:_.minBy(JsonTime[0], 'RX_total_1').RX_total_1,avg:_.meanBy(JsonTime[0], 'RX_total_1')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'RX_total_1').RX_total_1,min:_.minBy(JsonTime[1], 'RX_total_1').RX_total_1,avg:_.meanBy(JsonTime[1], 'RX_total_1')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'RX_total_1').RX_total_1,min:_.minBy(JsonTime[2], 'RX_total_1').RX_total_1,avg:_.meanBy(JsonTime[2], 'RX_total_1')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'RX_total_1').RX_total_1,min:_.minBy(JsonTime[3], 'RX_total_1').RX_total_1,avg:_.meanBy(JsonTime[3], 'RX_total_1')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'RX_total_1').RX_total_1,min:_.minBy(JsonTime[4], 'RX_total_1').RX_total_1,avg:_.meanBy(JsonTime[4], 'RX_total_1')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'RX_total_1').RX_total_1,min:_.minBy(JsonTime[5], 'RX_total_1').RX_total_1,avg:_.meanBy(JsonTime[5], 'RX_total_1')}],
    RX_error:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'RX_error').RX_error,min:_.minBy(JsonTime[0], 'RX_error').RX_error,avg:_.meanBy(JsonTime[0], 'RX_error')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'RX_error').RX_error,min:_.minBy(JsonTime[1], 'RX_error').RX_error,avg:_.meanBy(JsonTime[1], 'RX_error')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'RX_error').RX_error,min:_.minBy(JsonTime[2], 'RX_error').RX_error,avg:_.meanBy(JsonTime[2], 'RX_error')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'RX_error').RX_error,min:_.minBy(JsonTime[3], 'RX_error').RX_error,avg:_.meanBy(JsonTime[3], 'RX_error')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'RX_error').RX_error,min:_.minBy(JsonTime[4], 'RX_error').RX_error,avg:_.meanBy(JsonTime[4], 'RX_error')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'RX_error').RX_error,min:_.minBy(JsonTime[5], 'RX_error').RX_error,avg:_.meanBy(JsonTime[5], 'RX_error')}],
    RX_error_1:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'RX_error_1').RX_error_1,min:_.minBy(JsonTime[0], 'RX_error_1').RX_error_1,avg:_.meanBy(JsonTime[0], 'RX_error_1')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'RX_error_1').RX_error_1,min:_.minBy(JsonTime[1], 'RX_error_1').RX_error_1,avg:_.meanBy(JsonTime[1], 'RX_error_1')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'RX_error_1').RX_error_1,min:_.minBy(JsonTime[2], 'RX_error_1').RX_error_1,avg:_.meanBy(JsonTime[2], 'RX_error_1')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'RX_error_1').RX_error_1,min:_.minBy(JsonTime[3], 'RX_error_1').RX_error_1,avg:_.meanBy(JsonTime[3], 'RX_error_1')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'RX_error_1').RX_error_1,min:_.minBy(JsonTime[4], 'RX_error_1').RX_error_1,avg:_.meanBy(JsonTime[4], 'RX_error_1')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'RX_error_1').RX_error_1,min:_.minBy(JsonTime[5], 'RX_error_1').RX_error_1,avg:_.meanBy(JsonTime[5], 'RX_error_1')}]}
  
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

 function checkTime(type, array) 
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
