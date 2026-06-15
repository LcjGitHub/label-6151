export interface DynastyCoinCount {
  dynasty: string
  count: number
}

export interface MaterialRatio {
  material: string
  count: number
  ratio: number
}

export interface CoinStatistics {
  totalCoins: number
  totalDynasties: number
  totalMaterials: number
  dynastyCounts: DynastyCoinCount[]
  materialRatios: MaterialRatio[]
}
