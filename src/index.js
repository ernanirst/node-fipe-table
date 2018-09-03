import DefaultFipeSDK from './default_fipe_sdk'
import { vehicleType } from './constants'

export default class FipeSDK extends DefaultFipeSDK {

  /**
   * Verifies if the desired brand is available
   * by FIPE's table
   * @param {String} typeOfVehicle The vehicle's
   * type: 'car', 'truck' or 'motor'
   * @param {String} brandName The vehicle's
   * brand name
   */
  isBrandSupported(typeOfVehicle, brandName) {
    return new Promise( (resolve, reject) => {
      this.fetchAvailableBrands(typeOfVehicle)
        .then( response => resolve(response.map( item => item.brand.toLowerCase() ).includes(brandName)) ) 
        .catch( err => reject(err) )
    })
  }

  /**
   * Find all models by brand name supported
   * by FIPE's table
   * @param {String} typeOfVehicle The vehicle's
   * type: 'car', 'truck' or 'motor'
   * @param {String} brandName The vehicle's
   * brand name
   */
  findModelsByBrand(typeOfVehicle, brandName) {
    return new Promise( async (resolve, reject) => {
      const brand = await this.fetchAvailableBrands(typeOfVehicle)
        .then( response => response.filter( item => item.brand.toLowerCase() === brandName)[0] )
        .catch( err => reject(err))
      const models = await this.fetchAvailableModelsByCode(typeOfVehicle, brand.code)
        .catch( err => reject(err))
      resolve(models)
    })
  }

}