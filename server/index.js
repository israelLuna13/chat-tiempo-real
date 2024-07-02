import express from 'express'
import logger from 'morgan'

import {Server} from 'socket.io'
import {createServer} from 'node:http'
import db from '../config/dba.js'
import Mensajes from '../models/Messages.js'

const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
////creamos una instancia de Server de socket.io y lo enlazamos con el servidor http

const io = new Server(server,{
    //es una opcion de recuperacion de estado
    connectionStateRecovery:{}
})


//conexion a la base de datps 
try{
    await db.authenticate();
    db.sync()
    console.log('Conexion Correcta a la base de datos')
    }catch(error){
        console.log(error)
    
    }

    //manejo de conexiones 
  //cada vez que un usuario de conecta  
io.on('connection',async(socket)=>{
    console.log(' a user has connected!');

    //cuando un usuario se desconecta
    socket.on('disconnect', ()=>{
        console.log('an user has disconnect');
    });
//maneja el evento de recibir un mensaje
    socket.on('chat message', async(msg)=>{
        
   let chat , lastMessage
   //recuperamos el usuario que se genero de manera aleatorioa
   const username = socket.handshake.auth.username ?? 'anonymous'
  try {
    //insertamos el mensaje y el usuario
    chat = await Mensajes.create({
      mensaje:msg,
      user:username
    });

    //obtenemos el ultimo mensaje
    lastMessage = await Mensajes.findOne({
        order: [['createdAt', 'DESC']]
      }); 

  } catch (error) {
    console.log(error);
  }
  //emitimos el mensaje a los clientes
    io.emit('chat message', msg, lastMessage.id.toString(), lastMessage.user)
    })

    //si el socket no ha sido recuperado 
    if(!socket.recovered){
        try {
            //recuperamos todos los mensajes desde el ultimo mensaje recibido por el cliente y los envia de nuevo
            const result = await Mensajes.findAll({
                where:{
                    id: socket.handshake.auth.serverOffset ?? 0
            }})
            result.forEach(row => {
                socket.emit('chat message', row.mensaje, row.id.toString(), row.user)
                
            });
        } catch (error) {
            console.log(error);
        }
    }
})

//registramos solicitudes http
app.use(logger('dev'))

app.get('/',(req,res)=>{
    res.sendFile(process.cwd() + '/client/index.html')
})
server.listen(port,()=>{
    console.log(`server on port ${port}`);
})