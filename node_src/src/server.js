//require dependencies
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import log4js from 'log4js'
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

const { parse } = require('json2csv');

import * as XLSX from 'xlsx'

import { strictEqual } from 'assert';

log4js.configure('src/asset/json/log4js.json')
var log = log4js.getLogger("app")

var FormData = require('form-data');

const app = express();


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
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }))
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
  res.json({'status':'open','type':'NodeJS'}).end();
});


app.get('/logfile', (req, res, ) => {
  var logfile = require('../log/app.log');
  
  
  res.json({'status':'open','type':logfile}).end();
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


app.post('/uploads/csv',upload.any(), async (req, res ) => {
 
  let start = new Date().getTime();
  var jsonResult = []
  var lastfileProcess 
  var  groupprice =require('./asset/json/csvjson.json');
  // console.log(groupprice);
  
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

      let namefileNoType = req.files[i].originalname.split(".")     
      
      jsonResult.push( {Info:{Length:result.length,Filename:namefileNoType[0],Groupprice:_.find(groupprice,{'vm_id':namefileNoType[0]}).package,UploadDate:Date(),Day:diff_hours(_.maxBy(result, 'Time').Time, _.minBy(result, 'Time').Time)/24,Hours:diff_hours(_.maxBy(result, 'Time').Time, _.minBy(result, 'Time').Time)},Time:{ENDDATE:_.maxBy(result, 'Time').Time,STARTDATE:_.minBy(result, 'Time').Time},	
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
    

    var csvResult = [];
    jsonResult.forEach(element => {    
      csvResult.push(
        {
          NAMEFILE:element.Info.Filename,
          GROUPPRICE:element.Info.Groupprice,
          MAX11:element.CPU_USAGE[0].max,MIN11:element.CPU_USAGE[0].min,AVG11:element.CPU_USAGE[0].avg,MAX12:element.CPU_USAGE[1].max,MIN12:element.CPU_USAGE[1].min,AVG12:element.CPU_USAGE[1].avg,MAX13:element.CPU_USAGE[2].max,MIN13:element.CPU_USAGE[2].min,AVG13:element.CPU_USAGE[2].avg,MAX14:element.CPU_USAGE[3].max,MIN14:element.CPU_USAGE[3].min,AVG14:element.CPU_USAGE[3].avg,MAX15:element.CPU_USAGE[4].max,MIN15:element.CPU_USAGE[4].min,AVG15:element.CPU_USAGE[4].avg,MAX16:element.CPU_USAGE[5].max,MIN16:element.CPU_USAGE[5].min,AVG16:element.CPU_USAGE[5].avg,
          MAX21:element.MEMORY_USAGE[0].max,MIN21:element.MEMORY_USAGE[0].min,AVG21:element.MEMORY_USAGE[0].avg,MAX22:element.MEMORY_USAGE[1].max,MIN22:element.MEMORY_USAGE[1].min,AVG22:element.MEMORY_USAGE[1].avg,MAX23:element.MEMORY_USAGE[2].max,MIN23:element.MEMORY_USAGE[2].min,AVG23:element.MEMORY_USAGE[2].avg,MAX24:element.MEMORY_USAGE[3].max,MIN24:element.MEMORY_USAGE[3].min,AVG24:element.MEMORY_USAGE[3].avg,MAX25:element.MEMORY_USAGE[4].max,MIN25:element.MEMORY_USAGE[4].min,AVG25:element.MEMORY_USAGE[4].avg,MAX26:element.MEMORY_USAGE[5].max,MIN26:element.MEMORY_USAGE[5].min,AVG26:element.MEMORY_USAGE[5].avg,
          MAX31:element.Disk_write[0].max,MIN31:element.Disk_write[0].min,AVG31:element.Disk_write[0].avg,MAX32:element.Disk_write[1].max,MIN32:element.Disk_write[1].min,AVG32:element.Disk_write[1].avg,MAX33:element.Disk_write[2].max,MIN33:element.Disk_write[2].min,AVG33:element.Disk_write[2].avg,MAX34:element.Disk_write[3].max,MIN34:element.Disk_write[3].min,AVG34:element.Disk_write[3].avg,MAX35:element.Disk_write[4].max,MIN35:element.Disk_write[4].min,AVG35:element.Disk_write[4].avg,MAX36:element.Disk_write[5].max,MIN36:element.Disk_write[5].min,AVG36:element.Disk_write[5].avg,
          MAX41:element.Disk_read[0].max,MIN41:element.Disk_read[0].min,AVG41:element.Disk_read[0].avg,MAX42:element.Disk_read[1].max,MIN42:element.Disk_read[1].min,AVG42:element.Disk_read[1].avg,MAX43:element.Disk_read[2].max,MIN43:element.Disk_read[2].min,AVG43:element.Disk_read[2].avg,MAX44:element.Disk_read[3].max,MIN44:element.Disk_read[3].min,AVG44:element.Disk_read[3].avg,MAX45:element.Disk_read[4].max,MIN45:element.Disk_read[4].min,AVG45:element.Disk_read[4].avg,MAX46:element.Disk_read[5].max,MIN46:element.Disk_read[5].min,AVG46:element.Disk_read[5].avg,
          MAX51:element.TX_total[0].max,MIN51:element.TX_total[0].min,AVG51:element.TX_total[0].avg,MAX52:element.TX_total[1].max,MIN52:element.TX_total[1].min,AVG52:element.TX_total[1].avg,MAX53:element.TX_total[2].max,MIN53:element.TX_total[2].min,AVG53:element.TX_total[2].avg,MAX54:element.TX_total[3].max,MIN54:element.TX_total[3].min,AVG54:element.TX_total[3].avg,MAX55:element.TX_total[4].max,MIN55:element.TX_total[4].min,AVG55:element.TX_total[4].avg,MAX56:element.TX_total[5].max,MIN56:element.TX_total[5].min,AVG56:element.TX_total[5].avg,
          MAX61:element.TX_error[0].max,MIN61:element.TX_error[0].min,AVG61:element.TX_error[0].avg,MAX62:element.TX_error[1].max,MIN62:element.TX_error[1].min,AVG62:element.TX_error[1].avg,MAX63:element.TX_error[2].max,MIN63:element.TX_error[2].min,AVG63:element.TX_error[2].avg,MAX64:element.TX_error[3].max,MIN64:element.TX_error[3].min,AVG64:element.TX_error[3].avg,MAX65:element.TX_error[4].max,MIN65:element.TX_error[4].min,AVG65:element.TX_error[4].avg,MAX66:element.TX_error[5].max,MIN66:element.TX_error[5].min,AVG66:element.TX_error[5].avg,
          MAX71:element.RX_total[0].max,MIN71:element.RX_total[0].min,AVG71:element.RX_total[0].avg,MAX72:element.RX_total[1].max,MIN72:element.RX_total[1].min,AVG72:element.RX_total[1].avg,MAX73:element.RX_total[2].max,MIN73:element.RX_total[2].min,AVG73:element.RX_total[2].avg,MAX74:element.RX_total[3].max,MIN74:element.RX_total[3].min,AVG74:element.RX_total[3].avg,MAX75:element.RX_total[4].max,MIN75:element.RX_total[4].min,AVG75:element.RX_total[4].avg,MAX76:element.RX_total[5].max,MIN76:element.RX_total[5].min,AVG76:element.RX_total[5].avg,
          MAX81:element.RX_error[0].max,MIN81:element.RX_error[0].min,AVG81:element.RX_error[0].avg,MAX82:element.RX_error[1].max,MIN82:element.RX_error[1].min,AVG82:element.RX_error[1].avg,MAX83:element.RX_error[2].max,MIN83:element.RX_error[2].min,AVG83:element.RX_error[2].avg,MAX84:element.RX_error[3].max,MIN84:element.RX_error[3].min,AVG84:element.RX_error[3].avg,MAX85:element.RX_error[4].max,MIN85:element.RX_error[4].min,AVG85:element.RX_error[4].avg,MAX86:element.RX_error[5].max,MIN86:element.RX_error[5].min,AVG86:element.RX_error[5].avg
        }

      )
      
    });
    
  
    let filename = "Logfile_"+Date.now()
    var end = new Date().getTime();
    // global.webhooklogfile(jsonResult.length,end-start)
    const csv = parse(csvResult);

    log.warn(`Logfile ${jsonResult.length} files :::: Time ${end-start} ms :::: SUCCESS !!`)

    var datafile = new FormData();
    
    datafile.append('file',csv, 'filename.csv');

    let settings = { headers: { 'content-type': 'multipart/form-data' } }
    var fetch = require('node-fetch')
    
    fetch(`${LOCALHOST}python/upload`, {
      method: 'POST',
      body: datafile
    }).then(response => response.json())
    .catch(error => console.error('Error:', error))
    .then(function(response){
      res.setHeader('Content-disposition', 'attachment; filename='+filename+'.csv');
      res.set('Content-Type', 'text/csv');
      res.status(200).send(response.data);
    });

    // res.setHeader('Content-disposition', 'attachment; filename='+filename+'.csv');
    // res.set('Content-Type', 'text/csv');
    // res.status(200).send(csv);

    // global.HTTPSTATUS(res,200,null,jsonResult)
  } catch (error) {
    // global.webhookdiscord(req,`${error}`,'error')
    log.error("Something went wrong:", error)
    global.HTTPSTATUS(res,404,null,{lastfile:lastfileProcess,text:error})
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


http.createServer(app).listen(80, () => log.info(`RESTful API server started on: 80 :::: Server listening`));
