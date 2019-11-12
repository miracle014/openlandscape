import { AdminUsers, Section } from "../models";
import { TOKEN_SECRET } from "../config/constraint";
import ErrorHandler from "../middlewares/errorHandler";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import MFUAuth from "mfu-app-authentication";
import axios from "axios";
import passport from "passport";
import passportJWT from "passport-jwt";
import global from '../config/global/global';
import log4js from "log4js";
var log = log4js.getLogger("auth_ctrl");


var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOptions = {};
jwtOptions.secretOrKey = TOKEN_SECRET;
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  next(null, jwt_payload);
});

export var mypassport = passport.use(strategy);

export default class AuthenController {
  constructor(role = "appClient") {
    this.role = role;
  }
  

  adminAuthen = async (req, res, next) => {
    var { username, password } = req.body;
    try {
      var logonUser = await AdminUsers.findAll({
        where: {
          USERNAME: username,
          ADMIN_ACTIVE: 1
        }
      });
    } catch (e) {
      var err = new ErrorHandler("E5001", e);
      return next(err);
    }

    if (logonUser.length === 0) {
      var err = new ErrorHandler("E4040");
      return next(err);
    }

    if (!bcrypt.compareSync(password + "", logonUser[0].PASSWORD)) {
      var err = new ErrorHandler("E4010");
      return next(err);
    }

    var payload = {
      privateFlags: 0,
      fullname: `${logonUser[0].NAME} ${logonUser[0].SURNAME}`,
      email: logonUser[0].EMAIL,
      role: "admin"
    };

    var token = jwt.sign(payload, jwtOptions.secretOrKey);

    var resData = {
      message: "Authenticated",
      payload: {
        ...payload,
        token: token
      }
    };
    return res.json(resData);
  };

  sectionManagerAuthen = async (req, res, next) => {
    try {
      var logonUser = await Section.findAll({
        where: {
          SEC_USER: req.username,
          SEC_ACTIVE: 1
        }
      });
    } catch (e) {
      var err = new ErrorHandler("E5001", e);
      return next(err);
    }

    if (logonUser.length === 0) {
      var err = new ErrorHandler("E4040");
      return next(err);
    }

    if (!bcrypt.compareSync(password + "", logonUser[0].PASSWORD)) {
      var err = new ErrorHandler("E4010");
      return next(err);
    }

    var payload = {
      privateFlags: 0,
      name: logonUser[0].SEC_LEAD_NAME,
      email: logonUser[0].SEC_LEAD_EMAIL,
      tel: logonUser[0].SEC_LEAD_TEL,
      sec_title: logonUser[0].SEC_TITLE,
      sec_amphur: logonUser[0].SEC_AMPHUR,
      sec_id: logonUser[0].ID,
      role: "sectionManager"
    };

    var token = jwt.sign(payload, jwtOptions.secretOrKey);

    var resData = {
      message: "Authenticated",
      payload: {
        ...payload,
        token: token
      }
    };
    return res.json(resData);
  };

  unauthenticated = (req, res, next) => {
    var err = new ErrorHandler("E4010");
    next(err);
  };

  authorizeWithRoles = roles => {
    return (req, res, next) => {
      if (roles.length == 0) next();
      else if (roles.includes(req.user.role)) next();
      else {
        var err = new ErrorHandler("E4011");
        next(err);
      }
    };
  };
}
