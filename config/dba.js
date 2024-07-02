import  { Sequelize } from 'sequelize' //orm
import dotenv from 'dotenv'
//cargamos las variables de entorno en process.env
dotenv.config({path:'.env'})
//inicializacion de nuestro ORM
const db = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASS ?? '',{
host:process.env.DB_HOST,
port:3306,
dialect:'mysql',
define:{
    timestamps:true
},
pool: {
    max: 5, // Número máximo de conexiones en el pool
    min: 0, // Número mínimo de conexiones en el pool
    acquire: 30000, // Tiempo máximo, en milisegundos, que el pool intentará obtener una conexión antes de lanzar un error
    idle: 10000, // Tiempo máximo, en milisegundos, que una conexión puede estar inactiva antes de ser liberada
  },
    operatorsAliases:false
});

export default db;