import {DataTypes} from 'sequelize'
import db from '../config/dba.js'

const Mensaje = db.define('mensajes',{   
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        allowNull:false,
        primaryKey:true
      },
    mensaje:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    user:{
        type:DataTypes.TEXT,
        allowNull:false
    }
});

export default Mensaje;
