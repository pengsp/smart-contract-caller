
## Development Documentation

This document uses `yarn` as an example. If you use other package management tools, please replace the commands accordingly.

The project is built using Next.js (app router), you can visit [Next.js documentation](https://nextjs.org/docs) for more information.


### Getting Started

Clone code
```bash
git clone git@github.com:pengsp/smart-contract-caller.git
```

install dependencies 
```bash
yarn install
```
run the development server

```bash
yarn dev
```

build   
```bash
yarn build
```
#### Deploy the code to your own server
Once the code has been compiled, please copy the following directories or files to your web server's directory.

```
smart-contract-caller
  |__ .next  
  |__ node_modules  
  |__ public
  |__ package.json

```
Then start the service in the web server directory
```bash
 yarn start 
```
Usually we use some process management tools to start the service. Please tailor the service startup command to your specific scenario.


>If next.js standalone mode is enabled, please refer to the next.js related documents for configuration：[Automatically Copying Traced Files](https://nextjs.org/docs/pages/api-reference/next-config-js/output#automatically-copying-traced-files)，


#### Compile your own Docker image
If you want to build your own docker image, execute the following command  
```bash
docker build -t smart-contract-caller .
```   


---
### Other Configuration

### i18n Configuration

The language package is located in the `/src/i18n/locales` directory, and as for the configuration of the language switching menu, it resides in `/src/i18n/config.ts`.


### Configure the initialization test contract
There is an `init-contract.json` file in the project's `public` directory. The contract ABI of this file contains the ERC20 standard methods and some methods for receiving various types of data. It is used to test whether the tool verifies and parses the data correctly. You can modify it to your own contract as needed.

Data structure interface
```js
interface BaseContract {
    name: string, 
    address: string,
    chainIds: string[],
    abi: Record<string, any>[],
    remark:string
}
```

### Configure supported networks
The list of supported networks is configured in the file `/src/configs/networks.json`. It includes various mainnets and testnets, totaling 1888 networks.   
The parameters of each network must follow the EIP-3085 standard.

Data structure interface
```js
interface Network {
    chainId: string, // A 0x-prefixed hexadecimal chainId
    chainName: string,
    nativeCurrency: {
        name: string,
        symbol: string,
        decimals: number
    },
    rpcUrls: string[],
    blockExplorerUrls: string[],
    iconUrls?: string[]
}
```

