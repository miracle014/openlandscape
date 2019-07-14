import Sequelize from 'sequelize'
import log4js from 'log4js'
var log = log4js.getLogger("models")
export const sequelize = new Sequelize('mysql://root:plokij123654@mysql:3306/OPENLANDSCAPE', {
  logging: function (str) {
    log.debug(str)
  },
  define: {
    timestamps: false
  }
})
// test connections
sequelize.authenticate().then(() => {
  log.info('Connection has been established successfully.');
}).catch(err => {
  log.error('Unable to connect to the database:', err);
});

var VMDATA = sequelize.import('./VM_DATA')




export {
  VMDATA,

}