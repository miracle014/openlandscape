var e = [];
e['E0000'] = { message: 'Unexpected Error', status: 500 }
e['E4000'] = { message: 'Missing require query parameter', status: 400 }
e['E4001'] = { message: 'Missing require body parameter', status: 400 }
e['E4002'] = { message: 'This email is already registered', status: 400 }
e['E4003'] = { message: 'This username is already added', status: 400 }
e['E4010'] = { message: 'Unauthenticated', status: 401 }
e['E4011'] = { message: 'Unauthorized', status: 401 }
e['E4040'] = { message: 'Data Not found', status: 404 }
e['E4041'] = { message: 'URL Not found', status: 404 }
e['E4031'] = { message: 'Access denied for your request', status: 403 }
e['E5001'] = { message: 'Database query error', status: 500 }
e['E5002'] = { message: 'Unexpected error with MFU APIs', status: 500 }
e['E5003'] = { message: 'Unexpected error with Payment gateway', status: 500 }

export default class ErrorHandler extends Error {
  constructor(code = 'E0000', detail = null, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorHandler);
    }

    // Custom debugging information
    this.code = code;
    this.detail = (e[code]) ? detail : null
    this.status = (e[code]) ? e[code].status : 500
    this.message =(e[code]) ? e[code].message : 'Undefined Error code'
  }
}