export interface DynastyItem {
  /** 朝代名称 */
  name: string
  /** 起始年份（公元前用负数表示） */
  startYear: number
  /** 结束年份 */
  endYear: number
  /** 该朝代钱币数量 */
  coinCount: number
}
