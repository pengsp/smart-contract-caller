

# Smart Contract Caller

 [English docs](/README.md) | 中文文档

智能合约部署到区块链上，如果合约不做验证是无法通过区块浏览器进行合约调用，而基于某些原因，开发阶段一般不会进行合约验证操作，这就大大增加了前端和测试人员观察或更改合约里数据的难度。

使用此工具，**不需要对合约进行验证**，也**无需任何编码**即可对合约的所有方法进行调用，大大提高了开发和测试效率。

## 在线预览

预览地址：[https://smart-contract-caller.vercel.app/](https://smart-contract-caller.vercel.app/)

<img src="./docs/images/demo-en.gif" alt="工具界面截图" width="100%" height="auto">


## 特性

1.  配置简单  
此工具只需要录入`合约的ABI`、`合约地址`、`合约部署的网络`以及一个合约备注名称即可开启合约调用。   
支持 **表单录入**、**JSON文件上传**、**JSON数据粘贴**三种方式添加合约数据
2. 操作简洁   
合约所有的方法将以列表的形式展现出来，选择任意方法可查看方法的`类型`、`输入参数`、`输出参数`等数据，同时提供执行方法的入口。
3. 日志详细  
合约操作的日志都会按照时间线在界面上展示，包括操作的方法、返回的数据、txHash、Event、Error等数据   
4. 支持国际化   
内置英语和简体中文，可自行增加语言包来支持其他语言

更多细节，请自行体验。


## 部署

支持docker部署和自行编译代码部署

### Docker部署

#### 拉取镜像
```bash
docker pull pengsp/smart-contract-caller:latest
```
#### 运行   
docker运行参数可根据实际需要进行调整

```bash
docker run -d -p 3000:3000 smart-contract-caller
```
#### 访问
在浏览器中访问 http://localhost:3000  查看结果

### 自行编译代码部署

自行编译代码部署，如果有需要增加语言包、设置设置默认演示合约等需求，请查看
[开发文档](/docs/development.md)   

### Tips

### 数据存储说明
- 合约信息存储在浏览器的`localStorage`里，页面刷新不会丢失
- 日志信息存在内存中，刷新页面会丢失


