import type { TianGan, DiZhi, LiuShen, ShenShaType, WangShuai, WuXing, BaGua } from '../types'
import { ZHI_WU_XING, DI_ZHI } from './bazi'

/**
 * 六神安放规则: 按日柱天干定
 * 青龙 → 朱雀 → 勾陈 → 腾蛇 → 白虎 → 玄武
 * 按日干顺排: 甲乙日青龙起, 丙丁日朱雀起, 戊日勾陈起, 己日腾蛇起, 庚辛日白虎起, 壬癸日玄武起
 */
export const LIU_SHEN_START: Record<TianGan, LiuShen> = {
  '甲': '青龙',
  '乙': '青龙',
  '丙': '朱雀',
  '丁': '朱雀',
  '戊': '勾陈',
  '己': '腾蛇',
  '庚': '白虎',
  '辛': '白虎',
  '壬': '玄武',
  '癸': '玄武',
}

/** 六神顺序（循环） */
export const LIU_SHEN_ORDER: LiuShen[] = ['青龙', '朱雀', '勾陈', '腾蛇', '白虎', '玄武']

/**
 * 神煞规则
 * 六爻中最常用的神煞，按日柱地支确定
 */
/** 神煞规则键：可以是天干或地支 */
type ShenShaRuleKey = TianGan | DiZhi

export const SHEN_SHA_RULES: Record<ShenShaType, {
  name: string
  rule: Partial<Record<ShenShaRuleKey, DiZhi[]>>
}> = {
  '天乙贵人': {
    name: '天乙贵人',
    rule: {
      '甲': ['丑', '未'],
      '戊': ['丑', '未'],
      '庚': ['寅', '午'],
      '乙': ['子', '申'],
      '己': ['子', '申'],
      '丙': ['亥', '酉'],
      '丁': ['亥', '酉'],
      '壬': ['卯', '巳'],
      '癸': ['卯', '巳'],
      '辛': ['寅', '午'],
    },
  },
  '驿马': {
    name: '驿马',
    rule: {
      '申': ['寅'],
      '子': ['寅'],
      '辰': ['寅'],
      '亥': ['巳'],
      '卯': ['巳'],
      '未': ['巳'],
      '寅': ['申'],
      '午': ['申'],
      '戌': ['申'],
      '巳': ['亥'],
      '酉': ['亥'],
      '丑': ['亥'],
    },
  },
  '桃花': {
    name: '桃花',
    rule: {
      '申': ['酉'],
      '子': ['酉'],
      '辰': ['酉'],
      '亥': ['子'],
      '卯': ['子'],
      '未': ['子'],
      '寅': ['卯'],
      '午': ['卯'],
      '戌': ['卯'],
      '巳': ['午'],
      '酉': ['午'],
      '丑': ['午'],
    },
  },
  '劫煞': {
    name: '劫煞',
    rule: {
      '申': ['巳'],
      '子': ['巳'],
      '辰': ['巳'],
      '亥': ['申'],
      '卯': ['申'],
      '未': ['申'],
      '寅': ['亥'],
      '午': ['亥'],
      '戌': ['亥'],
      '巳': ['寅'],
      '酉': ['寅'],
      '丑': ['寅'],
    },
  },
  '亡神': {
    name: '亡神',
    rule: {
      '申': ['亥'],
      '子': ['亥'],
      '辰': ['亥'],
      '亥': ['寅'],
      '卯': ['寅'],
      '未': ['寅'],
      '寅': ['巳'],
      '午': ['巳'],
      '戌': ['巳'],
      '巳': ['申'],
      '酉': ['申'],
      '丑': ['申'],
    },
  },
  '禄神': {
    name: '禄神',
    rule: {
      '甲': ['寅'],
      '乙': ['卯'],
      '丙': ['巳'],
      '丁': ['午'],
      '戊': ['巳'],
      '己': ['午'],
      '庚': ['申'],
      '辛': ['酉'],
      '壬': ['亥'],
      '癸': ['子'],
    },
  },
  '羊刃': {
    name: '羊刃',
    rule: {
      '甲': ['卯'],
      '乙': ['寅'],
      '丙': ['午'],
      '丁': ['巳'],
      '戊': ['午'],
      '己': ['巳'],
      '庚': ['酉'],
      '辛': ['申'],
      '壬': ['子'],
      '癸': ['亥'],
    },
  },
  '文昌': {
    name: '文昌',
    rule: {
      '甲': ['巳'],
      '乙': ['午'],
      '丙': ['申'],
      '丁': ['酉'],
      '戊': ['申'],
      '己': ['酉'],
      '庚': ['亥'],
      '辛': ['子'],
      '壬': ['寅'],
      '癸': ['卯'],
    },
  },
  '华盖': {
    name: '华盖',
    rule: {
      '申': ['辰'],
      '子': ['辰'],
      '辰': ['辰'],
      '亥': ['未'],
      '卯': ['未'],
      '未': ['未'],
      '寅': ['戌'],
      '午': ['戌'],
      '戌': ['戌'],
      '巳': ['丑'],
      '酉': ['丑'],
      '丑': ['丑'],
    },
  },
  '将星': {
    name: '将星',
    rule: {
      '申': ['子'], '子': ['子'], '辰': ['子'],
      '亥': ['卯'], '卯': ['卯'], '未': ['卯'],
      '寅': ['午'], '午': ['午'], '戌': ['午'],
      '巳': ['酉'], '酉': ['酉'], '丑': ['酉'],
    },
  },
  '谋星': {
    name: '谋星',
    rule: {
      '申': ['辰'], '子': ['辰'], '辰': ['辰'],
      '亥': ['未'], '卯': ['未'], '未': ['未'],
      '寅': ['戌'], '午': ['戌'], '戌': ['戌'],
      '巳': ['丑'], '酉': ['丑'], '丑': ['丑'],
    },
  },
  '灾煞': {
    name: '灾煞',
    rule: {
      '申': ['午'], '子': ['午'], '辰': ['午'],
      '亥': ['酉'], '卯': ['酉'], '未': ['酉'],
      '寅': ['子'], '午': ['子'], '戌': ['子'],
      '巳': ['卯'], '酉': ['卯'], '丑': ['卯'],
    },
  },
  '天马': {
    name: '天马',
    rule: {
      '申': ['寅'], '子': ['寅'], '辰': ['寅'],
      '亥': ['巳'], '卯': ['巳'], '未': ['巳'],
      '寅': ['申'], '午': ['申'], '戌': ['申'],
      '巳': ['亥'], '酉': ['亥'], '丑': ['亥'],
    },
  },
  '香闺': {
    name: '香闺',
    rule: {
      '申': ['巳'], '子': ['巳'], '辰': ['巳'],
      '亥': ['申'], '卯': ['申'], '未': ['申'],
      '寅': ['亥'], '午': ['亥'], '戌': ['亥'],
      '巳': ['寅'], '酉': ['寅'], '丑': ['寅'],
    },
  },
  '床帐': {
    name: '床帐',
    rule: {
      '申': ['寅'], '子': ['寅'], '辰': ['寅'],
      '亥': ['巳'], '卯': ['巳'], '未': ['巳'],
      '寅': ['申'], '午': ['申'], '戌': ['申'],
      '巳': ['亥'], '酉': ['亥'], '丑': ['亥'],
    },
  },
  // 以下类型使用独立计算函数，不在SHEN_SHA_RULES中匹配
  '天喜': { name: '天喜', rule: {} },
  '皇恩': { name: '皇恩', rule: {} },
  '天德': { name: '天德', rule: {} },
  '月德': { name: '月德', rule: {} },
  '天医': { name: '天医', rule: {} },
  '世身': { name: '世身', rule: {} },
  '卦身': { name: '卦身', rule: {} },
  '胎爻': { name: '胎爻', rule: {} },
}

