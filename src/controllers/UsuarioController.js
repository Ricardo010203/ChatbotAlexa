const Usuario = require('../models/Usuario');
const moment = require('moment');
const {google} = require("googleapis");
const Convenio = require('./PlatoController');
const { Console } = require('console');
const qrcode = require('qrcode');
const { Client, MessageMedia, Buttons} = require('whatsapp-web.js');
const client = new Client()

client.setMaxListeners(50);
client.initialize();

const UsuarioController = {};

UsuarioController.index = async (req, res) => {
    const usuarios = await Usuario.get();
    // res.render('', {usuarios});
}

UsuarioController.create = async (req, res) => {
    res.render('usuario/usuario-create', {src: "https://acortar.link/VvEwpb"});
    const auth = new google.auth.GoogleAuth({
        keyFile: "credencialesSheet.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const cliente = await auth.getClient();

    // Instancia de googlesheets API
    const googleSheets = google.sheets({version: "v4",auth: cliente});
    const spreadsheetId = "15lLJBYCqYIMuCSHRFu2vgLRrmirn9ZuVMWF2zrlSy40";

    //leer columna numero
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Hoja 1!C:C"
    })
    //leer columna nombre
    const getRowsnom = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Hoja 1!A:A"
    })
    // leer columna convenio
    const getRowscon = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Hoja 1!B:B"
    })
    // leer columna correo
    const getRowscor = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Hoja 1!D:D"
    })
     // leer columna textoNOcon
     const getRowstxtno = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Hoja 1!E:E"
    })
    // leer columna asesor
    const getRowsase = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Hoja 1!F:F"
    })

const fs = require('fs');
const { ClientRequest } = require('http');


const country_code = '57';
const msg = '👋 Hola ';
const espac = ' ';  
const msg2 = ' soy *Alexa* tu *Asesor virtual* 🤖, gracias al convenio entre Davivienda y ';
const msgh2 = ' soy *Alexa* tu *Asesor virtual* 🤖, del banco Davivienda🏠. Este es un canal que el banco ha facilitado a nuestros clientes para que se mantengan informados de nuestros productos, es por eso que te invitamos a guardarnos en tus contactos \n\n🚨IMPORTANTE🚨\n\nEl día de hoy te informamos que: '
const msg4 = ' hemos habilitado este canal para informar a nuestros clientes sobre los servicios y beneficios que tenemos para ofrecerte.\n\n💡 Recuerda que por tu seguridad no vamos a solicitar fotos de tus productos, códigos ni claves personales. Tampoco se deben digitar en el chat datos sensibles como: números completos de tarjetas de crédito, fechas de vencimiento de estas o códigos de seguridad (CVV)';
const msg3 = '🔴Por favor responda con el número de la opción que necesitas o si prefieres puedes escribirme a mi correo '
const msg3_2 = '🔴Por favor responda con la letra de la opción que necesitas o si prefieres puedes escribirme a mi correo '
const msgg = ':\n\n*7. Finalizar conversación*\n*8.Iniciar Conversación para mayor información*';
const msgg2 = ':\n\na). Estoy interesado, deseo más información \nb). No estoy interesado';
const msg5 = '*El día de hoy te informamos sobre los siguientes productos:👇*';
const msg6 = '🙋‍♂️ *Recuerda que los asesores encargados del convenio son:* 🙋‍♀️'
const mediaFile = MessageMedia.fromFilePath('./img/unnamed.jpg')

for (let step = 1; step < 16; step++){
       
    let number = getRows.data.values[step];
    let nombre = getRowsnom.data.values[step]
    let convenio = getRowscon.data.values[step]
    let correo = getRowscor.data.values[step]
    let texto = getRowstxtno.data.values[step]
    let asesor = getRowsase.data.values[step]
    let mediaasesor = {}
    let url = ''
    let imagen = ''
    

    if(convenio == "NO"){
        imagen = Convenio.select(asesor)
        imagen.then( function (val){
        url = val[0].foto
        mediaasesor = MessageMedia.fromFilePath('./src/public/img/platos/'+url)
        })

        client.on('ready', () => {
            console.log('El cliente está listo.');
            let chadId = country_code + number + '@c.us';
            client.sendMessage(chadId , msg + nombre + msgh2 + texto)
            client.sendMessage(chadId, msg6)
            client.sendMessage(chadId, mediaasesor)
                     .then(response => {
                        if(response.id.fromMe){
                            console.log('El mensaje fue enviado');
                        }
                    })
            setTimeout(() => {client.sendMessage(chadId, msg3_2 + correo + msgg2)}, 3000)
        });
    }else if(convenio == "ASESOR"){
        client.on('ready', () => {
            console.log('El cliente está listo.');
            let chadId = country_code + number + '@c.us';
            client.sendMessage(chadId , msg + nombre + espac + texto)
        });
    }else{
        imagen = Convenio.select(convenio)
        imagen.then( function (val){
        url = val[0].foto
        mediaasesor = MessageMedia.fromFilePath('./src/public/img/platos/'+url)
        })
        client.on('ready', () => {
            console.log('El cliente está listo.');
            let chadId = country_code + number + '@c.us';
            client.sendMessage(chadId , msg + nombre + msg2 + convenio + msg4)
            client.sendMessage(chadId, msg5)
            client.sendMessage(chadId, mediaFile)
                    .then(response => {
                        if(response.id.fromMe){
                            console.log('El mensaje fue enviado');
                        }
                    })
            setTimeout(() => {client.sendMessage(chadId, msg6)}, 3000)
            setTimeout(() => {client.sendMessage(chadId, mediaasesor)},3000) 
            setTimeout(() => {client.sendMessage(chadId, msg3 + correo + msgg)}, 7000) 
                    
        });
    }

    
    console.log(number)
    }
}

UsuarioController.codigo = async(req, res) => {
   
    const generateQR = async text => {
        try{
         
          const qrco = await qrcode.toDataURL(text)
          console.log("se envió")
          res.send(qrco)
          

        }catch(err){
            console.log(err);
        }
    }
    
    client.on('qr', qr => {
        console.log("se generó");
        generateQR(qr)
    });

    client.on('ready', () => {
        console.log('el cliente está listo');
    })

}

module.exports = UsuarioController;