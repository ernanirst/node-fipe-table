import DefaultFipeSDK from './default_fipe_sdk'
import { vehicleType } from './constants'

export default class FipeSDK extends DefaultFipeSDK {

  /**
   * Verifies if the desired brand is available
   * at FIPE's table
   * @param {String} typeOfVehicle The vehicle's
   * type: 'car', 'truck' or 'motor'
   * @param {String} brandName The vehicle's
   * brand name
   */
  isBrandSupported(typeOfVehicle, brandName) {
    return new Promise( (resolve, reject) => {
      this.fetchAvailableBrands(typeOfVehicle, null)
        .then( response => resolve(response.map( item => item.brand.toLowerCase() ).includes(brandName)) ) 
        .catch( err => reject(err) )
    })
  }

}