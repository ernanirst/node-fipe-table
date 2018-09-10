Node FIPE Table
=================

:blue_car: :minibus: :truck: Node SDK to retrive information about Brazil's vehicles prices

This SDK is result of a lot of try and error with the API used by FIPE's official website. The website is the only place where FIPE releases its data, therefore, nothing more convienient than a SDK to retrive data directly from the API used by the website.

WARNING: FIPE's API can change without notice, please run the examples to make sure it's working.

## Getting Started

Install the module with the classic:

`npm i --save fipe-table`

Now run the following sample to list all available dates on which the research was made

```
import FipeSDK from 'fipe-table'

const fipeSDK = new FipeSDK()

fipeSDK.fetchAvailableDate()
  .then( date => console.log(date) )
```

You can list the available brands using the code of the date obtained on the previous sample

```
import FipeSDK from 'fipe-table'

const fipeSDK = new FipeSDK()
const VEHICLE = 'car'
const codeDate = 130

fipeSDK.fetchAvailableBrands(VEHICLE, codeDate)
  .then( brands => console.log(brands) )
```

It's also possible to ommit the last argument to use the latest date of research

```
import FipeSDK from 'fipe-table'

const fipeSDK = new FipeSDK()
const VEHICLE = 'car'

fipeSDK.fetchAvailableBrands(VEHICLE)
  .then( brands => console.log(brands) )
```

## About FIPE

FIPE is the Foundation Institute for Economic Research of the University of Sao Paulo. According to its website, it was founded in 1973 to support the University in the areas of education, projects, research and development of economic and financial indicators. Today, FIPE is one of Brazil's most prestigious developer of financial indicators, beign responsible for (among others) the "FIPE Table", which is an important indicator of the average vehicle prices, and the IPC (Consumer Price Index), which measures the inflation of the State of Sao Paulo. The FIPE Table provides reliable price data in three different categories: 

- Cars and Small Utilities
- Trucks and Micro bus
- Motorcycles
