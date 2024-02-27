# PancakeSwap Buy Crypto API

## Table of Contents
- [Overview](#overview)
- [Description](#description)
- [Endpoints](#endpoints)
  - [FetchProviderLimits](#fetchproviderlimits)
  - [FetchProviderSignatures](#fetchprovidersignatures)
  - [FetchProviderAvailabilities](#fetchprovideravailabilities)
  - [FetchProviderQuotes](#fetchproviderquotes)
- [Type Validation](#type-validation)

## Overview

The PancakeSwap BuyCryto/FiatOnramp api servers as a an api to abstract many of the speciic api calls that we use for our fiat on-ramp aggregator on the pancakeswap web app. 
Our aggregator supports three on-ramp providers, Moonpay, Mercuryo and Transak. Each of thse providers has there own REST API spec for generating price quotes, max-min buy amounts, and
other signature generation for completing purchases. This API servers as an abstraction to proxy various API endpoints from each of thse providers into one single endpoint that we call
on our from end from this service.

For example out `quotes` endpoint will aggregate or call each of our three providers quote endpoint and proxy these into one call that we can serve to save our FE having to make all calls
individually to get the data we need from each provider seperately. We proxy many different endpoints from each provider which we will describe in the spec below

## Description

This service is an express app which uses the express router in combination with the controller/handler design philosophy for generating our REST api. The api file structure follows 

```src
└── api
    ├── controllers/
    └── handlers/
    ├── router.ts
|__ app.ts
```

The main endpoints can be found in `src/api/router.ts`. Likewise, the implementation of these endpoints can be found in `src/api/controllers`.
Each API controller will pretty much serve as a proxy for generating similar data among all providers to serve to the user. 

For example, our `quotes` controller will return data with the quote for a given request for all providers.There is one more level of abstraction which are in the form of handlers. 

Handlers represent an individual proxy where we call the REST endpoint of a specific provider in isolation. The results of all handlers cannot be called directly from this service 
but rather they are used and consumed by our controllers. Each controller's handlers are located respectively at `src/api/handlers`.


## Endpoints

The available endpoints that can be called from the is service are desibed below along with there available query params and respective responses.

### FetchProviderLimits

```GET- /fetch-provider-limits```

### Description
this endpoint returns information on th maximun and minimum buy limits for a buy pair. for example what are the maximum and minimum buy amounts in USD nd ETH for USD/ETH on Ethereum

#### Parameters
This endpoint's controller implementation is located at `src/api/controllers/fetchProviderLimit.ts`

| Parameter      | Description                                                                                                   |
|----------------|---------------------------------------------------------------------------------------------------------------|
| fiatCurrency   | This parameter specifies the fiat currency used for conversion.                                               |
| cryptoCurrency | This parameter specifies the cryptocurrency used for conversion.                                             |
| network        | This parameter specifies the network for which the limit is queried. For example, Ethereum or Bitcoin network.|

#### Response

##### Success
```json
{
  "code": "MoonPay",
  "result": any,
  "error": false
}
```

##### Error
```json
{
  "code": "MoonPay",
  "result": { "data": "Unsupprted quote currency USD" },
  "error": true
}
```

### FetchProviderLimits

```GET- /fetch-provider-signature```

### Description
For redirecting the user to a providers buy flow we need to generate a widget url that we use in an IFRAME on our frontend. For security reasons we need to generate a signature on our backend so that the users wallet address is tied to
there purcahse query. If when the user naivigates to the provider to complete the purchase and the wallet address is different thn the purchase will fail. this endpoint generate this signature and attaxhes it to the end of the iframe url

#### Parameters
This endpoint's controller implementation is located at `src/api/controllers/fetchProviderSignature.ts`

| Parameter      | Description                                                                                                   |
|----------------|---------------------------------------------------------------------------------------------------------------|
| fiatCurrency   | This parameter specifies the fiat currency used for conversion.                                               |
| cryptoCurrency | This parameter specifies the cryptocurrency used for conversion.                                             |
| network        | This parameter specifies the network for which the limit is queried. For example, Ethereum or Bitcoin network.|
| amount         | This parameter specifies the amount of cryptocurrency the user would like to buy in fiatCurrency                                             |
| walletAddress  | This parameter specifies the users wallet addres where the funds will be sent to on completion of the transaction|

#### Response

##### Success
```json
{
  "signature": "0x123456....."
}
```

##### Error
```json
{
  "code": "MoonPay",
  "result": { "data": "something went wrong when genratimg signature" },
  "error": true
}
```
### FetchProviderAvailabilities

```GET- /fetch-provider-availabilitiess```

### Description
Some providers cannot oprate their servces in some counties or locations. This endpoint will query a users elgibility to user their service based on their ip address and return a response for each provider with a boolean flag
determening whether or not that user can use a providers service or not. if a user is not eligible to use a certain provider for on-ramping, then that provider will not be dislayed for them on the Pancakseswap interface

#### Parameters
This endpoint's controller implementation is located at `src/api/controllers/fetchProviderAvailabilities.ts` and takes no parameters

#### Response

##### Success
```json
{
  "Moonpay": "true",
  "Mercuryo": "false",
  "Tranak": "true",
}
```

##### Error
```json
{
  "code": "MoonPay",
  "result": { "data": "the users ip is invalid." },
  "error": true
}
```

### FetchProviderQuotes

```GET- /fetch-provider-availabilitiess```

### Description
This enpoint will return quote information on a given fiatcurrency/cryptocurrency pair for each of the providers based on the provided input amounts

#### Parameters
This endpoint's controller implementation is located at `src/api/controllers/fetchProviderQuotes.ts`

| Parameter      | Description                                                                                                   |
|----------------|---------------------------------------------------------------------------------------------------------------|
| fiatCurrency   | This parameter specifies the fiat currency used for conversion.                                               |
| cryptoCurrency | This parameter specifies the cryptocurrency used for conversion.                                             |
| network        | This parameter specifies the network for which the limit is queried. For example, Ethereum or Bitcoin network.|
| amount         | This parameter specifies the amount of cryptocurrency the user would like to buy in fiatCurrency                                             |

#### Response

##### Success
```json
{
  "providerFee": 0.015,
  "networkFee": 0.0025,
  "amount": 1250.75,
  "quote": 0.438,
  "fiatCurrency": "USD",
  "cryptoCurrency": "BTC",
  "provider": "MoonPay",
  "price": 47214.32
}
```

##### Error
```json
{
  "code": "MoonPay",
  "result": { "data": "no quote available for USD/USDT for Moonpay on binance network" },
  "error": true
}
```

## Type Validation

This service uses strong typing with the implementation of Zod for verifyng the correct type of each endpoints query pramaters. if the wrong query parameters or the wrong type is passd into a api call, a validation error will be
returned to the users a the response. The servics validation logic can found at

```src
└── typeValidation
    ├── model/
    ├── validation.ts
```

The main validation schemas can be found at `src/typeValidation/validation.ts`. this file hold the schema spec for each of the endpoints described above. these schemas are checked against the model for each endpoint, all of which can
be found in `src/typeValidation/model/`. An example of how tthe api typevalidation schemas are enforced can be sen in the code snippet below

```ts
export const fetchProviderSignature = async (req: Request, res: Response, next: NextFunction) => {
      const request: GetProviderSigRequest = toDtoProviderSig(req.query);
      const validationResult = ValidateProviderSigRequest(request);

      // throws error if passed query params do not match schema
      if (!validationResult.success) {
            throw new Error(validationResult.data as string);
      }

      ....
      ....
}
```
