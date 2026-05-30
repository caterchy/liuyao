import type { TianGan, DiZhi, ShenShaType, ShenShaMark, BaZi, BaGua } from '../types'
import {
  getShenShaZhi, getGuiRenZhi, SHEN_SHA_RULES,
  getTianXi, getHuangEn, getTianDe, getYueDe,
  getTianYi, getShiShen, getGuaShen, getTaiYao,
} from '../data/deities'
/** 时间神煞结果 */
export interface TimeShenSha {
  name: ShenShaType
  value: string
}


/** 仅用于爻位匹配的9个神煞 */
const YAO_SHEN_SHA: ShenShaType[] = ['天乙贵人', '驿马', '桃花', '劫煞', '亡神', '禄神', '羊刃', '文昌', '华盖']

/**
 * 计算爻位的所有神煞（用于爻位匹配）
 */
export function calcShenSha(
  riGan: TianGan,
  riZhi: DiZhi,
  yaoZhis: DiZhi[],
): ShenShaMark[] {
  const result: ShenShaMark[] = []

  for (let pos = 0; pos < yaoZhis.length; pos++) {
    const yaoZhi = yaoZhis[pos]
    for (const type of YAO_SHEN_SHA) {
      let zhisToMatch: DiZhi[] = []

      if (type === '天乙贵人') {
        zhisToMatch = getGuiRenZhi(riGan)
      } else if (type === '禄神' || type === '羊刃' || type === '文昌') {
        zhisToMatch = getShenShaZhi(type, riGan as unknown as DiZhi)
      } else {
        zhisToMatch = getShenShaZhi(type, riZhi)
      }

      if (zhisToMatch.includes(yaoZhi)) {
        result.push({ position: pos, type })
      }
    }
  }

  return result
}

/**
 * 获取某爻位对应的神煞列表
 */
export function getShenShaForYao(
  riGan: TianGan,
  riZhi: DiZhi,
  yaoZhi: DiZhi,
): ShenShaType[] {
  const matched: ShenShaType[] = []

  for (const type of YAO_SHEN_SHA) {
    let zhisToMatch: DiZhi[] = []

    if (type === '天乙贵人') {
      zhisToMatch = getGuiRenZhi(riGan)
    } else if (type === '禄神' || type === '羊刃' || type === '文昌') {
      zhisToMatch = getShenShaZhi(type, riGan as unknown as DiZhi)
    } else {
      zhisToMatch = getShenShaZhi(type, riZhi)
    }

    if (zhisToMatch.includes(yaoZhi)) {
      matched.push(type)
    }
  }

  return matched
}

/**
 * 计算时间神煞（完整22个）
 * 用于DateTimeInfo展示，基于八字和卦象信息计算
 * @param bazi 八字
 * @param hexagramInfo 卦象信息（可选，用于世身/卦身/胎爻）
 * @returns 神煞名和值的数组
 */
export function calcTimeShenSha(
  bazi: BaZi,
  hexagramInfo?: { palace: BaGua; palacePos: number; shiPosition: number; isShiYang: boolean },
): TimeShenSha[] {
  const result: TimeShenSha[] = []

  const riGan = bazi.ri.gan
  const riZhi = bazi.ri.zhi
  const yueZhi = bazi.yue.zhi

  // 1. 旬空 (special, not a shensha type but shown in the same area)
  // Handled separately in DateTimeInfo

  // 2. 日支-based shensha (三合局 pattern)
  const sanHeBased: ShenShaType[] = ['驿马', '桃花', '劫煞', '亡神', '华盖', '将星', '谋星', '灾煞', '天马', '香闺', '床帐']
  for (const type of sanHeBased) {
    const zhis = getShenShaZhi(type, riZhi)
    if (zhis.length > 0) {
      result.push({ name: type, value: zhis.join('') })
    }
  }

  // 3. 日干-based shensha (direct rule access since key is TianGan, not DiZhi)
  const ganBased: ShenShaType[] = ['禄神', '羊刃', '文昌']
  for (const type of ganBased) {
    const zhis = SHEN_SHA_RULES[type].rule[riGan as TianGan]
    if (zhis && zhis.length > 0) {
      result.push({ name: type, value: zhis.join('') })
    }
  }

  // 4. 天乙贵人 (日干-based)
  const guiRenZhis = getGuiRenZhi(riGan)
  if (guiRenZhis.length > 0) {
    result.push({ name: '天乙贵人', value: guiRenZhis.join('') })
  }

  // 5. 天喜 (月支-based)
  result.push({ name: '天喜', value: getTianXi(yueZhi) })

  // 6. 皇恩 (月支-based, 六阴辰)
  result.push({ name: '皇恩', value: getHuangEn(yueZhi) })

  // 7. 天德 (月支-based, output as gan-zhi pair)
  result.push({ name: '天德', value: getTianDe(yueZhi) })

  // 8. 月德 (月支-based)
  result.push({ name: '月德', value: getYueDe(yueZhi) })

  // 9. 天医 (月支-based)
  result.push({ name: '天医', value: getTianYi(yueZhi) })

  // 10. 世身 (hexagram-based)
  if (hexagramInfo) {
    result.push({ name: '世身', value: getShiShen(hexagramInfo.palacePos) })
  } else {
    result.push({ name: '世身', value: '—' })
  }

  // 11. 卦身 (hexagram-based)
  if (hexagramInfo) {
    result.push({ name: '卦身', value: getGuaShen(hexagramInfo.shiPosition, hexagramInfo.isShiYang) })
  } else {
    result.push({ name: '卦身', value: '—' })
  }

  // 12. 胎爻 (月支-based)
  const taiYao = getTaiYao(yueZhi)
  result.push({ name: '胎爻', value: taiYao === '无' ? '无' : taiYao })

  return result
}
