import { describe, it, expect } from 'vitest'
import {
  getWangShuai,
  getGuiRenZhi,
  getTianXi,
  getHuangEn,
  getTianDe,
  getYueDe,
  getTianYi,
  getShiShen,
  getGuaShen,
  getTaiYao,
} from '../data/deities'
import type { DiZhi, TianGan } from '../types'

describe('getWangShuai', () => {
  it('returns 旺 when wuxing matches month zhi', () => {
    // 寅 is 木 → 旺
    expect(getWangShuai('木', '寅')).toBe('旺')
    expect(getWangShuai('木', '卯')).toBe('旺')
    // 午 is 火 → 旺
    expect(getWangShuai('火', '午')).toBe('旺')
  })

  it('returns 相 for 我生', () => {
    // 春(寅卯木) → 木生火 → 火为相
    expect(getWangShuai('火', '寅')).toBe('相')
    // 夏(巳午火) → 火生土 → 土为相
    expect(getWangShuai('土', '午')).toBe('相')
  })

  it('returns 休 for 生我', () => {
    // 春(寅卯木) → 水生木 → 水为休
    expect(getWangShuai('水', '寅')).toBe('休')
  })

  it('returns 囚 for 克我', () => {
    // 春(寅卯木) → 金克木 → 金为囚
    expect(getWangShuai('金', '寅')).toBe('囚')
  })

  it('returns 死 for 我克', () => {
    // 春(寅卯木) → 木克土 → 土为死
    expect(getWangShuai('土', '寅')).toBe('死')
  })
})

describe('getGuiRenZhi', () => {
  it.each([
    ['甲', ['丑', '未']],
    ['乙', ['子', '申']],
    ['丙', ['亥', '酉']],
    ['丁', ['亥', '酉']],
    ['戊', ['丑', '未']],
    ['己', ['子', '申']],
    ['庚', ['寅', '午']],
    ['辛', ['寅', '午']],
    ['壬', ['卯', '巳']],
    ['癸', ['卯', '巳']],
  ] as [TianGan, DiZhi[]][])('dayGan %s returns %s', (gan, expected) => {
    expect(getGuiRenZhi(gan)).toEqual(expected)
  })

  it('returns empty array for unknown gan', () => {
    expect(getGuiRenZhi('甲' as TianGan)).toEqual(['丑', '未'])
  })
})

describe('getTianXi', () => {
  it.each([
    ['寅', '戌'],
    ['卯', '戌'],
    ['辰', '戌'],
    ['巳', '丑'],
    ['午', '丑'],
    ['未', '丑'],
    ['申', '辰'],
    ['酉', '辰'],
    ['戌', '辰'],
    ['亥', '未'],
    ['子', '未'],
    ['丑', '未'],
  ] as [DiZhi, DiZhi][])('monthZhi %s returns %s', (zhi, expected) => {
    expect(getTianXi(zhi)).toBe(expected)
  })
})

describe('getHuangEn', () => {
  it.each([
    ['寅', '未'],   // 正月
    ['卯', '酉'],   // 二月
    ['辰', '亥'],   // 三月
    ['巳', '丑'],   // 四月
    ['午', '卯'],   // 五月
    ['未', '巳'],   // 六月
    ['申', '未'],   // 七月
    ['酉', '酉'],   // 八月
    ['戌', '亥'],   // 九月
    ['亥', '丑'],   // 十月
    ['子', '卯'],   // 十一月
    ['丑', '巳'],   // 十二月
  ] as [DiZhi, DiZhi][])('monthZhi %s returns %s', (yueZhi, expected) => {
    expect(getHuangEn(yueZhi)).toBe(expected)
  })
})

describe('getTianDe', () => {
  it.each([
    ['寅', '丁巳'],
    ['卯', '乙申'],
    ['辰', '壬亥'],
    ['巳', '辛酉'],
    ['午', '壬亥'],
    ['未', '甲寅'],
    ['申', '癸子'],
    ['酉', '丙寅'],
    ['戌', '丙午'],
    ['亥', '乙卯'],
    ['子', '辛巳'],
    ['丑', '庚申'],
  ] as [DiZhi, string][])('monthZhi %s returns %s', (zhi, expected) => {
    expect(getTianDe(zhi)).toBe(expected)
  })
})

describe('getYueDe', () => {
  it.each([
    ['寅', '丙'],
    ['午', '丙'],
    ['戌', '丙'],
    ['亥', '甲'],
    ['卯', '甲'],
    ['未', '甲'],
    ['申', '壬'],
    ['子', '壬'],
    ['辰', '壬'],
    ['巳', '庚'],
    ['酉', '庚'],
    ['丑', '庚'],
  ] as [DiZhi, string][])('monthZhi %s returns %s', (zhi, expected) => {
    expect(getYueDe(zhi)).toBe(expected)
  })
})

describe('getTianYi', () => {
  it.each([
    ['寅', '辰'],
    ['卯', '巳'],
    ['辰', '午'],
    ['巳', '未'],
    ['午', '申'],
    ['未', '酉'],
    ['申', '戌'],
    ['酉', '亥'],
    ['戌', '子'],
    ['亥', '丑'],
    ['子', '寅'],
    ['丑', '卯'],
  ] as [DiZhi, DiZhi][])('monthZhi %s moves 2 ahead to %s', (zhi, expected) => {
    expect(getTianYi(zhi)).toBe(expected)
  })
})

describe('getShiShen', () => {
  it.each([
    [0, '午'],
    [1, '子'],
    [2, '巳'],
    [3, '辰'],
    [4, '未'],
    [5, '卯'],
    [6, '申'],
    [7, '亥'],
  ])('palacePos %i returns %s', (pos, expected) => {
    expect(getShiShen(pos)).toBe(expected)
  })

  it('returns default for unknown pos', () => {
    expect(getShiShen(8)).toBe('子')
  })
})

describe('getGuaShen', () => {
  it.each([
    // 阳世 (yang shi): 从子上起
    [1, true, '子'],   // 初爻
    [2, true, '丑'],   // 二爻
    [3, true, '寅'],   // 三爻
    [4, true, '卯'],   // 四爻
    [5, true, '辰'],   // 五爻
    [6, true, '巳'],   // 上爻
    // 阴世 (yin shi): 从午上起
    [1, false, '午'],  // 初爻
    [2, false, '未'],  // 二爻
    [3, false, '申'],  // 三爻
    [4, false, '酉'],  // 四爻
    [5, false, '戌'],  // 五爻
    [6, false, '亥'],  // 上爻
  ] as [number, boolean, string][])('shiPosition %s isShiYang=%s returns %s', (pos, yang, expected) => {
    expect(getGuaShen(pos, yang)).toBe(expected)
  })
})

describe('getTaiYao', () => {
  it.each([
    ['寅', '酉'],
    ['卯', '酉'],
    ['巳', '子'],
    ['午', '子'],
    ['申', '卯'],
    ['酉', '卯'],
    ['亥', '午'],
    ['子', '午'],
    ['辰', '午'],
    ['戌', '午'],
    ['丑', '午'],
    ['未', '午'],
  ] as [DiZhi, string][])('monthZhi %s returns %s', (zhi, expected) => {
    expect(getTaiYao(zhi)).toBe(expected)
  })
})
