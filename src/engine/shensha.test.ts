import { describe, it, expect } from 'vitest'
import { getShenShaForYao, calcShenSha, calcTimeShenSha } from './shensha'
import type { TianGan, DiZhi, BaGua } from '../types'

describe('getShenShaForYao', () => {
  it('returns 天乙贵人 for matching zhi', () => {
    // 甲日贵人 in: 丑, 未
    const result = getShenShaForYao('甲', '子', '丑')
    expect(result).toContain('天乙贵人')
  })

  it('returns 驿马 for 申子辰日', () => {
    // 申子辰驿马在寅
    const result = getShenShaForYao('甲', '申', '寅')
    expect(result).toContain('驿马')
  })

  it('returns 桃花 for 亥卯未日', () => {
    // 亥卯未桃花在子
    const result = getShenShaForYao('甲', '亥', '子')
    expect(result).toContain('桃花')
  })

  it('returns 禄神 for 甲日', () => {
    // 甲禄到寅
    const result = getShenShaForYao('甲', '子', '寅')
    expect(result).toContain('禄神')
  })

  it('returns 羊刃 for 甲日', () => {
    // 甲羊刃在卯
    const result = getShenShaForYao('甲', '子', '卯')
    expect(result).toContain('羊刃')
  })

  it('returns 文昌 for 甲日', () => {
    // 甲文昌在巳
    const result = getShenShaForYao('甲', '子', '巳')
    expect(result).toContain('文昌')
  })

  it('returns 华盖 for 申子辰日', () => {
    // 申子辰华盖在辰
    const result = getShenShaForYao('甲', '申', '辰')
    expect(result).toContain('华盖')
  })

  it('returns 劫煞 for 申子辰日', () => {
    // 申子辰劫煞在巳
    const result = getShenShaForYao('甲', '申', '巳')
    expect(result).toContain('劫煞')
  })

  it('returns 亡神 for 申子辰日', () => {
    // 申子辰亡神在亥
    const result = getShenShaForYao('甲', '申', '亥')
    expect(result).toContain('亡神')
  })

  it('returns multiple matching shensha', () => {
    // 甲日, 申日支, 寅爻支 → 驿马(申子辰在寅) + 禄神(甲在寅)
    const result = getShenShaForYao('甲', '申', '寅')
    expect(result).toContain('驿马')
    expect(result).toContain('禄神')
  })

  it('returns empty array when no shensha match', () => {
    // 甲日贵人丑未, 禄神寅, 羊刃卯, 文昌巳; 申日支驿马寅, 桃花酉, 劫煞巳, 亡神亥, 华盖辰
    // 午爻支均不匹配以上任一
    const result = getShenShaForYao('甲', '申', '午')
    expect(result).toEqual([])
  })
})

describe('calcShenSha', () => {
  it('returns shensha marks for all positions', () => {
    const riGan: TianGan = '甲'
    const riZhi: DiZhi = '申'
    const yaoZhis: DiZhi[] = ['寅', '卯', '辰', '巳', '午', '未']

    const result = calcShenSha(riGan, riZhi, yaoZhis)
    // 寅 (pos 0) → 驿马 + 禄神
    const pos0Marks = result.filter((m) => m.position === 0)
    expect(pos0Marks.some((m) => m.type === '驿马')).toBe(true)
    expect(pos0Marks.some((m) => m.type === '禄神')).toBe(true)

    // 巳 (pos 3) → 文昌 + 劫煞
    const pos3Marks = result.filter((m) => m.position === 3)
    expect(pos3Marks.some((m) => m.type === '文昌')).toBe(true)
    expect(pos3Marks.some((m) => m.type === '劫煞')).toBe(true)
  })
})

describe('calcTimeShenSha', () => {
  it('returns expected shensha entries', () => {
    const bazi = {
      nian: { gan: '甲' as TianGan, zhi: '辰' as DiZhi, wuxing: '木' as const },
      yue: { gan: '丙' as TianGan, zhi: '寅' as DiZhi, wuxing: '火' as const },
      ri: { gan: '甲' as TianGan, zhi: '申' as DiZhi, wuxing: '木' as const },
      shi: { gan: '庚' as TianGan, zhi: '午' as DiZhi, wuxing: '金' as const },
    }

    const result = calcTimeShenSha(bazi)

    // Should contain entries for 天喜, 皇恩, 天德, 月德, 天医, 世身, 卦身, 胎爻
    const names = result.map((r) => r.name)
    expect(names).toContain('天喜')
    expect(names).toContain('皇恩')
    expect(names).toContain('天德')
    expect(names).toContain('月德')
    expect(names).toContain('天医')
    expect(names).toContain('世身')
    expect(names).toContain('卦身')
    expect(names).toContain('胎爻')
  })

  it('uses hexagram info when provided', () => {
    const bazi = {
      nian: { gan: '甲' as TianGan, zhi: '辰' as DiZhi, wuxing: '木' as const },
      yue: { gan: '丙' as TianGan, zhi: '寅' as DiZhi, wuxing: '火' as const },
      ri: { gan: '甲' as TianGan, zhi: '申' as DiZhi, wuxing: '木' as const },
      shi: { gan: '庚' as TianGan, zhi: '午' as DiZhi, wuxing: '金' as const },
    }
    const hexagramInfo = { palace: '乾' as BaGua, palacePos: 0, shiPosition: 1, isShiYang: true }

    const result = calcTimeShenSha(bazi, hexagramInfo)
    const shiShen = result.find((r) => r.name === '世身')
    const guaShen = result.find((r) => r.name === '卦身')
    expect(shiShen).toBeDefined()
    expect(shiShen!.value).not.toBe('—')
    expect(guaShen).toBeDefined()
    expect(guaShen!.value).not.toBe('—')
  })
})
