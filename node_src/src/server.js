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

import xl from "excel4node";

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
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,cache-control,Authorization,password');
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

app.post('/checkfile',upload.any(), (req, res, ) => {
    console.log(req.files);
    
  res.json(req.files).end();
  
});

app.post('/uploads',upload.single('file'), (req, res, ) => {
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
    console.log(error);
    
    global.HTTPSTATUS(res,404,null,'Please , upload file xlsx only!!')
  }
  
});

app.post('/uploads/download',upload.any(), (req, res, ) => {
  var jsonResult = []
  var lastfileProcess 
  try {
    req.files.forEach(function(element,i) {
      const workbook = XLSX.readFile(req.files[i].path, {cellDates:true, cellNF: false, cellText:false})
      const sheet_name_list = workbook.SheetNames;
      // console.log(XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1));
      console.log(req.files[i].originalname);
      
      lastfileProcess = req.files[i].originalname
      var result = XLSX.utils.sheet_to_row_object_array(workbook.Sheets.Sheet1,{'date_format':'dd/mm/yyyy'})
      result.shift()
  
      var s = JSON.stringify(result);
      var t = s.replace(/"sep="/g, '"Time"');
      t = t.replace(/"__EMPTY"/g, '"CPU_USAGE"');
      t = t.replace(/"__EMPTY_1"/g, '"MEMORY_USAGE"');
      t = t.replace(/"__EMPTY_2"/g, '"Disk_write"');
      t = t.replace(/"__EMPTY_3"/g, '"Disk_read"');
      t = t.replace(/"__EMPTY_4"/g, '"TX_total"');
      t = t.replace(/"__EMPTY_5"/g, '"TX_error"');
      t = t.replace(/"__EMPTY_6"/g, '"RX_total"');
      t = t.replace(/"__EMPTY_7"/g, '"RX_error"');

  
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
      
      jsonResult.push( {Info:{Length:result.length,Filename:req.files[i].originalname,UploadDate:Date(),Day:diff_hours(_.maxBy(result, 'Time').Time, _.minBy(result, 'Time').Time)/24,Hours:diff_hours(_.maxBy(result, 'Time').Time, _.minBy(result, 'Time').Time)},Time:{ENDDATE:_.maxBy(result, 'Time').Time,STARTDATE:_.minBy(result, 'Time').Time},	
      CPU_USAGE:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'CPU_USAGE').CPU_USAGE,min:_.minBy(JsonTime[0], 'CPU_USAGE').CPU_USAGE,avg:_.meanBy(JsonTime[0], 'CPU_USAGE')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'CPU_USAGE').CPU_USAGE,min:_.minBy(JsonTime[1], 'CPU_USAGE').CPU_USAGE,avg:_.meanBy(JsonTime[1], 'CPU_USAGE')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'CPU_USAGE').CPU_USAGE,min:_.minBy(JsonTime[2], 'CPU_USAGE').CPU_USAGE,avg:_.meanBy(JsonTime[2], 'CPU_USAGE')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'CPU_USAGE').CPU_USAGE,min:_.minBy(JsonTime[3], 'CPU_USAGE').CPU_USAGE,avg:_.meanBy(JsonTime[3], 'CPU_USAGE')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'CPU_USAGE').CPU_USAGE,min:_.minBy(JsonTime[4], 'CPU_USAGE').CPU_USAGE,avg:_.meanBy(JsonTime[4], 'CPU_USAGE')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'CPU_USAGE').CPU_USAGE,min:_.minBy(JsonTime[5], 'CPU_USAGE').CPU_USAGE,avg:_.meanBy(JsonTime[5], 'CPU_USAGE')}],	
      MEMORY_USAGE:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'MEMORY_USAGE').MEMORY_USAGE,min:_.minBy(JsonTime[0], 'MEMORY_USAGE').MEMORY_USAGE,avg:_.meanBy(JsonTime[0], 'MEMORY_USAGE')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'MEMORY_USAGE').MEMORY_USAGE,min:_.minBy(JsonTime[1], 'MEMORY_USAGE').MEMORY_USAGE,avg:_.meanBy(JsonTime[1], 'MEMORY_USAGE')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'MEMORY_USAGE').MEMORY_USAGE,min:_.minBy(JsonTime[2], 'MEMORY_USAGE').MEMORY_USAGE,avg:_.meanBy(JsonTime[2], 'MEMORY_USAGE')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'MEMORY_USAGE').MEMORY_USAGE,min:_.minBy(JsonTime[3], 'MEMORY_USAGE').MEMORY_USAGE,avg:_.meanBy(JsonTime[3], 'MEMORY_USAGE')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'MEMORY_USAGE').MEMORY_USAGE,min:_.minBy(JsonTime[4], 'MEMORY_USAGE').MEMORY_USAGE,avg:_.meanBy(JsonTime[4], 'MEMORY_USAGE')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'MEMORY_USAGE').MEMORY_USAGE,min:_.minBy(JsonTime[5], 'MEMORY_USAGE').MEMORY_USAGE,avg:_.meanBy(JsonTime[5], 'MEMORY_USAGE')}],
      Disk_write:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'Disk_write').Disk_write,min:_.minBy(JsonTime[0], 'Disk_write').Disk_write,avg:_.meanBy(JsonTime[0], 'Disk_write')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'Disk_write').Disk_write,min:_.minBy(JsonTime[1], 'Disk_write').Disk_write,avg:_.meanBy(JsonTime[1], 'Disk_write')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'Disk_write').Disk_write,min:_.minBy(JsonTime[2], 'Disk_write').Disk_write,avg:_.meanBy(JsonTime[2], 'Disk_write')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'Disk_write').Disk_write,min:_.minBy(JsonTime[3], 'Disk_write').Disk_write,avg:_.meanBy(JsonTime[3], 'Disk_write')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'Disk_write').Disk_write,min:_.minBy(JsonTime[4], 'Disk_write').Disk_write,avg:_.meanBy(JsonTime[4], 'Disk_write')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'Disk_write').Disk_write,min:_.minBy(JsonTime[5], 'Disk_write').Disk_write,avg:_.meanBy(JsonTime[5], 'Disk_write')}],	
      Disk_read:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'Disk_read').Disk_read,min:_.minBy(JsonTime[0], 'Disk_read').Disk_read,avg:_.meanBy(JsonTime[0], 'Disk_read')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'Disk_read').Disk_read,min:_.minBy(JsonTime[1], 'Disk_read').Disk_read,avg:_.meanBy(JsonTime[1], 'Disk_read')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'Disk_read').Disk_read,min:_.minBy(JsonTime[2], 'Disk_read').Disk_read,avg:_.meanBy(JsonTime[2], 'Disk_read')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'Disk_read').Disk_read,min:_.minBy(JsonTime[3], 'Disk_read').Disk_read,avg:_.meanBy(JsonTime[3], 'Disk_read')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'Disk_read').Disk_read,min:_.minBy(JsonTime[4], 'Disk_read').Disk_read,avg:_.meanBy(JsonTime[4], 'Disk_read')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'Disk_read').Disk_read,min:_.minBy(JsonTime[5], 'Disk_read').Disk_read,avg:_.meanBy(JsonTime[5], 'Disk_read')}],	
      TX_total:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'TX_total').TX_total,min:_.minBy(JsonTime[0], 'TX_total').TX_total,avg:_.meanBy(JsonTime[0], 'TX_total')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'TX_total').TX_total,min:_.minBy(JsonTime[1], 'TX_total').TX_total,avg:_.meanBy(JsonTime[1], 'TX_total')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'TX_total').TX_total,min:_.minBy(JsonTime[2], 'TX_total').TX_total,avg:_.meanBy(JsonTime[2], 'TX_total')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'TX_total').TX_total,min:_.minBy(JsonTime[3], 'TX_total').TX_total,avg:_.meanBy(JsonTime[3], 'TX_total')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'TX_total').TX_total,min:_.minBy(JsonTime[4], 'TX_total').TX_total,avg:_.meanBy(JsonTime[4], 'TX_total')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'TX_total').TX_total,min:_.minBy(JsonTime[5], 'TX_total').TX_total,avg:_.meanBy(JsonTime[5], 'TX_total')}],
      TX_error:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'TX_error').TX_error,min:_.minBy(JsonTime[0], 'TX_error').TX_error,avg:_.meanBy(JsonTime[0], 'TX_error')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'TX_error').TX_error,min:_.minBy(JsonTime[1], 'TX_error').TX_error,avg:_.meanBy(JsonTime[1], 'TX_error')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'TX_error').TX_error,min:_.minBy(JsonTime[2], 'TX_error').TX_error,avg:_.meanBy(JsonTime[2], 'TX_error')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'TX_error').TX_error,min:_.minBy(JsonTime[3], 'TX_error').TX_error,avg:_.meanBy(JsonTime[3], 'TX_error')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'TX_error').TX_error,min:_.minBy(JsonTime[4], 'TX_error').TX_error,avg:_.meanBy(JsonTime[4], 'TX_error')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'TX_error').TX_error,min:_.minBy(JsonTime[5], 'TX_error').TX_error,avg:_.meanBy(JsonTime[5], 'TX_error')}],
      RX_total:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'RX_total').RX_total,min:_.minBy(JsonTime[0], 'RX_total').RX_total,avg:_.meanBy(JsonTime[0], 'RX_total')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'RX_total').RX_total,min:_.minBy(JsonTime[1], 'RX_total').RX_total,avg:_.meanBy(JsonTime[1], 'RX_total')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'RX_total').RX_total,min:_.minBy(JsonTime[2], 'RX_total').RX_total,avg:_.meanBy(JsonTime[2], 'RX_total')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'RX_total').RX_total,min:_.minBy(JsonTime[3], 'RX_total').RX_total,avg:_.meanBy(JsonTime[3], 'RX_total')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'RX_total').RX_total,min:_.minBy(JsonTime[4], 'RX_total').RX_total,avg:_.meanBy(JsonTime[4], 'RX_total')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'RX_total').RX_total,min:_.minBy(JsonTime[5], 'RX_total').RX_total,avg:_.meanBy(JsonTime[5], 'RX_total')}],
      RX_error:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'RX_error').RX_error,min:_.minBy(JsonTime[0], 'RX_error').RX_error,avg:_.meanBy(JsonTime[0], 'RX_error')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'RX_error').RX_error,min:_.minBy(JsonTime[1], 'RX_error').RX_error,avg:_.meanBy(JsonTime[1], 'RX_error')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'RX_error').RX_error,min:_.minBy(JsonTime[2], 'RX_error').RX_error,avg:_.meanBy(JsonTime[2], 'RX_error')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'RX_error').RX_error,min:_.minBy(JsonTime[3], 'RX_error').RX_error,avg:_.meanBy(JsonTime[3], 'RX_error')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'RX_error').RX_error,min:_.minBy(JsonTime[4], 'RX_error').RX_error,avg:_.meanBy(JsonTime[4], 'RX_error')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'RX_error').RX_error,min:_.minBy(JsonTime[5], 'RX_error').RX_error,avg:_.meanBy(JsonTime[5], 'RX_error')}]}
      );
    
    });
    

    var wb = new xl.Workbook();
    jsonResult.forEach(function(element,i) {
       var ws = wb.addWorksheet('VM '+(i+1)); 
       ws.cell(1,1).string('Filename'); 
       ws.cell(1,2).string(element.Info.Filename); 
       ws.cell(2,1).string('Length'); 
       ws.cell(2,2).number(element.Info.Length); 
       ws.cell(3,1).string('Hours'); 
       ws.cell(3,2).number(element.Info.Hours); 
       ws.cell(4,1).string('Time'); 
       ws.cell(4,2).string(element.Time.STARTDATE); 
       ws.cell(4,3).string(element.Time.ENDDATE); 
       ws.cell(6,1).string('CPU_USAGE'); 
       ws.cell(7,1).string('MEMORY_USAGE'); 
       ws.cell(8,1).string('Disk_write'); 
       ws.cell(9,1).string('Disk_read'); 
       ws.cell(10,1).string('TX_total'); 
       ws.cell(11,1).string('TX_error'); 
       ws.cell(12,1).string('RX_total'); 
       ws.cell(13,1).string('RX_error'); 

       ws.cell(5,2).string('MAX_1'); 
       ws.cell(5,3).string('MIN_1'); 
       ws.cell(5,4).string('AVG_1'); 
       ws.cell(5,5).string('MAX_2'); 
       ws.cell(5,6).string('MIN_2'); 
       ws.cell(5,7).string('AVG_2'); 
       ws.cell(5,8).string('MAX_3'); 
       ws.cell(5,9).string('MIN_3'); 
       ws.cell(5,10).string('AVG_3'); 
       ws.cell(5,11).string('MAX_4'); 
       ws.cell(5,12).string('MIN_4'); 
       ws.cell(5,13).string('AVG_4'); 
       ws.cell(5,14).string('MAX_5'); 
       ws.cell(5,15).string('MIN_5'); 
       ws.cell(5,16).string('AVG_5'); 
       ws.cell(5,17).string('MAX_6'); 
       ws.cell(5,18).string('MIN_6'); 
       ws.cell(5,19).string('AVG_6'); 
      
       //CPU_USAGE
       ws.cell(6,2).number(element.CPU_USAGE[0].max); 
       ws.cell(6,3).number(element.CPU_USAGE[0].min); 
       ws.cell(6,4).number(element.CPU_USAGE[0].avg); 

       ws.cell(6,5).number(element.CPU_USAGE[1].max); 
       ws.cell(6,6).number(element.CPU_USAGE[1].min); 
       ws.cell(6,7).number(element.CPU_USAGE[1].avg); 

       ws.cell(6,8).number(element.CPU_USAGE[2].max); 
       ws.cell(6,9).number(element.CPU_USAGE[2].min); 
       ws.cell(6,10).number(element.CPU_USAGE[2].avg); 

       ws.cell(6,11).number(element.CPU_USAGE[3].max); 
       ws.cell(6,12).number(element.CPU_USAGE[3].min); 
       ws.cell(6,13).number(element.CPU_USAGE[3].avg); 

       ws.cell(6,14).number(element.CPU_USAGE[4].max); 
       ws.cell(6,15).number(element.CPU_USAGE[4].min); 
       ws.cell(6,16).number(element.CPU_USAGE[4].avg); 

       ws.cell(6,17).number(element.CPU_USAGE[5].max); 
       ws.cell(6,18).number(element.CPU_USAGE[5].min); 
       ws.cell(6,19).number(element.CPU_USAGE[5].avg); 

       //MEMORY_USAGE
       ws.cell(7,2).number(element.MEMORY_USAGE[0].max); 
       ws.cell(7,3).number(element.MEMORY_USAGE[0].min); 
       ws.cell(7,4).number(element.MEMORY_USAGE[0].avg); 

       ws.cell(7,5).number(element.MEMORY_USAGE[1].max); 
       ws.cell(7,6).number(element.MEMORY_USAGE[1].min); 
       ws.cell(7,7).number(element.MEMORY_USAGE[1].avg); 

       ws.cell(7,8).number(element.MEMORY_USAGE[2].max); 
       ws.cell(7,9).number(element.MEMORY_USAGE[2].min); 
       ws.cell(7,10).number(element.MEMORY_USAGE[2].avg); 

       ws.cell(7,11).number(element.MEMORY_USAGE[3].max); 
       ws.cell(7,12).number(element.MEMORY_USAGE[3].min); 
       ws.cell(7,13).number(element.MEMORY_USAGE[3].avg); 

       ws.cell(7,14).number(element.MEMORY_USAGE[4].max); 
       ws.cell(7,15).number(element.MEMORY_USAGE[4].min); 
       ws.cell(7,16).number(element.MEMORY_USAGE[4].avg); 

       ws.cell(7,17).number(element.MEMORY_USAGE[5].max); 
       ws.cell(7,18).number(element.MEMORY_USAGE[5].min); 
       ws.cell(7,19).number(element.MEMORY_USAGE[5].avg); 

       //Disk_write
       ws.cell(8,2).number(element.Disk_write[0].max); 
       ws.cell(8,3).number(element.Disk_write[0].min); 
       ws.cell(8,4).number(element.Disk_write[0].avg); 

       ws.cell(8,5).number(element.Disk_write[1].max); 
       ws.cell(8,6).number(element.Disk_write[1].min); 
       ws.cell(8,7).number(element.Disk_write[1].avg); 

       ws.cell(8,8).number(element.Disk_write[2].max); 
       ws.cell(8,9).number(element.Disk_write[2].min); 
       ws.cell(8,10).number(element.Disk_write[2].avg); 

       ws.cell(8,11).number(element.Disk_write[3].max); 
       ws.cell(8,12).number(element.Disk_write[3].min); 
       ws.cell(8,13).number(element.Disk_write[3].avg); 

       ws.cell(8,14).number(element.Disk_write[4].max); 
       ws.cell(8,15).number(element.Disk_write[4].min); 
       ws.cell(8,16).number(element.Disk_write[4].avg); 

       ws.cell(8,17).number(element.Disk_write[5].max); 
       ws.cell(8,18).number(element.Disk_write[5].min); 
       ws.cell(8,19).number(element.Disk_write[5].avg); 

       //Disk_read
       ws.cell(9,2).number(element.Disk_read[0].max); 
       ws.cell(9,3).number(element.Disk_read[0].min); 
       ws.cell(9,4).number(element.Disk_read[0].avg); 

       ws.cell(9,5).number(element.Disk_read[1].max); 
       ws.cell(9,6).number(element.Disk_read[1].min); 
       ws.cell(9,7).number(element.Disk_read[1].avg); 

       ws.cell(9,8).number(element.Disk_read[2].max); 
       ws.cell(9,9).number(element.Disk_read[2].min); 
       ws.cell(9,10).number(element.Disk_read[2].avg); 

       ws.cell(9,11).number(element.Disk_read[3].max); 
       ws.cell(9,12).number(element.Disk_read[3].min); 
       ws.cell(9,13).number(element.Disk_read[3].avg); 

       ws.cell(9,14).number(element.Disk_read[4].max); 
       ws.cell(9,15).number(element.Disk_read[4].min); 
       ws.cell(9,16).number(element.Disk_read[4].avg); 

       ws.cell(9,17).number(element.Disk_read[5].max); 
       ws.cell(9,18).number(element.Disk_read[5].min); 
       ws.cell(9,19).number(element.Disk_read[5].avg); 

       //TX_total
       ws.cell(10,2).number(element.TX_total[0].max); 
       ws.cell(10,3).number(element.TX_total[0].min); 
       ws.cell(10,4).number(element.TX_total[0].avg); 

       ws.cell(10,5).number(element.TX_total[1].max); 
       ws.cell(10,6).number(element.TX_total[1].min); 
       ws.cell(10,7).number(element.TX_total[1].avg); 

       ws.cell(10,8).number(element.TX_total[2].max); 
       ws.cell(10,9).number(element.TX_total[2].min); 
       ws.cell(10,10).number(element.TX_total[2].avg); 

       ws.cell(10,11).number(element.TX_total[3].max); 
       ws.cell(10,12).number(element.TX_total[3].min); 
       ws.cell(10,13).number(element.TX_total[3].avg); 

       ws.cell(10,14).number(element.TX_total[4].max); 
       ws.cell(10,15).number(element.TX_total[4].min); 
       ws.cell(10,16).number(element.TX_total[4].avg); 

       ws.cell(10,17).number(element.TX_total[5].max); 
       ws.cell(10,18).number(element.TX_total[5].min); 
       ws.cell(10,19).number(element.TX_total[5].avg); 

       //TX_error
       ws.cell(11,2).number(element.TX_error[0].max); 
       ws.cell(11,3).number(element.TX_error[0].min); 
       ws.cell(11,4).number(element.TX_error[0].avg); 

       ws.cell(11,5).number(element.TX_error[1].max); 
       ws.cell(11,6).number(element.TX_error[1].min); 
       ws.cell(11,7).number(element.TX_error[1].avg); 

       ws.cell(11,8).number(element.TX_error[2].max); 
       ws.cell(11,9).number(element.TX_error[2].min); 
       ws.cell(11,10).number(element.TX_error[2].avg); 

       ws.cell(11,11).number(element.TX_error[3].max); 
       ws.cell(11,12).number(element.TX_error[3].min); 
       ws.cell(11,13).number(element.TX_error[3].avg); 

       ws.cell(11,14).number(element.TX_error[4].max); 
       ws.cell(11,15).number(element.TX_error[4].min); 
       ws.cell(11,16).number(element.TX_error[4].avg); 

       ws.cell(11,17).number(element.TX_error[5].max); 
       ws.cell(11,18).number(element.TX_error[5].min); 
       ws.cell(11,19).number(element.TX_error[5].avg);

         //RX_total
       ws.cell(12,2).number(element.RX_total[0].max); 
       ws.cell(12,3).number(element.RX_total[0].min); 
       ws.cell(12,4).number(element.RX_total[0].avg); 

       ws.cell(12,5).number(element.RX_total[1].max); 
       ws.cell(12,6).number(element.RX_total[1].min); 
       ws.cell(12,7).number(element.RX_total[1].avg); 

       ws.cell(12,8).number(element.RX_total[2].max); 
       ws.cell(12,9).number(element.RX_total[2].min); 
       ws.cell(12,10).number(element.RX_total[2].avg); 

       ws.cell(12,11).number(element.RX_total[3].max); 
       ws.cell(12,12).number(element.RX_total[3].min); 
       ws.cell(12,13).number(element.RX_total[3].avg); 

       ws.cell(12,14).number(element.RX_total[4].max); 
       ws.cell(12,15).number(element.RX_total[4].min); 
       ws.cell(12,16).number(element.RX_total[4].avg); 

       ws.cell(12,17).number(element.RX_total[5].max); 
       ws.cell(12,18).number(element.RX_total[5].min); 
       ws.cell(12,19).number(element.RX_total[5].avg);


         //RX_error
       ws.cell(13,2).number(element.RX_error[0].max); 
       ws.cell(13,3).number(element.RX_error[0].min); 
       ws.cell(13,4).number(element.RX_error[0].avg); 

       ws.cell(13,5).number(element.RX_error[1].max); 
       ws.cell(13,6).number(element.RX_error[1].min); 
       ws.cell(13,7).number(element.RX_error[1].avg); 

       ws.cell(13,8).number(element.RX_error[2].max); 
       ws.cell(13,9).number(element.RX_error[2].min); 
       ws.cell(13,10).number(element.RX_error[2].avg); 

       ws.cell(13,11).number(element.RX_error[3].max); 
       ws.cell(13,12).number(element.RX_error[3].min); 
       ws.cell(13,13).number(element.RX_error[3].avg); 

       ws.cell(13,14).number(element.RX_error[4].max); 
       ws.cell(13,15).number(element.RX_error[4].min); 
       ws.cell(13,16).number(element.RX_error[4].avg); 

       ws.cell(13,17).number(element.RX_error[5].max); 
       ws.cell(13,18).number(element.RX_error[5].min); 
       ws.cell(13,19).number(element.RX_error[5].avg);

    

    });
    let filename = "Logfile_"+Date.now()+".xlsx"
    wb.write(filename, res);
    // global.HTTPSTATUS(res,200,null,jsonResult)
  } catch (error) {
    console.log(error);
    
    global.HTTPSTATUS(res,404,null,{lastfile:lastfileProcess,text:'Please , upload file xlsx only!!'})
  }
  
});

