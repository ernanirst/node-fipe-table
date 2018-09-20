import qs from 'qs'
import { deafultFipeClient } from './config'
import { portugueseMonths, vehicleType } from './constants'

export default class DefaultFipeSDK {
  constructor( axiosInstance ) {
    if (axiosInstance)
      this.fipeClient = axiosInstance
    else 
      this.fipeClient = deafultFipeClient
  }

  fetchAvailableDate() {
    return new Promise( (resolve, reject) => {
      this.fipeClient.post('/ConsultarTabelaDeReferencia')
        .then( response => {
          if (response.status === 200) {
            resolve(response.data.map( item => {
              const splitDate = item.Mes.split('/')
              const month = portugueseMonths.indexOf(splitDate[0])
              const year = Number(splitDate[1].trim())
              return { code: item.Codigo, month, year }
            }))
          }
          else 
            reject(response.data)
        })
        .catch( error => reject(error) )
    })
  }

  fetchLatestAvailableDate() {
    return new Promise( (resolve, reject) => {
      this.fetchAvailableDate()
        .then( dates => resolve(dates[0]) )
        .catch( err => reject(err) )
    })
  }

  fetchAvailableBrands(typeOfVehicle, codeDate) {
    return new Promise( async (resolve, reject) => {
      const vehicleCode = vehicleType.indexOf(typeOfVehicle) + 1
      if (vehicleCode < 1 || vehicleCode > 3)
        reject({ message: `Type of vehicle [${typeOfVehicle}] must be 'car', 'truck' or 'motor'` })
      else if (codeDate && !Number.isInteger(codeDate) && codeDate < 0)
        reject({ message: `Parameter codeDate must be a positive integer` })
      else {
        if (!codeDate)
          await this.fetchLatestAvailableDate()
            .then( date => codeDate = date.code)
            .catch( err => reject(err) )
        this.fipeClient.post('/ConsultarMarcas', qs.stringify({ codigoTabelaReferencia: codeDate, codigoTipoVeiculo: vehicleCode }))
          .then( response => {
          if (response.status === 200) {
            resolve(response.data.map( item => { 
              return { brand: item.Label, code: Number(item.Value) }
            }))
          } else {
            reject({ 
              status: response.status, 
              body: response.data, 
              message: 'Could not retrieve available brands' 
            })
          }
        })
        .catch( err => reject(err) )
      }
    })
  }

  fetchAvailableModelsByCode(typeOfVehicle, brandCode, dateCode) {
    return new Promise( async (resolve, reject) => {
      const vehicleCode = vehicleType.indexOf(typeOfVehicle) + 1
      if (vehicleCode < 1 || vehicleCode > 3)
        reject({ message: `Type of vehicle [${typeOfVehicle}] must be 'car', 'truck' or 'motor'` })
      if (!Number.isInteger(brandCode) || brandCode < 0) 
        reject({ message: `Parameter brandCode must be a positive integer: ${brandCode}` })
      if (dateCode && (!Number.isInteger(dateCode) || dateCode < 0))
        reject({ message: `Parameter dateCode must be a positive integer` })
      else {
        if (!dateCode)
          await this.fetchLatestAvailableDate()
            .then( date => dateCode = date.code)
            .catch( err => reject(err) )
        this.fipeClient.post('/ConsultarModelos', qs.stringify({ codigoTabelaReferencia: dateCode, codigoTipoVeiculo: vehicleCode, codigoMarca: brandCode }))
          .then( response => {
            if (response.status === 200 && response.data.Modelos) {
              resolve(response.data.Modelos.map( item => {
                return { model: item.Label, code: item.Value }
              }))
            } else {
              reject({ status: response.status, body: response.data, message: 'Could not retrieve available models' })
            }
          })
          .catch( err => reject(err) )
      }
    })
  }

  fetchAvailableYearsByCode(typeOfVehicle, brandCode, modelCode, dateCode) {
    return new Promise( async (resolve, reject) => {
      const vehicleCode = vehicleType.indexOf(typeOfVehicle) + 1
      if (vehicleCode < 1 || vehicleCode > 3)
        reject({ message: `Type of vehicle [${typeOfVehicle}] must be 'car', 'truck' or 'motor'` })
      if (!Number.isInteger(brandCode) || brandCode < 0) 
        reject({ message: `Parameter brandCode must be a positive integer: ${brandCode}` })
      if (!Number.isInteger(modelCode) || modelCode < 0) 
        reject({ message: `Parameter modelCode must be a positive integer: ${modelCode}` })  
      if (dateCode && (!Number.isInteger(dateCode) || dateCode < 0))
        reject({ message: `Parameter dateCode must be a positive integer` })
      else {
        if (!dateCode)
          await this.fetchLatestAvailableDate()
            .then( date => dateCode = date.code)
            .catch( err => reject(err) )
        this.fipeClient.post('/ConsultarAnoModelo', qs.stringify({ codigoTabelaReferencia: dateCode, codigoTipoVeiculo: vehicleCode, codigoMarca: brandCode, codigoModelo: modelCode }))
          .then( response => {
            if (response.status === 200) {
              resolve(response.data.map( item => {
                const splitCode = item.Value.split('-')
                return { name: item.Label, year: Number(splitCode[0]), fuelCode: splitCode[1] }
              }))
            } else {
              reject({ status: response.status, body: response.data, message: 'Could not retrieve available years' })
            }
          })
      }
    })
  }

  fetchPriceByCode(typeOfVehicle, brandCode, modelCode, year, fuelCode, dateCode) {
    return new Promise( async (resolve, reject) => {
      const vehicleCode = vehicleType.indexOf(typeOfVehicle) + 1
      if (vehicleCode < 1 || vehicleCode > 3)
        reject({ message: `Type of vehicle [${typeOfVehicle}] must be 'car', 'truck' or 'motor'` })
      if (!Number.isInteger(brandCode) || brandCode < 0) 
        reject({ message: `Parameter brandCode must be a positive integer` })
      if (!Number.isInteger(modelCode) || modelCode < 0) 
        reject({ message: `Parameter modelCode must be a positive integer` })  
      if (dateCode && (!Number.isInteger(dateCode) || dateCode < 0))
        reject({ message: `Parameter dateCode must be a positive integer` })
      if (year < 0) 
        reject({ message: `Parameter year must be a positive integer` })
      else {
        if (!dateCode)
          await this.fetchLatestAvailableDate()
            .then( date => dateCode = date.code)
            .catch( err => reject(err) )
        this.fipeClient.post('/ConsultarValorComTodosParametros', qs.stringify({ 
          codigoTabelaReferencia: dateCode, codigoTipoVeiculo: vehicleCode, 
          codigoMarca: brandCode, codigoModelo: modelCode, anoModelo: year, 
          codigoTipoCombustivel: fuelCode, tipoConsulta: 'tradicional'
        }))
          .then( response => {
            if (response.status === 200) {
              resolve({ price: this.brazilMoneyStringToNumber(response.data.Valor) })
            } else {
              reject( this.buildErrorResponse(response, 'Could not retrieve the estimated price') )
            }
          })
      }
    })
  }

  brazilMoneyStringToNumber(br_money) {
    return Number(
      br_money.replace('R$ ', '').replace('.', '').replace(',', '.')
    )
  }

  getVehicleCode(vehicleName) {
    return vehicleType.indexOf(typeOfVehicle) + 1
  } 

  buildErrorResponse(response, message) {
    return {
      status: response.status,
      body: response.data,
      message: message
    }
  }

}