

此项目用于提高智能合约联调、测试效率。  

## 背景
 
智能合约部署到区块链上，如果合约不做验证是无法通过区块浏览器进行合约调用，而基于某些原因，开发阶段一般不会进行合约验证操作，这就大大增加了前端和测试人员观察或更改合约里数据的难度。

## 特性

1.  配置简单  
此工具只需要录入`合约的ABI`、`合约地址`、`合约部署的网络`以及一个合约备注名称即可开启合约调用。
2. 操作简洁   
合约所有的方法将以列表的形式展现出来，选择任意方法可查看方法的`类型`、`输入参数`、`输出参数`等数据，同时提供执行方法的入口。
3. 日志清晰  
合约操作的日志都会按照时间线在界面上展示，包括操作的方法、返回的数据、txHash、Event、Error等数据   

更多细节，请自行体验。


## 界面截图
<img src="./docs/images/screenshot.png" alt="工具界面截图" width="100%" height="auto">


## 使用


### 安装依赖 
```bash
yarn install
```
### 开发模式

```bash
yarn dev
```

### 编译
```
yarn build
```
### 运行
```
yarn start
```
### 配置支持的网络
支持的网络列表配置在文件`/src/configs/networks.ts`   
参数类型(EIP-3085)
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

### 初始化测试合约配置
项目自带了一个`ERC20`测试合约，可通过`.env`配置是否加载
```shell
NEXT_PUBLIC_INIT_TEST_CONTRACT=true # true为加载测试合约
```
测试合约放置在`/src/configs/UTT-init-data.json`,可根据需要修改为自己的合约   
参数类型如下
```js
interface Contract {
    name: string, // 合约的备注名称
    address: string,//合约地址
    hash: string,// hash = hashMessage(`${timestamp}`)
    chainIds: string[],// 
    abi: Record<string, any>[],//合约的ABI，它应该是一个数组
    timestamp: number//时间戳，用来标记合约的更新时间
}
```
参数里的`hash`字段仅用来作为唯一索引，可以是任何string，只要确保不会被后面新增合约的时候碰撞到即可，正常流程新增合约的时候它是通过 ethers.hashMessage(\`${timestamp}\`)生成，生成之后编辑合约也不会变化。

### 数据存储说明
- 合约信息存储在浏览器的`localStorage`里，页面刷新不会丢失
- 日志信息存在内存中，刷新页面会丢失