/**
 * 旺相休囚死: 根据月地支判断某五行的旺衰状态
 * 当令者旺, 我生者相, 生我者休, 克我者囚, 我克者死
 */
export function getWangShuai(wuxing: WuXing, monthZhi: DiZhi): WangShuai {
  const monthWuxing = ZHI_WU_XING[monthZhi]
  if (wuxing === monthWuxing) return '旺'

  const shengMap: Record<WuXing, WuXing> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' }
  if (shengMap[monthWuxing] === wuxing) return '相'

  const shengWoMap: Record<WuXing, WuXing> = { '木': '水', '火': '木', '土': '火', '金': '土', '水': '金' }
  if (shengWoMap[monthWuxing] === wuxing) return '休'

  const keWoMap: Record<WuXing, WuXing> = { '木': '金', '火': '水', '土': '木', '金': '火', '水': '土' }
  if (keWoMap[monthWuxing] === wuxing) return '囚'

  return '死'
}

/**
 * 获取日柱天干对应的贵人地支
 * 甲戊兼牛羊，乙己鼠猴乡，丙丁猪鸡位，壬癸兔蛇藏，庚辛逢虎马
 */
export function getGuiRenZhi(gan: TianGan): DiZhi[] {
  const map: Record<string, DiZhi[]> = {
    '甲': ['丑', '未'],
    '戊': ['丑', '未'],
    '庚': ['寅', '午'],
    '乙': ['子', '申'],
    '己': ['子', '申'],
    '丙': ['亥', '酉'],
    '丁': ['亥', '酉'],
    '壬': ['卯', '巳'],
    '癸': ['卯', '巳'],
    '辛': ['寅', '午'],
  }
  return map[gan] || []
}

/**
 * 获取日柱地支对应的某神煞地支列表
 */
export function getShenShaZhi(type: ShenShaType, riZhi: DiZhi): DiZhi[] {
  const rule = SHEN_SHA_RULES[type].rule[riZhi]
  return rule || []
}

// ===== New Shensha Calculation Functions =====

/**
 * 天喜：按月支季节计算
 * 寅卯辰(春)→戌, 巳午未(夏)→丑, 申酉戌(秋)→辰, 亥子丑(冬)→未
 */
