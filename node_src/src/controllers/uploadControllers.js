import { VMDATA } from "../models";
var FormData = require('form-data');
const { parse } = require('json2csv');
import * as XLSX from 'xlsx'
import log4js from "log4js";
var log = log4js.getLogger("auth_ctrl");
import _ from 'lodash';
import global from '../config/global/global';
export default class UploadController {
  
  upload = async (req, res, next) => {
   
    let start = new Date().getTime();
    var jsonResult = []
    var lastfileProcess 
    var  groupprice = require('../config/global/csvjson.json');
    // console.log(groupprice);
    
    try {
      req.files.forEach(function(element,i) {
        const workbook = XLSX.readFile(req.files[i].path, {cellDates:true, cellNF: false, cellText:false})
        const sheet_name_list = workbook.SheetNames;
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
        
        
        let count ;
        VMDATA.count({
          where: {NAMEFILE:element.Info.Filename},
        }).then(function(count) {
            if(count == 0 ){
              VMDATA.create( {
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
              });
          }else{
            VMDATA.update( {
                GROUPPRICE:element.Info.Groupprice,
                MAX11:element.CPU_USAGE[0].max,MIN11:element.CPU_USAGE[0].min,AVG11:element.CPU_USAGE[0].avg,MAX12:element.CPU_USAGE[1].max,MIN12:element.CPU_USAGE[1].min,AVG12:element.CPU_USAGE[1].avg,MAX13:element.CPU_USAGE[2].max,MIN13:element.CPU_USAGE[2].min,AVG13:element.CPU_USAGE[2].avg,MAX14:element.CPU_USAGE[3].max,MIN14:element.CPU_USAGE[3].min,AVG14:element.CPU_USAGE[3].avg,MAX15:element.CPU_USAGE[4].max,MIN15:element.CPU_USAGE[4].min,AVG15:element.CPU_USAGE[4].avg,MAX16:element.CPU_USAGE[5].max,MIN16:element.CPU_USAGE[5].min,AVG16:element.CPU_USAGE[5].avg,
                MAX21:element.MEMORY_USAGE[0].max,MIN21:element.MEMORY_USAGE[0].min,AVG21:element.MEMORY_USAGE[0].avg,MAX22:element.MEMORY_USAGE[1].max,MIN22:element.MEMORY_USAGE[1].min,AVG22:element.MEMORY_USAGE[1].avg,MAX23:element.MEMORY_USAGE[2].max,MIN23:element.MEMORY_USAGE[2].min,AVG23:element.MEMORY_USAGE[2].avg,MAX24:element.MEMORY_USAGE[3].max,MIN24:element.MEMORY_USAGE[3].min,AVG24:element.MEMORY_USAGE[3].avg,MAX25:element.MEMORY_USAGE[4].max,MIN25:element.MEMORY_USAGE[4].min,AVG25:element.MEMORY_USAGE[4].avg,MAX26:element.MEMORY_USAGE[5].max,MIN26:element.MEMORY_USAGE[5].min,AVG26:element.MEMORY_USAGE[5].avg,
                MAX31:element.Disk_write[0].max,MIN31:element.Disk_write[0].min,AVG31:element.Disk_write[0].avg,MAX32:element.Disk_write[1].max,MIN32:element.Disk_write[1].min,AVG32:element.Disk_write[1].avg,MAX33:element.Disk_write[2].max,MIN33:element.Disk_write[2].min,AVG33:element.Disk_write[2].avg,MAX34:element.Disk_write[3].max,MIN34:element.Disk_write[3].min,AVG34:element.Disk_write[3].avg,MAX35:element.Disk_write[4].max,MIN35:element.Disk_write[4].min,AVG35:element.Disk_write[4].avg,MAX36:element.Disk_write[5].max,MIN36:element.Disk_write[5].min,AVG36:element.Disk_write[5].avg,
                MAX41:element.Disk_read[0].max,MIN41:element.Disk_read[0].min,AVG41:element.Disk_read[0].avg,MAX42:element.Disk_read[1].max,MIN42:element.Disk_read[1].min,AVG42:element.Disk_read[1].avg,MAX43:element.Disk_read[2].max,MIN43:element.Disk_read[2].min,AVG43:element.Disk_read[2].avg,MAX44:element.Disk_read[3].max,MIN44:element.Disk_read[3].min,AVG44:element.Disk_read[3].avg,MAX45:element.Disk_read[4].max,MIN45:element.Disk_read[4].min,AVG45:element.Disk_read[4].avg,MAX46:element.Disk_read[5].max,MIN46:element.Disk_read[5].min,AVG46:element.Disk_read[5].avg,
                MAX51:element.TX_total[0].max,MIN51:element.TX_total[0].min,AVG51:element.TX_total[0].avg,MAX52:element.TX_total[1].max,MIN52:element.TX_total[1].min,AVG52:element.TX_total[1].avg,MAX53:element.TX_total[2].max,MIN53:element.TX_total[2].min,AVG53:element.TX_total[2].avg,MAX54:element.TX_total[3].max,MIN54:element.TX_total[3].min,AVG54:element.TX_total[3].avg,MAX55:element.TX_total[4].max,MIN55:element.TX_total[4].min,AVG55:element.TX_total[4].avg,MAX56:element.TX_total[5].max,MIN56:element.TX_total[5].min,AVG56:element.TX_total[5].avg,
                MAX61:element.TX_error[0].max,MIN61:element.TX_error[0].min,AVG61:element.TX_error[0].avg,MAX62:element.TX_error[1].max,MIN62:element.TX_error[1].min,AVG62:element.TX_error[1].avg,MAX63:element.TX_error[2].max,MIN63:element.TX_error[2].min,AVG63:element.TX_error[2].avg,MAX64:element.TX_error[3].max,MIN64:element.TX_error[3].min,AVG64:element.TX_error[3].avg,MAX65:element.TX_error[4].max,MIN65:element.TX_error[4].min,AVG65:element.TX_error[4].avg,MAX66:element.TX_error[5].max,MIN66:element.TX_error[5].min,AVG66:element.TX_error[5].avg,
                MAX71:element.RX_total[0].max,MIN71:element.RX_total[0].min,AVG71:element.RX_total[0].avg,MAX72:element.RX_total[1].max,MIN72:element.RX_total[1].min,AVG72:element.RX_total[1].avg,MAX73:element.RX_total[2].max,MIN73:element.RX_total[2].min,AVG73:element.RX_total[2].avg,MAX74:element.RX_total[3].max,MIN74:element.RX_total[3].min,AVG74:element.RX_total[3].avg,MAX75:element.RX_total[4].max,MIN75:element.RX_total[4].min,AVG75:element.RX_total[4].avg,MAX76:element.RX_total[5].max,MIN76:element.RX_total[5].min,AVG76:element.RX_total[5].avg,
                MAX81:element.RX_error[0].max,MIN81:element.RX_error[0].min,AVG81:element.RX_error[0].avg,MAX82:element.RX_error[1].max,MIN82:element.RX_error[1].min,AVG82:element.RX_error[1].avg,MAX83:element.RX_error[2].max,MIN83:element.RX_error[2].min,AVG83:element.RX_error[2].avg,MAX84:element.RX_error[3].max,MIN84:element.RX_error[3].min,AVG84:element.RX_error[3].avg,MAX85:element.RX_error[4].max,MIN85:element.RX_error[4].min,AVG85:element.RX_error[4].avg,MAX86:element.RX_error[5].max,MIN86:element.RX_error[5].min,AVG86:element.RX_error[5].avg
            },{ where:{NAMEFILE:element.Info.Filename}});
          }
        });
        
        
        
        
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
      
      fetch(`${global.env().global.HOST}python/upload`, {
        method: 'POST',
        body: datafile
      }).then(response => response.json())
      .catch(error => console.error('Error:', error))
      .then(function(response){
        response = JSON.parse(response)
        console.log(response);
        response.forEach(element => {
          VMDATA.update( {
            CLUSTER_LABELS:element.ClusterLabels,
    
        },{ where:{NAMEFILE:element.NAMEFILE}});
        });
        res.status(200).json(response);
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
  };
}

function diff_hours(dt2, dt1) 
 {
   console.log(dt2, dt1);
   
  dt2 = new Date(dt2)
  dt1 = new Date(dt1)
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60);
  return Math.abs(Math.round(diff));
  
 }