import type { Yao, YaoDetail, GuaDetail, PaipanResult, WuXing, DiZhi } from '../types'
import { autoCast, getChangedYaos, yaosToCode } from './coin'
import { calcBaZi } from './bazi'
import { getShiYing } from './shiying'
import { getLiuQin } from './liuqin'
import { getLiuShen } from './liushou'
import { calcKongWang, isKong } from './kongwang'
import { getShenShaForYao } from './shensha'
import { detectSanHe } from './sanhe'
import { calcHe, calcXing, calcChong } from './xinghe'
import { detectFanYinFuYin } from './fanyin'
import { calcFuShen } from './fushen'
import { detectAnDong } from './andong'
import { findHexagramByCode, ALL_HEXAGRAMS } from '../data/hexagrams'
import { GUA_NA_GAN, GUA_NA_ZHI, ZHI_WU_XING_NAJA } from '../data/naja'
import { GUA_WU_XING } from '../data/bazi'
import { getWangShuai } from '../data/deities'

/**
 * 生成排盘结果（自动起卦）
 */
export function generatePaipanResult(): PaipanResult {
  const yaos = autoCast()
  return buildPaipanResult(yaos)
}

/**
 * 生成排盘结果（使用给定的爻）
 */
export function buildPaipanResult(yaos: Yao[], time?: Date): PaipanResult {
  const date = time ?? new Date()
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

  // 1. 起卦时间八字
  const bazi = calcBaZi(date)

  // 2. 确定本卦
  const originalCode = yaosToCode(yaos)
  const originalInfo = findHexagramByCode(originalCode)
  if (!originalInfo) throw new Error(`未找到对应卦象: ${originalCode}`)

  // 3. 世应
  const { shi, ying } = getShiYing(originalInfo.palacePos)

  // 4. 纳甲
  const ganInner = GUA_NA_GAN[originalInfo.lower].inner
  const ganOuter = GUA_NA_GAN[originalInfo.upper].outer
  const zhiInner = GUA_NA_ZHI[originalInfo.lower].inner
  const zhiOuter = GUA_NA_ZHI[originalInfo.upper].outer
  const allGans = [ganInner, ganInner, ganInner, ganOuter, ganOuter, ganOuter]
  const allZhis = [...zhiInner, ...zhiOuter]

  // 4a. 月建地支（用于旺衰）
  const monthZhi = bazi.yue.zhi

  // 5. 构建本卦详情
  const gongWuxing: WuXing = GUA_WU_XING[originalInfo.palace]
  const originalYaos: YaoDetail[] = yaos.map((y, i) => {
    const wuxing = ZHI_WU_XING_NAJA[allZhis[i]]
    return {
      position: i + 1,
      yao: y,
      najia: { gan: allGans[i], zhi: allZhis[i] },
      wuxing,
      liuqin: getLiuQin(gongWuxing, wuxing),
      liushou: getLiuShen(bazi.ri.gan, i),
      isShi: i + 1 === shi,
      isYing: i + 1 === ying,
      isEmpty: false,
      shensha: [],
      fushen: undefined,
      wangshuai: getWangShuai(wuxing, monthZhi),
    }
  })

  // 6. 空亡
  const kongwang = calcKongWang(bazi.ri.gan, bazi.ri.zhi)
  if (kongwang) {
    for (const y of originalYaos) {
      y.isEmpty = isKong(y.najia.zhi, kongwang)
    }
  }

  // 7. 神煞
  for (const y of originalYaos) {
    y.shensha = getShenShaForYao(bazi.ri.gan, bazi.ri.zhi, y.najia.zhi)
  }

  // 7a. 伏神
  const fushenList = calcFuShen(originalInfo.palace, originalYaos)
  for (let i = 0; i < originalYaos.length; i++) {
    originalYaos[i].fushen = fushenList[i]
  }

  // 7b. 暗动
  detectAnDong(originalYaos, bazi)

  // 8. 本卦动爻是否变化
  const hasChanging = yaos.some(y => y.changing)

  const original: GuaDetail = {
    name: originalInfo.name,
    index: ALL_HEXAGRAMS.indexOf(originalInfo!) + 1,
    upper: originalInfo.upper,
    lower: originalInfo.lower,
    gong: originalInfo.palace,
    palacePos: originalInfo.palacePos,
    gongWuxing,
    guaci: originalInfo.guaci,
    yaoci: originalInfo.yaoci,
    yaos: originalYaos,
    shiPosition: shi,
    yingPosition: ying,
    tuancizhuan: originalInfo.tuancizhuan,
    xiangzhuan: originalInfo.xiangzhuan,
    yaoxiang: originalInfo.yaoxiang,
  }

  // 9. 变卦
  let changed: GuaDetail | undefined

  if (hasChanging) {
    const changedYaos = getChangedYaos(yaos)
    const changedCode = yaosToCode(changedYaos)
    const changedInfo = findHexagramByCode(changedCode)

    if (changedInfo) {
      const { shi: changedShi, ying: changedYing } = getShiYing(changedInfo.palacePos)

      const changedGanInner = GUA_NA_GAN[changedInfo.lower].inner
      const changedGanOuter = GUA_NA_GAN[changedInfo.upper].outer
      const changedZhiInner = GUA_NA_ZHI[changedInfo.lower].inner
      const changedZhiOuter = GUA_NA_ZHI[changedInfo.upper].outer
      const changedAllGans = [changedGanInner, changedGanInner, changedGanInner, changedGanOuter, changedGanOuter, changedGanOuter]
      const changedAllZhis = [...changedZhiInner, ...changedZhiOuter]

      const changedGongWuxing: WuXing = GUA_WU_XING[changedInfo.palace]
      const changedYaosDetail: YaoDetail[] = changedYaos.map((y, i) => {
        const wuxing = ZHI_WU_XING_NAJA[changedAllZhis[i]]
        return {
          position: i + 1,
          yao: y,
          najia: { gan: changedAllGans[i], zhi: changedAllZhis[i] },
          wuxing,
          liuqin: getLiuQin(gongWuxing, wuxing),
          liushou: getLiuShen(bazi.ri.gan, i),
          isShi: i + 1 === changedShi,
          isYing: i + 1 === changedYing,
          isEmpty: kongwang ? isKong(changedAllZhis[i], kongwang) : false,
          shensha: getShenShaForYao(bazi.ri.gan, bazi.ri.zhi, changedAllZhis[i]),
          fushen: undefined,
          wangshuai: getWangShuai(wuxing, monthZhi),
        }
      })

      // 变卦伏神
      const changedFuShen = calcFuShen(changedInfo.palace, changedYaosDetail)
      for (let i = 0; i < changedYaosDetail.length; i++) {
        changedYaosDetail[i].fushen = changedFuShen[i]
      }


      // 变卦不出暗动，改为日破检测
      detectAnDong(changedYaosDetail, bazi, true)

      changed = {
        name: changedInfo.name,
        index: ALL_HEXAGRAMS.indexOf(changedInfo!) + 1,
        upper: changedInfo.upper,
        lower: changedInfo.lower,
        gong: changedInfo.palace,
        palacePos: changedInfo.palacePos,
        gongWuxing: changedGongWuxing,
        guaci: changedInfo.guaci,
        yaoci: changedInfo.yaoci,
        yaos: changedYaosDetail,
        shiPosition: changedShi,
        yingPosition: changedYing,
        tuancizhuan: changedInfo.tuancizhuan,
        xiangzhuan: changedInfo.xiangzhuan,
        yaoxiang: changedInfo.yaoxiang,
      }
    }
  }

  // 10. 三合局（含完整局和未完成局）
  const sanheResults = detectSanHe(originalYaos, bazi, { shiIndex: shi, yingIndex: ying })

  // 11. 六合、三刑、六冲 — 收集 activeZhis（日辰月辰、动爻前后、世应）
  const activeZhis = new Set<DiZhi>()
  activeZhis.add(bazi.ri.zhi)
  activeZhis.add(bazi.yue.zhi)
  activeZhis.add(originalYaos[shi - 1].najia.zhi)
  activeZhis.add(originalYaos[ying - 1].najia.zhi)
  for (const y of originalYaos) {
    if (y.yao.changing) activeZhis.add(y.najia.zhi)
  }
  if (changed) {
    for (const y of changed.yaos) {
      if (y.yao.changing) activeZhis.add(y.najia.zhi)
    }
  }

  const heResults = calcHe(activeZhis)
  const xingResults = calcXing(activeZhis)
  const chongResults = calcChong(activeZhis)

  // 12. 反吟伏吟
  let fanyin = null
  if (changed) {
    fanyin = detectFanYinFuYin(original.yaos, changed.yaos)
  }

  const result: PaipanResult = {
    id,
    timestamp: date,
    bazi,
    original,
    changed: changed || undefined,
    kongwang: kongwang || { xun: '', zhi1: '戌', zhi2: '亥' },
    sanhe: sanheResults.length > 0 ? sanheResults : undefined,
    he: heResults,
    xing: xingResults,
    chong: chongResults,
    fanyin: fanyin || undefined,
  }

  return result
}