export function getTianXi(yueZhi: DiZhi): DiZhi {
  if (['寅','卯','辰'].includes(yueZhi)) return '戌'
  if (['巳','午','未'].includes(yueZhi)) return '丑'
  if (['申','酉','戌'].includes(yueZhi)) return '辰'
  return '未'
}

/**
 * 皇恩：按月支计算（六阴辰）
 * 正月起未，顺行六阴辰（未、酉、亥、丑、卯、巳），每阴辰管两个月
 * 正→未, 二→酉, 三→亥, 四→丑, 五→卯, 六→巳, 七→未, 八→酉, 九→亥, 十→丑, 十一→卯, 十二→巳
 */
const YIN_CHEN: DiZhi[] = ['未', '酉', '亥', '丑', '卯', '巳']
export function getHuangEn(yueZhi: DiZhi): DiZhi {
  const idx = DI_ZHI.indexOf(yueZhi)
  return YIN_CHEN[(idx - 2 + 12) % 6]
}

/**
 * 天德：按月支计算（渊海子平 + 八卦纳甲）
 * 寅→丁巳, 卯→乙申, 辰→壬亥, 巳→辛酉, 午→壬亥, 未→甲寅, 申→癸子, 酉→丙寅, 戌→丙午, 亥→乙卯, 子→辛巳, 丑→庚申
 * 返回干支字符串
 */
export function getTianDe(yueZhi: DiZhi): string {
  const map: Record<DiZhi, { gan: TianGan; zhi: DiZhi }> = {
    '寅': { gan: '丁', zhi: '巳' },
    '卯': { gan: '乙', zhi: '申' },
    '辰': { gan: '壬', zhi: '亥' },
    '巳': { gan: '辛', zhi: '酉' },
    '午': { gan: '壬', zhi: '亥' },
    '未': { gan: '甲', zhi: '寅' },
    '申': { gan: '癸', zhi: '子' },
    '酉': { gan: '丙', zhi: '寅' },
    '戌': { gan: '丙', zhi: '午' },
    '亥': { gan: '乙', zhi: '卯' },
    '子': { gan: '辛', zhi: '巳' },
    '丑': { gan: '庚', zhi: '申' },
  }
  const result = map[yueZhi]
  return result ? `${result.gan}${result.zhi}` : ''
}

/**
 * 月德：按月支计算
 * 寅午戌→丙, 亥卯未→甲, 申子辰→壬, 巳酉丑→庚
 */
export function getYueDe(yueZhi: DiZhi): TianGan {
  if (['寅','午','戌'].includes(yueZhi)) return '丙'
  if (['亥','卯','未'].includes(yueZhi)) return '甲'
  if (['申','子','辰'].includes(yueZhi)) return '壬'
  return '庚'
}

/**
 * 天医：按月支+2计算
 * 寅→辰, 卯→巳, 辰→午, 巳→未, 午→申, 未→酉, 申→戌, 酉→亥, 戌→子, 亥→丑, 子→寅, 丑→卯
 */
export function getTianYi(yueZhi: DiZhi): DiZhi {
  const idx = DI_ZHI.indexOf(yueZhi)
  return DI_ZHI[(idx + 2) % 12]
}

/**
 * 世身：按世爻位置计算
 * 一世→子, 二世→巳, 三世→辰, 四世→未, 五世→卯, 六世(纯卦)→午, 游魂→申, 归魂→亥
 */
export function getShiShen(palacePos: number): DiZhi {
  const map: Record<number, DiZhi> = {
    0: '午',  // 纯卦 (六世)
    1: '子',  // 一世
    2: '巳',  // 二世
    3: '辰',  // 三世
    4: '未',  // 四世
    5: '卯',  // 五世
    6: '申',  // 游魂
    7: '亥',  // 归魂
  }
  return map[palacePos] || '子'
}

/**
 * 卦身：月卦身算法
 * 阳世从子上起，阴世从午上起，从初爻顺数至世爻位
 * @param shiPosition 世爻位置 (1-6)
 * @param isShiYang 世爻是否为阳
 */
export function getGuaShen(shiPosition: number, isShiYang: boolean): DiZhi {
  const DIZHI: DiZhi[] = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
  const startIndex = isShiYang ? 0 : 6  // 阳世从子上起，阴世从午上起
  return DIZHI[(startIndex + shiPosition - 1) % 12]
}

/**
 * 胎爻：按月支五行在十二长生的胎位
 * 寅卯(木)→酉, 巳午(火)→子, 申酉(金)→卯, 亥子(水)→午, 辰戌丑未(土)→午
 * 返回'无'表示该爻无胎位
 */
export function getTaiYao(yueZhi: DiZhi): DiZhi | '无' {
  if (['寅','卯'].includes(yueZhi)) return '酉'
  if (['巳','午'].includes(yueZhi)) return '子'
  if (['申','酉'].includes(yueZhi)) return '卯'
  if (['亥','子'].includes(yueZhi)) return '午'
  if (['辰','戌','丑','未'].includes(yueZhi)) return '午'
  return '无'
}
