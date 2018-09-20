Node FIPE Table
=================

:blue_car: :minibus: :truck: Node SDK to retrive information about Brazil's vehicles prices

This SDK is result of a lot of try and error with the API used by FIPE's official website. The website is the only place where FIPE releases its data, therefore, nothing more convienient than a SDK to retrive data directly from the API used by the website.

WARNING: FIPE's API can change without notice, please run the examples to make sure it's working.

## Getting Started

Install the module with the classic:

`npm i --save fipe-table`

Now run the following sample to list all available dates on which the research was made

```javascript
import { FipeSDK } from 'fipe-table'

const fipeSDK = new FipeSDK()

fipeSDK.fetchAvailableDate()
  .then( date => console.log(date) )
```

You can list the available brands using the code of the date obtained on the previous sample

```javascript
import { FipeSDK } from 'fipe-table'

const fipeSDK = new FipeSDK()
const VEHICLE = 'car'
const codeDate = 130

fipeSDK.fetchAvailableBrands(VEHICLE, codeDate)
  .then( brands => console.log(brands) )
```

It's also possible to ommit the last argument to use the latest date of research

```javascript
import { FipeSDK } from 'fipe-table'

const fipeSDK = new FipeSDK()
const VEHICLE = 'car'

fipeSDK.fetchAvailableBrands(VEHICLE)
  .then( brands => console.log(brands) )
```

All the raw HTTP requests performed by this SDK are implemented on this [file](src/default_fipe_sdk.js), it will be usefull to explore all functions available.

There are also more high level functions available on the [index file](src/index.js). With these functions you can query using names, e.g.:

```javascript
import { FipeSDK } from 'fipe-table'

const fipeSDK = new FipeSDK()
const VEHICLE = 'car'

fipeSDK.findModelsByBrand(VEHICLE, 'Fiat')
  .then( models => console.log(models) )
```

And finally:

```javascript
import { FipeSDK } from 'fipe-table'

const fipeSDK = new FipeSDK()
const VEHICLE = 'car'

fipeSDK.estimatePrice(VEHICLE, 'Fiat', 'Palio 1.0 Cel. ECON./ITALIA F.Flex 8V 4p', 2014, 1)
  .then( price => console.log(price) )
```

Also, the `VEHICLE` argument can be one of: `'car'`, `'truck'`, `'motor'`.

If you would like to config `axios` yourself, you can pass the axios instance to the constructor as well. This will be usefull if any error handling for HTTP requests is desired, the sample below always retry when the `statusCode` of the request is not equal to 200.

```javascript
const axiosInstance = axios.create({
  baseURL: 'http://veiculos.fipe.org.br/api/veiculos/',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Referer': 'http://veiculos.fipe.org.br/'
  }
})

axiosInstance.interceptors.response.use(undefined, (err) => {
  if (err.status !== 200 && err.config) {
    return axios(err.config)
  }
  throw err
})

const fipeSDK = new FipeSDK( axiosInstance )
```

## About FIPE

FIPE is the Foundation Institute for Economic Research of the University of Sao Paulo. According to its website, it was founded in 1973 to support the University in the areas of education, projects, research and development of economic and financial indicators. Today, FIPE is one of Brazil's most prestigious developer of financial indicators, beign responsible for (among others) the "FIPE Table", which is an important indicator of the average vehicle prices, and the IPC (Consumer Price Index), which measures the inflation of the State of Sao Paulo. The FIPE Table provides reliable price data in three different categories: 

- Cars and Small Utilities
- Trucks and Micro bus
- Motorcycles
