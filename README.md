Node FIPE Table
=================

:blue_car: :minibus: :truck: Node SDK to retrive information about Brazil's vehicles prices

## About FIPE

FIPE is the Foundation Institute for Economic Research of the University of Sao Paulo. According to its website, it was founded in 1973 to support the University in the areas of education, projects, research and development of economic and financial indicators. Today, FIPE is one of Brazil's most prestigious developer of financial indicators, beign responsible for (among others) the "FIPE Table", which is an important indicator of the average vehicle prices, and the IPC (Consumer Price Index), which measures the inflation of the State of Sao Paulo. The FIPE Table provides reliable price data in three different categories: 

- Cars and Small Utilities
- Trucks and Micro bus
- Motorcycles

## About the SDK

This SDK is result of a lot of try and error with the API used by FIPE's official website. The website is the only place where FIPE releases its data, therefore, nothing more convienient than a SDK to retrive data directly from the API used by the website.

## Getting Started

```
import FipeSDK from '../'

const fipeSDK = new FipeSDK()

fipeSDK.fetchAvailableMonths()
  .then( months => console.log(months) )
```