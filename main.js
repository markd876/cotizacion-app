const yahooStockAPI  = require('yahoo-stock-api');
const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')
require('dotenv').config()
/* let spanValorV = document.querySelector('#spanDolarBlueVenta')
let spanValorC = document.querySelector('#spanDolarBlueCompra') */
const express = require('express');
const { response } = require('express');
const { isNumberObject } = require('util/types');
const app = express()
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Settings

app.set('port', process.env.HTTP_PORT)
app.set('view engine', 'ejs')

app.listen(process.env.HTTP_PORT, () =>{
    console.log(`server iniciado en puerto ${process.env.HTTP_PORT}`)
})
app.get('/', (req, res) =>{
    res.render('index.ejs', {dolares: dolares, stocks: stocks})
})
app.use(express.static('public'))
app.use(express.static('images'))
app.use(express.static('index.html'))

let stocks 
fs.readFile('./stocks.json','utf8',(err,data) =>{
    if(err){
        console.error(err)
    } else{
        stocks = JSON.parse(data)
    }
})
fs.readFile('./dolares.json','utf8',(err,data) =>{
    if(err){
        console.error(err)
    } else{
        dolares = JSON.parse(data)
    }
})







let dolares = {}

let arrayStocks = [
    'ALUA',
    'BBAR',
    'BMA',
    'BYMA',
    'CEPU',
    'COME',
    'CRES',
    'CVH',
    'GGAL',
    'EDN',
    'VALO',
    'HARG',
    'LOMA',
    'MIRG',
    'PAMP',
    'RICH',
    'SUPV',
    'TECO2',
    'TGNO4',
    'TGSU2',
    'TRAN',
    'TXAR',
    'YPFD'
]
let StocksArg = {}


