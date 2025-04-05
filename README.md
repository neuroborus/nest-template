# Backend Skeleton

## Example: Using [ethers-tools-nestjs](https://github.com/neuroborus/ethers-tools-nestjs)

This example demonstrates how to use the `ethers-tools-nestjs` package.  
It includes specific examples of:

- Using the [**ContractFactory**](src/services/coin/coin.service.ts)
- Using the [**MulticallFactory**](src/services/coin/coin.service.ts)
- Using the [**AutoContractFactory**](src/services/nft/nft.service.ts), which automatically generates methods based on the contract ABI
- Using the [**IsEthAddress**](src/apis/v1/coins/get-coin-info.query.ts) validator



## Quickstart
1. Create `.env` file and fill with the "REQUIRED" variables from `.env.xmpl`
2. `npm ci`
3. `npm run start`

## Suggested Project Layers
<b> As long as the application is small, there's no need to add extra layers.</b></br>
<b> However, if necessary, it is recommended to choose from the list below. </b>

This layers designed to maintain structure as it scales and organized by levels.  
* By convention, higher-level layers must not be imported into lower-level ones.  
* Additionally, layers on the same level should not import each other.

\*  Exists by default

└── <b> *[apis/](src/apis/README.md) </b> - <i> contain controllers, dtos </i>  
└── <b> features/ </b> - <i> contain specific feature logic </i>  
└── <b> *[services/](src/services/README.md) </b> - <i> contain general processing logic </i>  
└── <b> stores/ </b> - <i> Repository pattern implementation - api for stores (e.g. DB) </i>  
└── <b> contracts/, drivers/ </b> - <i> interfaces for external systems </i>  
└── <b> helpers/, *[config/](src/config/README.md), *[entities/](src/entities/README.md) </b> - <i> the lowest level or independent layers </i>

## Healthcheck
`/health`
```
{
  "status": "OK",
  "port": 3000,
  "logLevel": "info"
}
```

## Swagger
`/swagger`