import DefaultFipeSDK from './default_fipe_sdk'

export class FipeSDK extends DefaultFipeSDK {

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
        .then( response => response.filter( item => item.brand.toLowerCase() === brandName.toLocaleLowerCase())[0] )
        .catch( err => reject(err))
      const models = await this.fetchAvailableModelsByCode(typeOfVehicle, brand.code)
        .catch( err => reject(err))
      resolve({ models, brandCode: brand.code })
    })
  }

  /**
   * Find all years by brand and model name
   * @param {String} typeOfVehicle The vehicle's
   * type: 'car', 'truck' or 'motor'
   * @param {String} brandName The vehicle's
   * brand name
   * @param {*} modelName The vehicle's model
   * name
   */
  findYearsByBrandAndModel(typeOfVehicle, brandName, modelName) {
    return new Promise( async (resolve, reject) => {
      const model = await this.findModelsByBrand(typeOfVehicle, brandName)
        .then( response => {
          const selectedModel = response.models
              .filter( item => item.model.toLowerCase() === modelName.toLocaleLowerCase())[0]
          return { brandCode: response.brandCode, model: selectedModel.model, code: selectedModel.code }
        })
        .catch( err => reject(err))
      const years = await this.fetchAvailableYearsByCode(typeOfVehicle, model.brandCode, model.code)
        .then(years => resolve({ brandCode: model.brandCode, modelCode: model.code, years }))
        .catch( err => reject(err))
    })
  }

  estimatePrice(typeOfVehicle, brandName, modelName, yearModel, fuelCode) {
    return new Promise( async (resolve, reject) => {
      const model = await this.findModelsByBrand(typeOfVehicle, brandName)
        .then( response => {
          const selectedModel = response.models
              .filter( item => item.model.toLowerCase() === modelName.toLocaleLowerCase())[0]
          return { brandCode: response.brandCode, model: selectedModel.model, code: selectedModel.code }
        })
        .catch( err => reject(err))
        
      const fipeEstimate = await this.fetchPriceByCode(typeOfVehicle, model.brandCode, model.code, yearModel, fuelCode)
        .then( response => resolve(response) )
        .catch( err => reject(err) )
    })
  }

}