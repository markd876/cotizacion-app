const yahooStockAPI  = require('yahoo-stock-api');
const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')
/* let spanValorV = document.querySelector('#spanDolarBlueVenta')
let spanValorC = document.querySelector('#spanDolarBlueCompra') */
const express = require('express');
const { response } = require('express');
const { isNumberObject } = require('util/types');
const app = express()
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Settings

app.set('port', 5000)
app.set('view engine', 'ejs')

app.listen(3000, () =>{
    console.log('server iniciado en puerto 3000')
})
app.get('/', (req, res) =>{
    res.render('index.ejs', {dolares: dolares, stocks: stocks})
})
app.use(express.static('public'))
app.use(express.static('images'))



let dolares = {}
let cotdolarBna 
let blue
async function getDolares(){
    await fetch('https://mercados.ambito.com//dolarnacion//variacion')
        .then(async(response) =>{
            return await response.json()
        }).then((resp) =>{
            let respCompCom = resp.compra.replace(/['"]+/g, '')
            let respVentCom = resp.venta.replace(/['"]+/g, '')
            bna = {
                bna : {
                    nombre : 'Dolar Banco Nacion',
                    compra : resp.compra,
                    venta : resp.venta,
                    variacion : resp.variacion,
                    spread : parseInt(respVentCom) - parseInt(respCompCom)
                }
            }
            Object.assign(dolares, bna)
        })
    await fetch('https://mercados.ambito.com//dolarahorro/variacion')
        .then(async(response) =>{
            return await response.json()
        }).then((resp) =>{
            let respCompCom = resp.compra.replace(/['"]+/g, '')
            let respVentCom = resp.venta.replace(/['"]+/g, '')
            ahorro = {
                ahorro : {
                    nombre : 'Dolar Ahorro',
                    compra : resp.compra,
                    venta : resp.venta,
                    variacion : resp.variacion,
                    spread : parseInt(respVentCom) - parseInt(respCompCom)
                }
            }
            Object.assign(dolares, ahorro)
        })
    await fetch('https://mercados.ambito.com//dolarrava/mep/variacion')
        .then(async(response) =>{
            return await response.json()
        }).then((resp) =>{
            let respCompCom = resp.compra.replace(/['"]+/g, '')
            let respVentCom = resp.venta.replace(/['"]+/g, '')
            mep = {
                mep : {
                    nombre : 'Dolar MEP',
                    compra : resp.compra,
                    venta : resp.venta,
                    variacion : resp.variacion,
                    spread : parseInt(respVentCom) - parseInt(respCompCom)
                }
            }
            Object.assign(dolares, mep)
        })
    await fetch('https://mercados.ambito.com//dolarrava/cl/variacion')
        .then(async(response) =>{
            return await response.json()
        }).then((resp) =>{
            let respCompCom = resp.compra.replace(/['"]+/g, '')
            let respVentCom = resp.venta.replace(/['"]+/g, '')
            ccl = {
                ccl : {
                    nombre : 'Dolar CCL',
                    compra : resp.compra,
                    venta : resp.venta,
                    variacion : resp.variacion,
                    spread : parseInt(respVentCom) - parseInt(respCompCom)
                }
            }
            Object.assign(dolares, ccl)
        })
    await fetch('https://mercados.ambito.com//dolar/informal/variacion')
        .then(async(response) =>{
            return await response.json()
        }).then((resp) =>{
            let respCompCom = resp.compra.replace(/['"]+/g, '')
            let respVentCom = resp.venta.replace(/['"]+/g, '')
            blue = {
                blue : {
                    nombre : 'Dolar Blue',
                    compra : resp.compra,
                    venta : resp.venta,
                    variacion : resp.variacion,
                    spread : parseInt(respVentCom) - parseInt(respCompCom)
                }
            }
            Object.assign(dolares, blue)
        })
    await fetch('https://mercados.ambito.com//dolarturista/variacion')
        .then(async(response) =>{
            return await response.json()
        }).then((resp) =>{
            let respCompCom = resp.compra.replace(/['"]+/g, '')
            let respVentCom = resp.venta.replace(/['"]+/g, '')
            turista = {
                turista : {
                    nombre : 'Dolar Turista',
                    compra : resp.compra,
                    venta : resp.venta,
                    variacion : resp.variacion,
                    spread : parseInt(respVentCom) - parseInt(respCompCom)
                }
            }
            Object.assign(dolares, turista)
            console.log(dolares)
        })
}
/* setInterval(function(){
    getDolares()
    console.log('actualizado')
}, 30000) */


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
async function getAllStocksArg(){
    await Promise.all([getAluarStock(),getBbarStock(),getBmaStock(),getBymaStock(),getCepuStock(),getComeStock(),getCresStock(),getCvhStock(),getGgalStock(),getEdnStock(),getValoStock(),getMirgStock(),getHargStock(),getLomaStock(),getPampStock(),getRichStock(),getSupvStock(),getTecoStock(),getTgnoStock(),getTgsuStock(),getTranStock(),getTxarStock(),getYpfdStock()])
    async function getAluarStock(){
        await axios('https://finance.yahoo.com/quote/ALUA.BA')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            stockPrice = $(`fin-streamer[data-symbol="ALUA.BA"]`,html).first().text()
            stockPriceChange = $(`fin-streamer[data-symbol="ALUA.BA"][data-field="regularMarketChange"]`,html).first().text()
            stockChange = $(`fin-streamer[data-symbol="ALUA.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
            let stockChangeAct = stockChange.replace(/[()]+/g, '')
            alua = {
                aluar : {
                    ticker : 'ALUA',
                    nombre : 'Aluar Aluminio Argentino S.A.I.C.',
                    precio : stockPrice,
                    variacion : stockChangeAct,
                    variacionprec : stockPriceChange
                }
            }
            Object.assign(StocksArg, alua)
            console.log('1')
        }).catch((err)=>{
            console.error(err)
        })           
    }
    async function getBbarStock(){
        await axios('https://finance.yahoo.com/quote/BBAR.BA')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            stockPrice = $(`fin-streamer[data-symbol="BBAR.BA"]`,html).first().text()
            stockPriceChange = $(`fin-streamer[data-symbol="BBAR.BA"][data-field="regularMarketChange"]`,html).first().text()
            stockChange = $(`fin-streamer[data-symbol="BBAR.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
            let stockChangeAct = stockChange.replace(/[()]+/g, '')
            bbar = {
                bbar : {
                    ticker : 'BBAR',
                    nombre : 'Banco BBVA Argentina S.A.',
                    precio : stockPrice,
                    variacion : stockChangeAct,
                    variacionprec : stockPriceChange
                }
            }
            Object.assign(StocksArg, bbar)
            console.log('2')
        }).catch((err)=>{
            console.error(err)
        })
    }
    async function getBmaStock(){
        await axios('https://finance.yahoo.com/quote/BMA.BA')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            stockPrice = $(`fin-streamer[data-symbol="BMA.BA"]`,html).first().text()
            stockPriceChange = $(`fin-streamer[data-symbol="BMA.BA"][data-field="regularMarketChange"]`,html).first().text()
            stockChange = $(`fin-streamer[data-symbol="BMA.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
            let stockChangeAct = stockChange.replace(/[()]+/g, '')
            bma = {
                bma : {
                    ticker : 'BMA',
                    nombre : 'Banco Macro S.A. ',
                    precio : stockPrice,
                    variacion : stockChangeAct,
                    variacionprec : stockPriceChange
                }
            }
            Object.assign(StocksArg, bma)
            console.log('3')
        }).catch((err)=>{
            console.error(err)
        })
    }
    async function getBymaStock(){
        await axios('https://finance.yahoo.com/quote/BYMA.BA')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            stockPrice = $(`fin-streamer[data-symbol="BYMA.BA"]`,html).first().text()
            stockPriceChange = $(`fin-streamer[data-symbol="BYMA.BA"][data-field="regularMarketChange"]`,html).first().text()
            stockChange = $(`fin-streamer[data-symbol="BYMA.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
            let stockChangeAct = stockChange.replace(/[()]+/g, '')
            byma = {
                byma : {
                    ticker : 'BYMA',
                    nombre : 'Bolsas y Mercados Argentinos S.A.',
                    precio : stockPrice,
                    variacion : stockChangeAct,
                    variacionprec : stockPriceChange
                }
            }
            Object.assign(StocksArg, byma)
            console.log('4')
        }).catch((err)=>{
            console.error(err)
        })
    }
    async function getCepuStock(){
        await axios('https://finance.yahoo.com/quote/CEPU.BA')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            stockPrice = $(`fin-streamer[data-symbol="CEPU.BA"]`,html).first().text()
            stockPriceChange = $(`fin-streamer[data-symbol="CEPU.BA"][data-field="regularMarketChange"]`,html).first().text()
            stockChange = $(`fin-streamer[data-symbol="CEPU.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
            let stockChangeAct = stockChange.replace(/[()]+/g, '')
            cepu = {
                cepu : {
                    ticker : 'CEPU',
                    nombre : 'Central Puerto S.A.',
                    precio : stockPrice,
                    variacion : stockChangeAct,
                    variacionprec : stockPriceChange
                }
            }
            Object.assign(StocksArg, cepu)
            console.log('5')
        }).catch((err)=>{
            console.error(err)
        })
    }
    async function getComeStock(){
        await axios('https://finance.yahoo.com/quote/COME.BA')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            stockPrice = $(`fin-streamer[data-symbol="COME.BA"]`,html).first().text()
            stockPriceChange = $(`fin-streamer[data-symbol="COME.BA"][data-field="regularMarketChange"]`,html).first().text()
            stockChange = $(`fin-streamer[data-symbol="COME.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
            let stockChangeAct = stockChange.replace(/[()]+/g, '')
            come = {
                come : {
                    ticker : 'COME',
                    nombre : 'Sociedad Comercial del Plata S.A.',
                    precio : stockPrice,
                    variacion : stockChangeAct,
                    variacionprec : stockPriceChange
                }
            }
            Object.assign(StocksArg, come)
            console.log('6')
        }).catch((err)=>{
            console.error(err)
        })
    }
    async function getCresStock(){
        await axios('https://finance.yahoo.com/quote/CRES.BA')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            stockPrice = $(`fin-streamer[data-symbol="CRES.BA"]`,html).first().text()
            stockPriceChange = $(`fin-streamer[data-symbol="CRES.BA"][data-field="regularMarketChange"]`,html).first().text()
            stockChange = $(`fin-streamer[data-symbol="CRES.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
            let stockChangeAct = stockChange.replace(/[()]+/g, '')
            cres = {
                cres : {
                    ticker : 'CRES',
                    nombre : 'Cresud Sociedad Anónima, Comercial, Inmobiliaria, Financiera y Agropecuaria',
                    precio : stockPrice,
                    variacion : stockChangeAct,
                    variacionprec : stockPriceChange
                }
            }
            Object.assign(StocksArg, cres)
            console.log('7')
        }).catch((err)=>{
            console.error(err)
        })
    }
    async function getCvhStock(){
        await axios('https://finance.yahoo.com/quote/CVH.BA')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            stockPrice = $(`fin-streamer[data-symbol="CVH.BA"]`,html).first().text()
            stockPriceChange = $(`fin-streamer[data-symbol="CVH.BA"][data-field="regularMarketChange"]`,html).first().text()
            stockChange = $(`fin-streamer[data-symbol="CVH.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
            let stockChangeAct = stockChange.replace(/[()]+/g, '')
            cvh = {
                cvh : {
                    ticker : 'CVH',
                    nombre : 'Cablevisión Holding S.A.',
                    precio : stockPrice,
                    variacion : stockChangeAct,
                    variacionprec : stockPriceChange
                }
            }
            Object.assign(StocksArg, cvh)
            console.log('8')
        }).catch((err)=>{
            console.error(err)
        })
    }
    async function getGgalStock(){
        await axios('https://finance.yahoo.com/quote/GGAL.BA')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            stockPrice = $(`fin-streamer[data-symbol="GGAL.BA"]`,html).first().text()
            stockPriceChange = $(`fin-streamer[data-symbol="GGAL.BA"][data-field="regularMarketChange"]`,html).first().text()
            stockChange = $(`fin-streamer[data-symbol="GGAL.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
            let stockChangeAct = stockChange.replace(/[()]+/g, '')
            ggal = {
                ggal : {
                    ticker : 'GGAL',
                    nombre : 'Grupo Financiero Galicia S.A.',
                    precio : stockPrice,
                    variacion : stockChangeAct,
                    variacionprec : stockPriceChange
                }
            }
            Object.assign(StocksArg, ggal)
            console.log('9')
        }).catch((err)=>{
            console.error(err)
        })
    }
    async function getEdnStock(){
        await axios('https://finance.yahoo.com/quote/EDN.BA')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            stockPrice = $(`fin-streamer[data-symbol="EDN.BA"]`,html).first().text()
            stockPriceChange = $(`fin-streamer[data-symbol="EDN.BA"][data-field="regularMarketChange"]`,html).first().text()
            stockChange = $(`fin-streamer[data-symbol="EDN.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
            let stockChangeAct = stockChange.replace(/[()]+/g, '')
            edn = {
                edn : {
                    ticker : 'EDN',
                    nombre : 'Empresa Distribuidora y Comercializadora Norte Sociedad Anónima',
                    precio : stockPrice,
                    variacion : stockChangeAct,
                    variacionprec : stockPriceChange
                }
            }
            Object.assign(StocksArg, edn)
            console.log('10')
        }).catch((err)=>{
            console.error(err)
        })
    }
    async function getValoStock(){
        await axios('https://finance.yahoo.com/quote/VALO.BA')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            stockPrice = $(`fin-streamer[data-symbol="VALO.BA"]`,html).first().text()
            stockPriceChange = $(`fin-streamer[data-symbol="VALO.BA"][data-field="regularMarketChange"]`,html).first().text()
            stockChange = $(`fin-streamer[data-symbol="VALO.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
            let stockChangeAct = stockChange.replace(/[()]+/g, '')
            valo = {
                valo : {
                    ticker : 'VALO',
                    nombre : 'Banco de Valores S.A.',
                    precio : stockPrice,
                    variacion : stockChangeAct,
                    variacionprec : stockPriceChange
                }
            }
            Object.assign(StocksArg, valo)
            console.log('11')
        }).catch((err)=>{
            console.error(err)
        })
    }
    async function getMirgStock(){
        await axios('https://finance.yahoo.com/quote/MIRG.BA')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            stockPrice = $(`fin-streamer[data-symbol="MIRG.BA"]`,html).first().text()
            stockPriceChange = $(`fin-streamer[data-symbol="MIRG.BA"][data-field="regularMarketChange"]`,html).first().text()
            stockChange = $(`fin-streamer[data-symbol="MIRG.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
            let stockChangeAct = stockChange.replace(/[()]+/g, '')
            mirg = {
                mirg : {
                    ticker : 'MIRG',
                    nombre : 'Mirgor Sociedad Anónima, Comercial, Industrial, Financiera, Inmobiliaria y Agropecuaria',
                    precio : stockPrice,
                    variacion : stockChangeAct,
                    variacionprec : stockPriceChange
                }
            }
            Object.assign(StocksArg, mirg)
            console.log('12')
        }).catch((err)=>{
            console.error(err)
        })
    }
    async function getHargStock(){
        await axios('https://finance.yahoo.com/quote/HARG.BA')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            stockPrice = $(`fin-streamer[data-symbol="HARG.BA"]`,html).first().text()
            stockPriceChange = $(`fin-streamer[data-symbol="HARG.BA"][data-field="regularMarketChange"]`,html).first().text()
            stockChange = $(`fin-streamer[data-symbol="HARG.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
            let stockChangeAct = stockChange.replace(/[()]+/g, '')
            harg = {
                harg : {
                    ticker : 'HARG',
                    nombre : 'Holcim (Argentina) S.A.',
                    precio : stockPrice,
                    variacion : stockChangeAct,
                    variacionprec : stockPriceChange
                }
            }
            Object.assign(StocksArg, harg)
            console.log('13')
        }).catch((err)=>{
            console.error(err)
        })
    }
    async function getLomaStock(){
        await axios('https://finance.yahoo.com/quote/LOMA.BA')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            stockPrice = $(`fin-streamer[data-symbol="LOMA.BA"]`,html).first().text()
            stockPriceChange = $(`fin-streamer[data-symbol="LOMA.BA"][data-field="regularMarketChange"]`,html).first().text()
            stockChange = $(`fin-streamer[data-symbol="LOMA.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
            let stockChangeAct = stockChange.replace(/[()]+/g, '')
            loma = {
                loma : {
                    ticker : 'LOMA',
                    nombre : 'Loma Negra Compañía Industrial Argentina Sociedad Anónima',
                    precio : stockPrice,
                    variacion : stockChangeAct,
                    variacionprec : stockPriceChange
                }
            }
            Object.assign(StocksArg, loma)
            console.log('14')
        }).catch((err)=>{
            console.error(err)
        })
    }
    async function getPampStock(){
        await axios('https://finance.yahoo.com/quote/PAMP.BA')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            stockPrice = $(`fin-streamer[data-symbol="PAMP.BA"]`,html).first().text()
            stockPriceChange = $(`fin-streamer[data-symbol="PAMP.BA"][data-field="regularMarketChange"]`,html).first().text()
            stockChange = $(`fin-streamer[data-symbol="PAMP.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
            let stockChangeAct = stockChange.replace(/[()]+/g, '')
            pamp = {
                pamp : {
                    ticker : 'PAMP',
                    nombre : 'Pampa Energía S.A.',
                    precio : stockPrice,
                    variacion : stockChangeAct,
                    variacionprec : stockPriceChange
                }
            }
            Object.assign(StocksArg, pamp)
            console.log('15')
        }).catch((err)=>{
            console.error(err)
        })
    }
    async function getRichStock(){
        await axios('https://finance.yahoo.com/quote/RICH.BA')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            stockPrice = $(`fin-streamer[data-symbol="RICH.BA"]`,html).first().text()
            stockPriceChange = $(`fin-streamer[data-symbol="RICH.BA"][data-field="regularMarketChange"]`,html).first().text()
            stockChange = $(`fin-streamer[data-symbol="RICH.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
            let stockChangeAct = stockChange.replace(/[()]+/g, '')
            rich = {
                rich : {
                    ticker : 'RICH',
                    nombre : 'Laboratorios Richmond S.A.C.I.F.',
                    precio : stockPrice,
                    variacion : stockChangeAct,
                    variacionprec : stockPriceChange
                }
            }
            Object.assign(StocksArg, rich)
            console.log('16')
        }).catch((err)=>{
            console.error(err)
        })
    }
    async function getSupvStock(){
        await axios('https://finance.yahoo.com/quote/SUPV.BA')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            stockPrice = $(`fin-streamer[data-symbol="SUPV.BA"]`,html).first().text()
            stockPriceChange = $(`fin-streamer[data-symbol="SUPV.BA"][data-field="regularMarketChange"]`,html).first().text()
            stockChange = $(`fin-streamer[data-symbol="SUPV.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
            let stockChangeAct = stockChange.replace(/[()]+/g, '')
            supv = {
                supv : {
                    ticker : 'SUPV',
                    nombre : 'Grupo Supervielle S.A.',
                    precio : stockPrice,
                    variacion : stockChangeAct,
                    variacionprec : stockPriceChange
                }
            }
            Object.assign(StocksArg, supv)
            console.log('17')
        }).catch((err)=>{
            console.error(err)
        })
    }
    async function getTecoStock(){
        await axios('https://finance.yahoo.com/quote/TECO2.BA')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            stockPrice = $(`fin-streamer[data-symbol="TECO2.BA"]`,html).first().text()
            stockPriceChange = $(`fin-streamer[data-symbol="TECO2.BA"][data-field="regularMarketChange"]`,html).first().text()
            stockChange = $(`fin-streamer[data-symbol="TECO2.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
            let stockChangeAct = stockChange.replace(/[()]+/g, '')
            teco = {
                teco : {
                    ticker : 'TECO2',
                    nombre : 'Telecom Argentina S.A.',
                    precio : stockPrice,
                    variacion : stockChangeAct,
                    variacionprec : stockPriceChange
                }
            }
            Object.assign(StocksArg, teco)
            console.log('18')
        }).catch((err)=>{
            console.error(err)
        })
    }
    async function getTgnoStock(){
        await axios('https://finance.yahoo.com/quote/TGNO4.BA')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            stockPrice = $(`fin-streamer[data-symbol="TGNO4.BA"]`,html).first().text()
            stockPriceChange = $(`fin-streamer[data-symbol="TGNO4.BA"][data-field="regularMarketChange"]`,html).first().text()
            stockChange = $(`fin-streamer[data-symbol="TGNO4.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
            let stockChangeAct = stockChange.replace(/[()]+/g, '')
            tgno = {
                tgno : {
                    ticker : 'TGNO4',
                    nombre : 'Transportadora de Gas del Norte S.A.',
                    precio : stockPrice,
                    variacion : stockChangeAct,
                    variacionprec : stockPriceChange
                }
            }
            Object.assign(StocksArg, tgno)
            console.log('19')
        }).catch((err)=>{
            console.error(err)
        })
    }
    async function getTgsuStock(){
        await axios('https://finance.yahoo.com/quote/TGSU2.BA')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            stockPrice = $(`fin-streamer[data-symbol="TGSU2.BA"]`,html).first().text()
            stockPriceChange = $(`fin-streamer[data-symbol="TGSU2.BA"][data-field="regularMarketChange"]`,html).first().text()
            stockChange = $(`fin-streamer[data-symbol="TGSU2.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
            let stockChangeAct = stockChange.replace(/[()]+/g, '')
            tgsu = {
                tgsu : {
                    ticker : 'TGSU2',
                    nombre : 'Transportadora de Gas del Sur S.A.',
                    precio : stockPrice,
                    variacion : stockChangeAct,
                    variacionprec : stockPriceChange
                }
            }
            Object.assign(StocksArg, tgsu)
            console.log('20')
        }).catch((err)=>{
            console.error(err)
        })
    }
    async function getTranStock(){
        await axios('https://finance.yahoo.com/quote/TRAN.BA')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            stockPrice = $(`fin-streamer[data-symbol="TRAN.BA"]`,html).first().text()
            stockPriceChange = $(`fin-streamer[data-symbol="TRAN.BA"][data-field="regularMarketChange"]`,html).first().text()
            stockChange = $(`fin-streamer[data-symbol="TRAN.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
            let stockChangeAct = stockChange.replace(/[()]+/g, '')
            tran = {
                tran : {
                    ticker : 'TRAN',
                    nombre : 'Compañía de Transporte de Energía Eléctrica en Alta Tensión Transener S.A.',
                    precio : stockPrice,
                    variacion : stockChangeAct,
                    variacionprec : stockPriceChange
                }
            }
            Object.assign(StocksArg, tran)
            console.log('21')
        }).catch((err)=>{
            console.error(err)
        })
    }
    async function getTxarStock(){
        await axios('https://finance.yahoo.com/quote/TXAR.BA')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            stockPrice = $(`fin-streamer[data-symbol="TXAR.BA"]`,html).first().text()
            stockPriceChange = $(`fin-streamer[data-symbol="TXAR.BA"][data-field="regularMarketChange"]`,html).first().text()
            stockChange = $(`fin-streamer[data-symbol="TXAR.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
            let stockChangeAct = stockChange.replace(/[()]+/g, '')
            txar = {
                txar : {
                    ticker : 'TXAR',
                    nombre : 'Ternium Argentina S.A.',
                    precio : stockPrice,
                    variacion : stockChangeAct,
                    variacionprec : stockPriceChange
                }
            }
            Object.assign(StocksArg, txar)
            console.log('22')
        }).catch((err)=>{
            console.error(err)
        })
    }
    async function getYpfdStock(){
        await axios('https://finance.yahoo.com/quote/YPFD.BA')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)
            stockPrice = $(`fin-streamer[data-symbol="YPFD.BA"]`,html).first().text()
            stockPriceChange = $(`fin-streamer[data-symbol="YPFD.BA"][data-field="regularMarketChange"]`,html).first().text()
            stockChange = $(`fin-streamer[data-symbol="YPFD.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
            let stockChangeAct = stockChange.replace(/[()]+/g, '')
            ypfd = {
                ypfd : {
                    ticker : 'YPFD',
                    nombre : 'YPF Sociedad Anónima',
                    precio : stockPrice,
                    variacion : stockChangeAct,
                    variacionprec : stockPriceChange
                }
            }
            Object.assign(StocksArg, ypfd)
            console.log('23')
        }).catch((err)=>{
            console.error(err)
        })
    }

}
let stocks 
fs.readFile('./stocks.json','utf8',(err,data) =>{
    if(err){
        console.error(err)
    } else{
        stocks = JSON.parse(data)
    }
})
async function updateStocks(){
    await getAllStocksArg()
    console.log('updated')
    fs.writeFile('./stocks.json', JSON.stringify(StocksArg), err =>{
        if(err){
            console.error(err)
        }
    })
    fs.readFile('./stocks.json','utf8',(err,data) =>{
        if(err){
            console.error(err)
        } else{
            stocks = JSON.parse(data)
        }
    })

}
updateStocks()
getDolares()
setInterval(() => {
    getDolares()
    updateStocks() 
}, 120000);



/* function getValueStockARG(stock){
    let url = `https://finance.yahoo.com/quote/${stock}.BA`
    axios(url)
    .then(response => {
        let stockPrice = 0
        let valores = []
        const html = response.data
        const $ = cheerio.load(html)
        stockPrice = $(`fin-streamer[data-symbol="${stock}.BA"]`,html).first().text()
        stockPriceChange = $(`fin-streamer[data-symbol="${stock}.BA"][data-field="regularMarketChange"]`,html).first().text()
        stockChange = $(`fin-streamer[data-symbol="${stock}.BA"][data-field="regularMarketChangePercent"]`,html).first().text()
        console.log(`Empresa: ${stock}, Precio: ${stockPrice}, variacion: ${stockChange}, variacion de precio: ${stockPriceChange}` )
        async function getstock(){
            let infoStock = await yahooStockAPI.getSymbol(`${stock}.BA`)
            console.log(infoStock)
        }
        getstock()
        stockAct = {
            stock : {
                nombre : stock,
                VarPrec : stockPriceChange,
                varicacion : stockChange,
            }
        }
        Object.assign(StocksArg, stockAct)
        console.log(StocksArg)
    }).catch(err => console.error(err))
}

arrayStocks.map((stock) => {
    getValueStockARG(stock)    
}); */
