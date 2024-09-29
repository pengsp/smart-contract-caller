
(文档以yarn为例，如果使用其他包管理方式，请自行替换命令)

#### 克隆代码
```bash
git clone git@github.com:pengsp/smart-contract-caller.git
```

#### 安装依赖 
```bash
yarn install
```
#### 开发模式启动服务

```bash
yarn dev
```

#### 编译
默认开启了Next.js的`standalone`模式，可根据自己部署的环境选择是否开启`standalone`   
`standalone`模式参考文档：[Automatically Copying Traced Files](https://nextjs.org/docs/pages/api-reference/next-config-js/output#automatically-copying-traced-files)，
```
yarn build
```
#### 部署代码到自己的服务器
1. 未开启`standalone`   
代码编译完成之后，复制以下目录或文件到你的web server目录
```
smart-contract-caller
  |__ .next  
  |   |__ static
  |__ node_modules  
  |__ package.json

```
然后在web server目录启动服务
```bash
nohup yarn start &
# 请根据自己的进程管理方式调整启动服务的方式
```
2. 开启`standalone` 



### 自行编译Docker镜像

```bash
docker build -t smart-contract-caller .
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
项目`public`目录内有一个`init-contract.json`文件，此文件合约ABI包含ERC20标准的方法以及一些接收各种类型数据的方法，用于测试工具对数据的校验和解析是否正确,可根据需要修改为自己的合约   
参数类型如下
```js
interface BaseContract {
    name: string, // 合约的备注名称
    address: string,//合约地址
    chainIds: string[],// 
    abi: Record<string, any>[],//合约的ABI，它应该是一个数组
    remark:string
}
```
