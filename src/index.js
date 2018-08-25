import qs from 'qs'
import { fipeClient } from './config'
import { portugueseMonths } from './constants'

export default class FipeSDK {

  fetchAvailableMonths() {
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
  
}