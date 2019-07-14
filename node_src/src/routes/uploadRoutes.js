import express from 'express'
import UploadController from '../controllers/uploadControllers'
import multer from 'multer'

var uploadRouter = express.Router()
var UploadFile = new UploadController()

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

// FIXME: change database
uploadRouter.post('/csv',upload.any(),UploadFile.upload)

export default uploadRouter