app.post('/uploads/csv',upload.any(), (req, res, ) => {
  var jsonResult = []
  var lastfileProcess 
  try {
    req.files.forEach(function(element,i) {
      const workbook = XLSX.readFile(req.files[i].path, {cellDates:true, cellNF: false, cellText:false})
      const sheet_name_list = workbook.SheetNames;
      // console.log(XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1));
      console.log(req.files[i].originalname);
      
      lastfileProcess = req.files[i].originalname
      var result = XLSX.utils.sheet_to_row_object_array(workbook.Sheets.Sheet1,{'date_format':'dd/mm/yyyy'})
      result.shift()
  
      var s = JSON.stringify(result);
      var t = s.replace(/"sep="/g, '"Time"');
      t = t.replace(/"__EMPTY"/g, '"CPU_USAGE"');
      t = t.replace(/"__EMPTY_1"/g, '"MEMORY_USAGE"');
      t = t.replace(/"__EMPTY_2"/g, '"Disk_write"');
      t = t.replace(/"__EMPTY_3"/g, '"Disk_read"');
      t = t.replace(/"__EMPTY_4"/g, '"TX_total"');
      t = t.replace(/"__EMPTY_5"/g, '"TX_error"');
      t = t.replace(/"__EMPTY_6"/g, '"RX_total"');
      t = t.replace(/"__EMPTY_7"/g, '"RX_error"');

  
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
      
      jsonResult.push( {Info:{Length:result.length,Filename:req.files[i].originalname,UploadDate:Date(),Day:diff_hours(_.maxBy(result, 'Time').Time, _.minBy(result, 'Time').Time)/24,Hours:diff_hours(_.maxBy(result, 'Time').Time, _.minBy(result, 'Time').Time)},Time:{ENDDATE:_.maxBy(result, 'Time').Time,STARTDATE:_.minBy(result, 'Time').Time},	
      CPU_USAGE:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'CPU_USAGE').CPU_USAGE,min:_.minBy(JsonTime[0], 'CPU_USAGE').CPU_USAGE,avg:_.meanBy(JsonTime[0], 'CPU_USAGE')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'CPU_USAGE').CPU_USAGE,min:_.minBy(JsonTime[1], 'CPU_USAGE').CPU_USAGE,avg:_.meanBy(JsonTime[1], 'CPU_USAGE')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'CPU_USAGE').CPU_USAGE,min:_.minBy(JsonTime[2], 'CPU_USAGE').CPU_USAGE,avg:_.meanBy(JsonTime[2], 'CPU_USAGE')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'CPU_USAGE').CPU_USAGE,min:_.minBy(JsonTime[3], 'CPU_USAGE').CPU_USAGE,avg:_.meanBy(JsonTime[3], 'CPU_USAGE')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'CPU_USAGE').CPU_USAGE,min:_.minBy(JsonTime[4], 'CPU_USAGE').CPU_USAGE,avg:_.meanBy(JsonTime[4], 'CPU_USAGE')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'CPU_USAGE').CPU_USAGE,min:_.minBy(JsonTime[5], 'CPU_USAGE').CPU_USAGE,avg:_.meanBy(JsonTime[5], 'CPU_USAGE')}],	
      MEMORY_USAGE:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'MEMORY_USAGE').MEMORY_USAGE,min:_.minBy(JsonTime[0], 'MEMORY_USAGE').MEMORY_USAGE,avg:_.meanBy(JsonTime[0], 'MEMORY_USAGE')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'MEMORY_USAGE').MEMORY_USAGE,min:_.minBy(JsonTime[1], 'MEMORY_USAGE').MEMORY_USAGE,avg:_.meanBy(JsonTime[1], 'MEMORY_USAGE')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'MEMORY_USAGE').MEMORY_USAGE,min:_.minBy(JsonTime[2], 'MEMORY_USAGE').MEMORY_USAGE,avg:_.meanBy(JsonTime[2], 'MEMORY_USAGE')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'MEMORY_USAGE').MEMORY_USAGE,min:_.minBy(JsonTime[3], 'MEMORY_USAGE').MEMORY_USAGE,avg:_.meanBy(JsonTime[3], 'MEMORY_USAGE')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'MEMORY_USAGE').MEMORY_USAGE,min:_.minBy(JsonTime[4], 'MEMORY_USAGE').MEMORY_USAGE,avg:_.meanBy(JsonTime[4], 'MEMORY_USAGE')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'MEMORY_USAGE').MEMORY_USAGE,min:_.minBy(JsonTime[5], 'MEMORY_USAGE').MEMORY_USAGE,avg:_.meanBy(JsonTime[5], 'MEMORY_USAGE')}],
      Disk_write:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'Disk_write').Disk_write,min:_.minBy(JsonTime[0], 'Disk_write').Disk_write,avg:_.meanBy(JsonTime[0], 'Disk_write')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'Disk_write').Disk_write,min:_.minBy(JsonTime[1], 'Disk_write').Disk_write,avg:_.meanBy(JsonTime[1], 'Disk_write')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'Disk_write').Disk_write,min:_.minBy(JsonTime[2], 'Disk_write').Disk_write,avg:_.meanBy(JsonTime[2], 'Disk_write')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'Disk_write').Disk_write,min:_.minBy(JsonTime[3], 'Disk_write').Disk_write,avg:_.meanBy(JsonTime[3], 'Disk_write')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'Disk_write').Disk_write,min:_.minBy(JsonTime[4], 'Disk_write').Disk_write,avg:_.meanBy(JsonTime[4], 'Disk_write')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'Disk_write').Disk_write,min:_.minBy(JsonTime[5], 'Disk_write').Disk_write,avg:_.meanBy(JsonTime[5], 'Disk_write')}],	
      Disk_read:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'Disk_read').Disk_read,min:_.minBy(JsonTime[0], 'Disk_read').Disk_read,avg:_.meanBy(JsonTime[0], 'Disk_read')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'Disk_read').Disk_read,min:_.minBy(JsonTime[1], 'Disk_read').Disk_read,avg:_.meanBy(JsonTime[1], 'Disk_read')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'Disk_read').Disk_read,min:_.minBy(JsonTime[2], 'Disk_read').Disk_read,avg:_.meanBy(JsonTime[2], 'Disk_read')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'Disk_read').Disk_read,min:_.minBy(JsonTime[3], 'Disk_read').Disk_read,avg:_.meanBy(JsonTime[3], 'Disk_read')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'Disk_read').Disk_read,min:_.minBy(JsonTime[4], 'Disk_read').Disk_read,avg:_.meanBy(JsonTime[4], 'Disk_read')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'Disk_read').Disk_read,min:_.minBy(JsonTime[5], 'Disk_read').Disk_read,avg:_.meanBy(JsonTime[5], 'Disk_read')}],	
      TX_total:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'TX_total').TX_total,min:_.minBy(JsonTime[0], 'TX_total').TX_total,avg:_.meanBy(JsonTime[0], 'TX_total')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'TX_total').TX_total,min:_.minBy(JsonTime[1], 'TX_total').TX_total,avg:_.meanBy(JsonTime[1], 'TX_total')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'TX_total').TX_total,min:_.minBy(JsonTime[2], 'TX_total').TX_total,avg:_.meanBy(JsonTime[2], 'TX_total')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'TX_total').TX_total,min:_.minBy(JsonTime[3], 'TX_total').TX_total,avg:_.meanBy(JsonTime[3], 'TX_total')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'TX_total').TX_total,min:_.minBy(JsonTime[4], 'TX_total').TX_total,avg:_.meanBy(JsonTime[4], 'TX_total')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'TX_total').TX_total,min:_.minBy(JsonTime[5], 'TX_total').TX_total,avg:_.meanBy(JsonTime[5], 'TX_total')}],
      TX_error:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'TX_error').TX_error,min:_.minBy(JsonTime[0], 'TX_error').TX_error,avg:_.meanBy(JsonTime[0], 'TX_error')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'TX_error').TX_error,min:_.minBy(JsonTime[1], 'TX_error').TX_error,avg:_.meanBy(JsonTime[1], 'TX_error')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'TX_error').TX_error,min:_.minBy(JsonTime[2], 'TX_error').TX_error,avg:_.meanBy(JsonTime[2], 'TX_error')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'TX_error').TX_error,min:_.minBy(JsonTime[3], 'TX_error').TX_error,avg:_.meanBy(JsonTime[3], 'TX_error')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'TX_error').TX_error,min:_.minBy(JsonTime[4], 'TX_error').TX_error,avg:_.meanBy(JsonTime[4], 'TX_error')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'TX_error').TX_error,min:_.minBy(JsonTime[5], 'TX_error').TX_error,avg:_.meanBy(JsonTime[5], 'TX_error')}],
      RX_total:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'RX_total').RX_total,min:_.minBy(JsonTime[0], 'RX_total').RX_total,avg:_.meanBy(JsonTime[0], 'RX_total')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'RX_total').RX_total,min:_.minBy(JsonTime[1], 'RX_total').RX_total,avg:_.meanBy(JsonTime[1], 'RX_total')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'RX_total').RX_total,min:_.minBy(JsonTime[2], 'RX_total').RX_total,avg:_.meanBy(JsonTime[2], 'RX_total')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'RX_total').RX_total,min:_.minBy(JsonTime[3], 'RX_total').RX_total,avg:_.meanBy(JsonTime[3], 'RX_total')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'RX_total').RX_total,min:_.minBy(JsonTime[4], 'RX_total').RX_total,avg:_.meanBy(JsonTime[4], 'RX_total')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'RX_total').RX_total,min:_.minBy(JsonTime[5], 'RX_total').RX_total,avg:_.meanBy(JsonTime[5], 'RX_total')}],
      RX_error:[{TYPE:"00 - 04",max:_.maxBy(JsonTime[0], 'RX_error').RX_error,min:_.minBy(JsonTime[0], 'RX_error').RX_error,avg:_.meanBy(JsonTime[0], 'RX_error')},{TYPE:"05 - 08",max:_.maxBy(JsonTime[1], 'RX_error').RX_error,min:_.minBy(JsonTime[1], 'RX_error').RX_error,avg:_.meanBy(JsonTime[1], 'RX_error')},{TYPE:"09 - 12",max:_.maxBy(JsonTime[2], 'RX_error').RX_error,min:_.minBy(JsonTime[2], 'RX_error').RX_error,avg:_.meanBy(JsonTime[2], 'RX_error')},{TYPE:"13 - 16",max:_.maxBy(JsonTime[3], 'RX_error').RX_error,min:_.minBy(JsonTime[3], 'RX_error').RX_error,avg:_.meanBy(JsonTime[3], 'RX_error')},{TYPE:"17 - 20",max:_.maxBy(JsonTime[4], 'RX_error').RX_error,min:_.minBy(JsonTime[4], 'RX_error').RX_error,avg:_.meanBy(JsonTime[4], 'RX_error')},{TYPE:"21 - 23",max:_.maxBy(JsonTime[5], 'RX_error').RX_error,min:_.minBy(JsonTime[5], 'RX_error').RX_error,avg:_.meanBy(JsonTime[5], 'RX_error')}]}
      );
    
    });
    

    var wb = new xl.Workbook();
    var ws = wb.addWorksheet('VM '); 
    var col=1
    for (let i = 1; i <= 8; i++) {
      for (let j = 1; j <= 6; j++) {
        for (let k = 1; k <= 3; k++) {
          var typeCol = ['MAX',"MIN","AVG"]
          ws.cell(1,col).string(typeCol[k-1]+i+j); 
          col++
        }
        
      }
      
   
      
    }
    jsonResult.forEach(function(element,i) {
       
       
      
       //CPU_USAGE
       ws.cell(i+2,1).number(element.CPU_USAGE[0].max); 
       ws.cell(i+2,2).number(element.CPU_USAGE[0].min); 
       ws.cell(i+2,3).number(element.CPU_USAGE[0].avg); 

       ws.cell(i+2,4).number(element.CPU_USAGE[1].max); 
       ws.cell(i+2,5).number(element.CPU_USAGE[1].min); 
       ws.cell(i+2,6).number(element.CPU_USAGE[1].avg); 

       ws.cell(i+2,7).number(element.CPU_USAGE[2].max); 
       ws.cell(i+2,8).number(element.CPU_USAGE[2].min); 
       ws.cell(i+2,9).number(element.CPU_USAGE[2].avg); 

       ws.cell(i+2,10).number(element.CPU_USAGE[3].max); 
       ws.cell(i+2,11).number(element.CPU_USAGE[3].min); 
       ws.cell(i+2,12).number(element.CPU_USAGE[3].avg); 

       ws.cell(i+2,13).number(element.CPU_USAGE[4].max); 
       ws.cell(i+2,14).number(element.CPU_USAGE[4].min); 
       ws.cell(i+2,15).number(element.CPU_USAGE[4].avg); 

       ws.cell(i+2,16).number(element.CPU_USAGE[5].max); 
       ws.cell(i+2,17).number(element.CPU_USAGE[5].min); 
       ws.cell(i+2,18).number(element.CPU_USAGE[5].avg); 

       //MEMORY_USAGE
       ws.cell(i+2,19).number(element.MEMORY_USAGE[0].max); 
       ws.cell(i+2,20).number(element.MEMORY_USAGE[0].min); 
       ws.cell(i+2,21).number(element.MEMORY_USAGE[0].avg); 

       ws.cell(i+2,22).number(element.MEMORY_USAGE[1].max); 
       ws.cell(i+2,23).number(element.MEMORY_USAGE[1].min); 
       ws.cell(i+2,24).number(element.MEMORY_USAGE[1].avg); 

       ws.cell(i+2,25).number(element.MEMORY_USAGE[2].max); 
       ws.cell(i+2,26).number(element.MEMORY_USAGE[2].min); 
       ws.cell(i+2,27).number(element.MEMORY_USAGE[2].avg); 

       ws.cell(i+2,28).number(element.MEMORY_USAGE[3].max); 
       ws.cell(i+2,29).number(element.MEMORY_USAGE[3].min); 
       ws.cell(i+2,30).number(element.MEMORY_USAGE[3].avg); 

       ws.cell(i+2,31).number(element.MEMORY_USAGE[4].max); 
       ws.cell(i+2,32).number(element.MEMORY_USAGE[4].min); 
       ws.cell(i+2,33).number(element.MEMORY_USAGE[4].avg); 

       ws.cell(i+2,34).number(element.MEMORY_USAGE[5].max); 
       ws.cell(i+2,35).number(element.MEMORY_USAGE[5].min); 
       ws.cell(i+2,36).number(element.MEMORY_USAGE[5].avg); 

       //Disk_write
       ws.cell(i+2,37).number(element.Disk_write[0].max); 
       ws.cell(i+2,38).number(element.Disk_write[0].min); 
       ws.cell(i+2,39).number(element.Disk_write[0].avg); 

       ws.cell(i+2,40).number(element.Disk_write[1].max); 
       ws.cell(i+2,41).number(element.Disk_write[1].min); 
       ws.cell(i+2,42).number(element.Disk_write[1].avg); 

       ws.cell(i+2,43).number(element.Disk_write[2].max); 
       ws.cell(i+2,44).number(element.Disk_write[2].min); 
       ws.cell(i+2,45).number(element.Disk_write[2].avg); 

       ws.cell(i+2,46).number(element.Disk_write[3].max); 
       ws.cell(i+2,47).number(element.Disk_write[3].min); 
       ws.cell(i+2,48).number(element.Disk_write[3].avg); 

       ws.cell(i+2,49).number(element.Disk_write[4].max); 
       ws.cell(i+2,50).number(element.Disk_write[4].min); 
       ws.cell(i+2,51).number(element.Disk_write[4].avg); 

       ws.cell(i+2,52).number(element.Disk_write[5].max); 
       ws.cell(i+2,53).number(element.Disk_write[5].min); 
       ws.cell(i+2,54).number(element.Disk_write[5].avg); 

       //Disk_read
       ws.cell(i+2,55).number(element.Disk_read[0].max); 
       ws.cell(i+2,56).number(element.Disk_read[0].min); 
       ws.cell(i+2,57).number(element.Disk_read[0].avg); 

       ws.cell(i+2,58).number(element.Disk_read[1].max); 
       ws.cell(i+2,59).number(element.Disk_read[1].min); 
       ws.cell(i+2,60).number(element.Disk_read[1].avg); 

       ws.cell(i+2,61).number(element.Disk_read[2].max); 
       ws.cell(i+2,62).number(element.Disk_read[2].min); 
       ws.cell(i+2,63).number(element.Disk_read[2].avg); 

       ws.cell(i+2,64).number(element.Disk_read[3].max); 
       ws.cell(i+2,65).number(element.Disk_read[3].min); 
       ws.cell(i+2,66).number(element.Disk_read[3].avg); 

       ws.cell(i+2,67).number(element.Disk_read[4].max); 
       ws.cell(i+2,68).number(element.Disk_read[4].min); 
       ws.cell(i+2,69).number(element.Disk_read[4].avg); 

       ws.cell(i+2,70).number(element.Disk_read[5].max); 
       ws.cell(i+2,71).number(element.Disk_read[5].min); 
       ws.cell(i+2,72).number(element.Disk_read[5].avg); 

       //TX_total
       ws.cell(i+2,73).number(element.TX_total[0].max); 
       ws.cell(i+2,74).number(element.TX_total[0].min); 
       ws.cell(i+2,75).number(element.TX_total[0].avg); 

       ws.cell(i+2,76).number(element.TX_total[1].max); 
       ws.cell(i+2,77).number(element.TX_total[1].min); 
       ws.cell(i+2,78).number(element.TX_total[1].avg); 

       ws.cell(i+2,79).number(element.TX_total[2].max); 
       ws.cell(i+2,80).number(element.TX_total[2].min); 
       ws.cell(i+2,81).number(element.TX_total[2].avg); 

       ws.cell(i+2,82).number(element.TX_total[3].max); 
       ws.cell(i+2,83).number(element.TX_total[3].min); 
       ws.cell(i+2,84).number(element.TX_total[3].avg); 

       ws.cell(i+2,85).number(element.TX_total[4].max); 
       ws.cell(i+2,86).number(element.TX_total[4].min); 
       ws.cell(i+2,87).number(element.TX_total[4].avg); 

       ws.cell(i+2,88).number(element.TX_total[5].max); 
       ws.cell(i+2,89).number(element.TX_total[5].min); 
       ws.cell(i+2,90).number(element.TX_total[5].avg); 

       //TX_error
       ws.cell(i+2,91).number(element.TX_error[0].max); 
       ws.cell(i+2,92).number(element.TX_error[0].min); 
       ws.cell(i+2,93).number(element.TX_error[0].avg); 

       ws.cell(i+2,94).number(element.TX_error[1].max); 
       ws.cell(i+2,95).number(element.TX_error[1].min); 
       ws.cell(i+2,96).number(element.TX_error[1].avg); 

       ws.cell(i+2,97).number(element.TX_error[2].max); 
       ws.cell(i+2,98).number(element.TX_error[2].min); 
       ws.cell(i+2,99).number(element.TX_error[2].avg); 

       ws.cell(i+2,100).number(element.TX_error[3].max); 
       ws.cell(i+2,101).number(element.TX_error[3].min); 
       ws.cell(i+2,102).number(element.TX_error[3].avg); 

       ws.cell(i+2,103).number(element.TX_error[4].max); 
       ws.cell(i+2,104).number(element.TX_error[4].min); 
       ws.cell(i+2,105).number(element.TX_error[4].avg); 

       ws.cell(i+2,106).number(element.TX_error[5].max); 
       ws.cell(i+2,107).number(element.TX_error[5].min); 
       ws.cell(i+2,108).number(element.TX_error[5].avg);

         //RX_total
       ws.cell(i+2,109).number(element.RX_total[0].max); 
       ws.cell(i+2,110).number(element.RX_total[0].min); 
       ws.cell(i+2,111).number(element.RX_total[0].avg); 

       ws.cell(i+2,112).number(element.RX_total[1].max); 
       ws.cell(i+2,113).number(element.RX_total[1].min); 
       ws.cell(i+2,114).number(element.RX_total[1].avg); 

       ws.cell(i+2,115).number(element.RX_total[2].max); 
       ws.cell(i+2,116).number(element.RX_total[2].min); 
       ws.cell(i+2,117).number(element.RX_total[2].avg); 

       ws.cell(i+2,118).number(element.RX_total[3].max); 
       ws.cell(i+2,119).number(element.RX_total[3].min); 
       ws.cell(i+2,120).number(element.RX_total[3].avg); 

       ws.cell(i+2,121).number(element.RX_total[4].max); 
       ws.cell(i+2,122).number(element.RX_total[4].min); 
       ws.cell(i+2,123).number(element.RX_total[4].avg); 

       ws.cell(i+2,124).number(element.RX_total[5].max); 
       ws.cell(i+2,125).number(element.RX_total[5].min); 
       ws.cell(i+2,126).number(element.RX_total[5].avg);


         //RX_error
       ws.cell(i+2,127).number(element.RX_error[0].max); 
       ws.cell(i+2,128).number(element.RX_error[0].min); 
       ws.cell(i+2,129).number(element.RX_error[0].avg); 

       ws.cell(i+2,130).number(element.RX_error[1].max); 
       ws.cell(i+2,131).number(element.RX_error[1].min); 
       ws.cell(i+2,132).number(element.RX_error[1].avg); 

       ws.cell(i+2,133).number(element.RX_error[2].max); 
       ws.cell(i+2,134).number(element.RX_error[2].min); 
       ws.cell(i+2,135).number(element.RX_error[2].avg); 

       ws.cell(i+2,136).number(element.RX_error[3].max); 
       ws.cell(i+2,137).number(element.RX_error[3].min); 
       ws.cell(i+2,138).number(element.RX_error[3].avg); 

       ws.cell(i+2,139).number(element.RX_error[4].max); 
       ws.cell(i+2,140).number(element.RX_error[4].min); 
       ws.cell(i+2,141).number(element.RX_error[4].avg); 

       ws.cell(i+2,142).number(element.RX_error[5].max); 
       ws.cell(i+2,143).number(element.RX_error[5].min); 
       ws.cell(i+2,144).number(element.RX_error[5].avg);

    

    });
    let filename = "Logfile_"+Date.now()+".csv"
    wb.writeToBuffer().then(function(buffer) {
      console.log(buffer);
      
    });
     var filea =  wb.write(filename);
     console.log(filea);
     
     res.send(filea).end()
     
    // global.HTTPSTATUS(res,200,null,jsonResult)
  } catch (error) {
    console.log(error);
    
    global.HTTPSTATUS(res,404,null,{lastfile:lastfileProcess,text:'Please , upload file xlsx only!!'})
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
