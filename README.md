

# Smart Contract Caller

English docs | [中文文档](/README-zh-CN.md)

When a smart contract is deployed on the blockchain, it is impossible to call the contract through the block browser if the contract is not verified. For some reasons, contract verification operations are generally not performed during the development phase, which greatly increases the difficulty for front-end developers and testers to observe or change the data in the contract.

Using this tool, there is **no need to write code**, **no need to verify the contract**, and you can easily call all functions of the smart contract!   
This greatly improves the efficiency of joint debugging and testing.

## Preview

Online Preview: [https://smart-contract-caller.vercel.app/](https://smart-contract-caller.vercel.app/)

####
<img src="./docs/images/demo-en.gif" alt="Operation demonstration" width="100%" height="auto">


## Features

-  **Easy to configure**  
This tool only requires entering the contract's ABI, address, deployment network, and other relevant information to enable contract calls.    
It supports three ways to add contract data: form submission, JSON file upload, and pasting JSON data.

- **Simple operation, easy to use**   
All contract functions are displayed in a list format. Simply select any function to view its type, input parameters, output parameters, and other relevant data. Additionally, an entry point is provided for executing the function.

- **Detailed logging**  
Contract operation logs are displayed on the interface chronologically, including function name, returned data, txHash, Events, Errors, and other relevant information. 

- **Support internationalization**   
Built-in support for English and Simplified Chinese. You can add language packs to support other languages as needed.

For more details, please try it out for yourself.



## Deploy

Support docker deployment and self-compiled code deployment

### Docker deployment

#### pull image
```bash
docker pull pengsp/smart-contract-caller:latest
```
#### run container   
Docker running parameters can be adjusted according to actual needs

```bash
docker run -d -p 3000:3000 smart-contract-caller
```

Open http://localhost:3000 with your browser to see the result.

### Self-compiled code deployment

If you need to add language packs, set default demonstration contracts, etc., you can compile and deploy them yourself. For details, please see
[deployment docs](/docs/development.md)   



### Tips

#### Data storage instructions
- Contract information is stored in `localStorage` of the browser and will not be lost when the page is refreshed
- Logs is stored in memory and will be lost when refreshing the page.

