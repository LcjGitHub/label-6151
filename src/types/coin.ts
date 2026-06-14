/**
 * 古钱币数据模型
 */
export interface Coin {
  /** 唯一标识 */
  id: string
  /** 名称 */
  name: string
  /** 朝代 */
  dynasty: string
  /** 面文 */
  obverse: string
  /** 背文 */
  reverse: string
  /** 直径（毫米） */
  diameter: number
  /** 材质 */
  material: string
  /** 图片 URL */
  imageUrl: string
  /** 简要描述 */
  description: string
  /** 铸造年份（可选） */
  mintYear?: string
}
