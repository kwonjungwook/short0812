import { getSearchCache, saveSearchCache } from './storage'

// 캐시 유효 시간 (30분)
const CACHE_TTL = 30 * 60 * 1000

// 캐시 키 생성
function getCacheKey(countries, platforms, categories, timeRange, minViews) {
  return [
    countries.sort().join(','),
    platforms.sort().join(','),
    categories.sort().join(','),
    timeRange,
    minViews
  ].join('_')
}

// 캐시 유틸리티
export const cacheUtils = {
  // 캐시된 검색 결과 가져오기
  getCachedSearchResults(countries, platforms, categories, timeRange, minViews) {
    const cacheKey = getCacheKey(countries, platforms, categories, timeRange, minViews)
    const cache = getSearchCache()
    
    if (!cache[cacheKey]) {
      return null
    }
    
    const { timestamp, data } = cache[cacheKey]
    const now = Date.now()
    
    // 캐시 만료 확인
    if (now - timestamp > CACHE_TTL) {
      // 만료된 캐시 삭제
      delete cache[cacheKey]
      saveSearchCache(cache)
      return null
    }
    
    console.log('✅ 캐시 히트:', cacheKey)
    return data
  },
  
  // 검색 결과 캐시 저장
  cacheSearchResults(countries, platforms, categories, timeRange, minViews, data) {
    const cacheKey = getCacheKey(countries, platforms, categories, timeRange, minViews)
    const cache = getSearchCache()
    
    cache[cacheKey] = {
      timestamp: Date.now(),
      data: data
    }
    
    // 오래된 캐시 정리
    const now = Date.now()
    Object.keys(cache).forEach(key => {
      if (cache[key].timestamp && now - cache[key].timestamp > CACHE_TTL * 2) {
        delete cache[key]
      }
    })
    
    saveSearchCache(cache)
    console.log('💾 캐시 저장:', cacheKey)
  },
  
  // 캐시 정보 가져오기
  getCacheInfo(countries, platforms, categories, timeRange, minViews) {
    const cacheKey = getCacheKey(countries, platforms, categories, timeRange, minViews)
    const cache = getSearchCache()
    
    if (!cache[cacheKey]) {
      return null
    }
    
    const { timestamp } = cache[cacheKey]
    const now = Date.now()
    const ageMinutes = Math.floor((now - timestamp) / 1000 / 60)
    const remainingMinutes = Math.ceil((CACHE_TTL - (now - timestamp)) / 1000 / 60)
    
    return {
      ageMinutes,
      remainingMinutes,
      expiry: new Date(timestamp + CACHE_TTL).toLocaleTimeString('ko-KR')
    }
  },
  
  // 전체 캐시 초기화
  clearAllCache() {
    saveSearchCache({})
    console.log('🗑️ 전체 캐시 초기화')
  },
  
  // 캐시 통계
  getCacheStats() {
    const cache = getSearchCache()
    const now = Date.now()
    let activeCount = 0
    let expiredCount = 0
    let totalSize = 0
    
    Object.entries(cache).forEach(([key, value]) => {
      if (value.timestamp) {
        if (now - value.timestamp <= CACHE_TTL) {
          activeCount++
        } else {
          expiredCount++
        }
        if (value.data) {
          totalSize += value.data.length
        }
      }
    })
    
    return {
      activeCount,
      expiredCount,
      totalSize,
      keys: Object.keys(cache)
    }
  }
}
