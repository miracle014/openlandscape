/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'VM_DATA',
    {
      ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true
      },
      NAMEFILE: {
          type: DataTypes.STRING,
      },
      GROUPPRICE: {
          type: DataTypes.STRING(1),
      },
      CLUSTER_LABELS: {
          type: DataTypes.STRING(1),
      },
      MAX11: {
          type: DataTypes.DOUBLE,
      },
      MIN11: {
          type: DataTypes.DOUBLE,
      },
      AVG11: {
          type: DataTypes.DOUBLE,
      },
      MAX12: {
          type: DataTypes.DOUBLE,
      },
      MIN12: {
          type: DataTypes.DOUBLE,
      },
      AVG12: {
          type: DataTypes.DOUBLE,
      },
      MAX13: {
          type: DataTypes.DOUBLE,
      },
      MIN13: {
          type: DataTypes.DOUBLE,
      },
      AVG13: {
          type: DataTypes.DOUBLE,
      },
      MAX14: {
          type: DataTypes.DOUBLE,
      },
      MIN14: {
          type: DataTypes.DOUBLE,
      },
      AVG14: {
          type: DataTypes.DOUBLE,
      },
      MAX15: {
          type: DataTypes.DOUBLE,
      },
      MIN15: {
          type: DataTypes.DOUBLE,
      },
      AVG15: {
          type: DataTypes.DOUBLE,
      },
      MAX16: {
          type: DataTypes.DOUBLE,
      },
      MIN16: {
          type: DataTypes.DOUBLE,
      },
      AVG16: {
          type: DataTypes.DOUBLE,
      },
      MAX21: {
          type: DataTypes.DOUBLE,
      },
      MIN21: {
          type: DataTypes.DOUBLE,
      },
      AVG21: {
          type: DataTypes.DOUBLE,
      },
      MAX22: {
          type: DataTypes.DOUBLE,
      },
      MIN22: {
          type: DataTypes.DOUBLE,
      },
      AVG22: {
          type: DataTypes.DOUBLE,
      },
      MAX23: {
          type: DataTypes.DOUBLE,
      },
      MIN23: {
          type: DataTypes.DOUBLE,
      },
      AVG23: {
          type: DataTypes.DOUBLE,
      },
      MAX24: {
          type: DataTypes.DOUBLE,
      },
      MIN24: {
          type: DataTypes.DOUBLE,
      },
      AVG24: {
          type: DataTypes.DOUBLE,
      },
      MAX25: {
          type: DataTypes.DOUBLE,
      },
      MIN25: {
          type: DataTypes.DOUBLE,
      },
      AVG25: {
          type: DataTypes.DOUBLE,
      },
      MAX26: {
          type: DataTypes.DOUBLE,
      },
      MIN26: {
          type: DataTypes.DOUBLE,
      },
      AVG26: {
          type: DataTypes.DOUBLE,
      },
      MAX31: {
          type: DataTypes.DOUBLE,
      },
      MIN31: {
          type: DataTypes.DOUBLE,
      },
      AVG31: {
          type: DataTypes.DOUBLE,
      },
      MAX32: {
          type: DataTypes.DOUBLE,
      },
      MIN32: {
          type: DataTypes.DOUBLE,
      },
      AVG32: {
          type: DataTypes.DOUBLE,
      },
      MAX33: {
          type: DataTypes.DOUBLE,
      },
      MIN33: {
          type: DataTypes.DOUBLE,
      },
      AVG33: {
          type: DataTypes.DOUBLE,
      },
      MAX34: {
          type: DataTypes.DOUBLE,
      },
      MIN34: {
          type: DataTypes.DOUBLE,
      },
      AVG34: {
          type: DataTypes.DOUBLE,
      },
      MAX35: {
          type: DataTypes.DOUBLE,
      },
      MIN35: {
          type: DataTypes.DOUBLE,
      },
      AVG35: {
          type: DataTypes.DOUBLE,
      },
      MAX36: {
          type: DataTypes.DOUBLE,
      },
      MIN36: {
          type: DataTypes.DOUBLE,
      },
      AVG36: {
          type: DataTypes.DOUBLE,
      },
      MAX41: {
          type: DataTypes.DOUBLE,
      },
      MIN41: {
          type: DataTypes.DOUBLE,
      },
      AVG41: {
          type: DataTypes.DOUBLE,
      },
      MAX42: {
          type: DataTypes.DOUBLE,
      },
      MIN42: {
          type: DataTypes.DOUBLE,
      },
      AVG42: {
          type: DataTypes.DOUBLE,
      },
      MAX43: {
          type: DataTypes.DOUBLE,
      },
      MIN43: {
          type: DataTypes.DOUBLE,
      },
      AVG43: {
          type: DataTypes.DOUBLE,
      },
      MAX44: {
          type: DataTypes.DOUBLE,
      },
      MIN44: {
          type: DataTypes.DOUBLE,
      },
      AVG44: {
          type: DataTypes.DOUBLE,
      },
      MAX45: {
          type: DataTypes.DOUBLE,
      },
      MIN45: {
          type: DataTypes.DOUBLE,
      },
      AVG45: {
          type: DataTypes.DOUBLE,
      },
      MAX46: {
          type: DataTypes.DOUBLE,
      },
      MIN46: {
          type: DataTypes.DOUBLE,
      },
      AVG46: {
          type: DataTypes.DOUBLE,
      },
      MAX51: {
          type: DataTypes.DOUBLE,
      },
      MIN51: {
          type: DataTypes.DOUBLE,
      },
      AVG51: {
          type: DataTypes.DOUBLE,
      },
      MAX52: {
          type: DataTypes.DOUBLE,
      },
      MIN52: {
          type: DataTypes.DOUBLE,
      },
      AVG52: {
          type: DataTypes.DOUBLE,
      },
      MAX53: {
          type: DataTypes.DOUBLE,
      },
      MIN53: {
          type: DataTypes.DOUBLE,
      },
      AVG53: {
          type: DataTypes.DOUBLE,
      },
      MAX54: {
          type: DataTypes.DOUBLE,
      },
      MIN54: {
          type: DataTypes.DOUBLE,
      },
      AVG54: {
          type: DataTypes.DOUBLE,
      },
      MAX55: {
          type: DataTypes.DOUBLE,
      },
      MIN55: {
          type: DataTypes.DOUBLE,
      },
      AVG55: {
          type: DataTypes.DOUBLE,
      },
      MAX56: {
          type: DataTypes.DOUBLE,
      },
      MIN56: {
          type: DataTypes.DOUBLE,
      },
      AVG56: {
          type: DataTypes.DOUBLE,
      },
      MAX61: {
          type: DataTypes.DOUBLE,
      },
      MIN61: {
          type: DataTypes.DOUBLE,
      },
      AVG61: {
          type: DataTypes.DOUBLE,
      },
      MAX62: {
          type: DataTypes.DOUBLE,
      },
      MIN62: {
          type: DataTypes.DOUBLE,
      },
      AVG62: {
          type: DataTypes.DOUBLE,
      },
      MAX63: {
          type: DataTypes.DOUBLE,
      },
      MIN63: {
          type: DataTypes.DOUBLE,
      },
      AVG63: {
          type: DataTypes.DOUBLE,
      },
      MAX64: {
          type: DataTypes.DOUBLE,
      },
      MIN64: {
          type: DataTypes.DOUBLE,
      },
      AVG64: {
          type: DataTypes.DOUBLE,
      },
      MAX65: {
          type: DataTypes.DOUBLE,
      },
      MIN65: {
          type: DataTypes.DOUBLE,
      },
      AVG65: {
          type: DataTypes.DOUBLE,
      },
      MAX66: {
          type: DataTypes.DOUBLE,
      },
      MIN66: {
          type: DataTypes.DOUBLE,
      },
      AVG66: {
          type: DataTypes.DOUBLE,
      },
      MAX71: {
          type: DataTypes.DOUBLE,
      },
      MIN71: {
          type: DataTypes.DOUBLE,
      },
      AVG71: {
          type: DataTypes.DOUBLE,
      },
      MAX72: {
          type: DataTypes.DOUBLE,
      },
      MIN72: {
          type: DataTypes.DOUBLE,
      },
      AVG72: {
          type: DataTypes.DOUBLE,
      },
      MAX73: {
          type: DataTypes.DOUBLE,
      },
      MIN73: {
          type: DataTypes.DOUBLE,
      },
      AVG73: {
          type: DataTypes.DOUBLE,
      },
      MAX74: {
          type: DataTypes.DOUBLE,
      },
      MIN74: {
          type: DataTypes.DOUBLE,
      },
      AVG74: {
          type: DataTypes.DOUBLE,
      },
      MAX75: {
          type: DataTypes.DOUBLE,
      },
      MIN75: {
          type: DataTypes.DOUBLE,
      },
      AVG75: {
          type: DataTypes.DOUBLE,
      },
      MAX76: {
          type: DataTypes.DOUBLE,
      },
      MIN76: {
          type: DataTypes.DOUBLE,
      },
      AVG76: {
          type: DataTypes.DOUBLE,
      },
      MAX81: {
          type: DataTypes.DOUBLE,
      },
      MIN81: {
          type: DataTypes.DOUBLE,
      },
      AVG81: {
          type: DataTypes.DOUBLE,
      },
      MAX82: {
          type: DataTypes.DOUBLE,
      },
      MIN82: {
          type: DataTypes.DOUBLE,
      },
      AVG82: {
          type: DataTypes.DOUBLE,
      },
      MAX83: {
          type: DataTypes.DOUBLE,
      },
      MIN83: {
          type: DataTypes.DOUBLE,
      },
      AVG83: {
          type: DataTypes.DOUBLE,
      },
      MAX84: {
          type: DataTypes.DOUBLE,
      },
      MIN84: {
          type: DataTypes.DOUBLE,
      },
      AVG84: {
          type: DataTypes.DOUBLE,
      },
      MAX85: {
          type: DataTypes.DOUBLE,
      },
      MIN85: {
          type: DataTypes.DOUBLE,
      },
      AVG85: {
          type: DataTypes.DOUBLE,
      },
      MAX86: {
          type: DataTypes.DOUBLE,
      },
      MIN86: {
          type: DataTypes.DOUBLE,
      },
      AVG86: {
          type: DataTypes.DOUBLE,
      },
    },
    {
      timestamps: false,
      freezeTableName: true
    }
  );
};
