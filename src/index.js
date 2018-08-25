import qs from 'qs'
import { fipeClient } from './config'
import { portugueseMonths, vehicleType } from './constants'

export default class FipeSDK {

  /**
   * Fetch the dates on which the research was done
   */
  fetchAvailableDate() {
    return new Promise( (resolve, reject) => {
      fipeClient.post('/ConsultarTabelaDeReferencia')
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
        .then( dates => resolve(dates[0]))
        .catch( err => reject(err))
    })
  }

  fetchAvailableBrandsByCode(typeOfVehicle, codeDate) {
    return new Promise( async (resolve, reject) => {
      const vehicleCode = vehicleType.indexOf(typeOfVehicle) + 1
      if (vehicleCode < 1 || vehicleCode > 3)
        reject({ message: `Type of vehicle [${typeOfVehicle}] must be 'car', 'truck' or 'motor'` })
      else if (codeDate && (!Number.isInteger(codeDate) || codeDate < 0))
        reject({ message: `Parameter codeDate must be a positive integer` })
      else {
        if (!codeDate)
          await this.fetchLatestAvailableDate()
            .then( date => codeDate = date.code)
            .catch( err => reject(err) )
        console.log('codeDate', codeDate)
        fipeClient.post('/ConsultarMarcas', 
          qs.stringify({ codigoTabelaReferencia: codeDate, codigoTipoVeiculo: vehicleCode })
        ).then( response => {
          if (response.status === 200) {
            resolve(response.data.map( item => { 
              return { brand: item.Label, code: item.Value }
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

}