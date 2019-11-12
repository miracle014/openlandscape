import { VMDATA } from "../models";
import global from '../config/global/global';
import conn from "../shared/connection";
export default class VMController {
  
 /**
  @api {get} /vm GetAllVM
  @apiName GetVM
  @apiVersion 1.0.0
  @apiGroup VM
  @apiDescription แสดงข้อมูล VM
  @apiSuccessExample Success-Response:
      HTTP/1.1 200 OK
      {
        "STATUS": 200,
        "MESSAGE": "OK",
        "DATA": [
                  {
                      "ID": 1,
                      "NAMEFILE": "fe26361e-03c5-4e81-8191-d9377667f3b7",
                      "GROUPPRICE": "A"
                  },
                  {
                      "ID": 2,
                      "NAMEFILE": "fc92f37b-ccc1-4fb9-adca-dd41b0d8623b",
                      "GROUPPRICE": "A"
                  },
                ]
      }
 */

  findAll = async (req, res, next) => {
    const data = await VMDATA.findAll({
      attributes: ['ID', 'NAMEFILE','GROUPPRICE']
    })
    global.HTTPSTATUS(res,200,null,data)
  }
  
  findById = async (req, res, next) => {
    const data = await VMDATA.findOne({where:{ID:req.params.id}})
    global.HTTPSTATUS(res,200,null,data)
  }

  findDataAll = async (req, res, next) => {
    let data =[];
    
    let sqlStringMax = "SELECT MAX(CLUSTER_LABELS+1) AS MAX FROM OPENLANDSCAPE.VM_DATA;";
      let max = await conn.query(sqlStringMax);
     for (let i = 0; i < max[0].MAX; i++) {
      let sqlString = "SELECT GROUPPRICE AS name,count(GROUPPRICE) AS value FROM OPENLANDSCAPE.VM_DATA WHERE CLUSTER_LABELS=? group by GROUPPRICE;";
      let count = await conn.query(sqlString, [i]);

      let sqlString2 = "  SELECT ID, NAMEFILE, GROUPPRICE, CLUSTER_LABELS FROM OPENLANDSCAPE.VM_DATA where CLUSTER_LABELS = ? order by GROUPPRICE asc;";
      let result = await conn.query(sqlString2, [i]);
      
      let DataCluster = {info:count,data:result}
      data.push(DataCluster)

     }
    
    global.HTTPSTATUS(res,200,null,data)
  }

  downloadCSV = async (req, res, next) => {
    const { Parser } = require('json2csv');
    const fields = ['ID','NAMEFILE','GROUPPRICE','CLUSTER_LABELS','MAX11','MIN11','AVG11','MAX12','MIN12','AVG12','MAX13','MIN13','AVG13','MAX14','MIN14','AVG14','MAX15','MIN15','AVG15','MAX16','MIN16','AVG16','MAX21','MIN21','AVG21','MAX22','MIN22','AVG22','MAX23','MIN23','AVG23','MAX24','MIN24','AVG24','MAX25','MIN25','AVG25','MAX26','MIN26','AVG26','MAX31','MIN31','AVG31','MAX32','MIN32','AVG32','MAX33','MIN33','AVG33','MAX34','MIN34','AVG34','MAX35','MIN35','AVG35','MAX36','MIN36','AVG36','MAX41','MIN41','AVG41','MAX42','MIN42','AVG42','MAX43','MIN43','AVG43','MAX44','MIN44','AVG44','MAX45','MIN45','AVG45','MAX46','MIN46','AVG46','MAX51','MIN51','AVG51','MAX52','MIN52','AVG52','MAX53','MIN53','AVG53','MAX54','MIN54','AVG54','MAX55','MIN55','AVG55','MAX56','MIN56','AVG56','MAX61','MIN61','AVG61','MAX62','MIN62','AVG62','MAX63','MIN63','AVG63','MAX64','MIN64','AVG64','MAX65','MIN65','AVG65','MAX66','MIN66','AVG66','MAX71','MIN71','AVG71','MAX72','MIN72','AVG72','MAX73','MIN73','AVG73','MAX74','MIN74','AVG74','MAX75','MIN75','AVG75','MAX76','MIN76','AVG76','MAX81','MIN81','AVG81','MAX82','MIN82','AVG82','MAX83','MIN83','AVG83','MAX84','MIN84','AVG84','MAX85','MIN85','AVG85','MAX86','MIN86','AVG86'];
    const opts = { fields };
    const parser = new Parser(opts);
    var data = await VMDATA.findAll()
    const csv = parser.parse(data);
    let filename = "Logfile_"+Date.now()
    res.setHeader('Content-disposition', 'attachment; filename='+filename+'.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csv);
  }

}
