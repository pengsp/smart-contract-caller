
/**
 * truncateAddress(str,{...})
 * 钱包地址/hash等字符串简化处理，大多数时候应该是不需要config参数
 * @param str :string,需要处理的字符串
 * @param config :类型以及说明见SimplifyStrConfig
 * @returns string 
 * eq:
 * truncateAddress("0xf2AdcfcC8c1A77F940cC93C909df6075591Ff28c"); //=>0xf2Ad...f28c   
 * truncateAddress("0xf2AdcfcC8c1A77F940cC93C909df6075591Ff28c",{ frontBeginIndex: 2, connectSymbol: "***" })//=>f2Adcf***f28c
 */
interface TruncateAddressConfig {
  frontBeginIndex?: number; //开始位置索引,默认值=0
  frontLength?: number; // 前面部分的长度,默认值=6
  endingLength?: number; // 后面部分的长度,默认值=4
  connectSymbol: string// 前后两部分的连接符号，,默认值="..."
}
export const truncateAddress = (str?: string, config?: TruncateAddressConfig): string => {
  const defaultConfig = { frontBeginIndex: 0, frontLength: 6, connectSymbol: '...', endingLength: 4 };
  const { frontBeginIndex, frontLength, connectSymbol, endingLength } = { ...defaultConfig, ...config }
  return str ? `${str.substring(frontBeginIndex, frontBeginIndex + frontLength)}${connectSymbol}${str.substring(str.length - endingLength)}` : '-'
}

