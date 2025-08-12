import { 
  searchYouTubeViral, 
  searchTikTokViral, 
  searchInstagramViral,
  trackApiUsage,
  getApiUsage
} from '../../lib/youtube'
import { cacheUtils } from '../../lib/cache'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 쿼리 파라미터 파싱
    const {
      countries = 'KR',
      platforms = 'youtube',
      categories = '',
      timeRange = '24',
      minViews = '500000',
      useCache = 'true'
    } = req.query

    const countryList = countries.split(',').filter(Boolean)
    const platformList = platforms.split(',').filter(Boolean)
    const categoryList = categories.split(',').filter(Boolean)
    const timeRangeNum = parseInt(timeRange)
    const minViewsNum = parseInt(minViews)
    const shouldUseCache = useCache === 'true'

    // 입력 검증
    if (countryList.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: '최소 1개 국가를 선택해주세요.' 
      })
    }

    if (platformList.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: '최소 1개 플랫폼을 선택해주세요.' 
      })
    }

    // 캐시 확인
    if (shouldUseCache) {
      const cachedResults = cacheUtils.getCachedSearchResults(
        countryList, platformList, categoryList, timeRangeNum, minViewsNum
      )
      
      if (cachedResults) {
        const cacheInfo = cacheUtils.getCacheInfo(
          countryList, platformList, categoryList, timeRangeNum, minViewsNum
        )
        
        return res.status(200).json({
          success: true,
          videos: cachedResults,
          apiUsage: getApiUsage(),
          cached: true,
          cacheInfo: {
            age: `${cacheInfo.ageMinutes}분 전 캐시됨`,
            expiry: cacheInfo.expiry
          }
        })
      }
    }

    console.log('🔍 바이럴 콘텐츠 검색 시작:', {
      countries: countryList,
      platforms: platformList,
      categories: categoryList,
      timeRange: timeRangeNum,
      minViews: minViewsNum
    })

    let allVideos = []
    let totalApiCalls = 0

    // 각 국가별, 플랫폼별 검색
    for (const country of countryList) {
      for (const platform of platformList) {
        try {
          let videos = []
          
          switch (platform) {
            case 'youtube':
              console.log(`📺 YouTube 검색 중: ${country}`)
              videos = await searchYouTubeViral(country, timeRangeNum, minViewsNum)
              totalApiCalls += 150 // YouTube API 사용량 추정
              break
              
            case 'tiktok':
              console.log(`🎵 TikTok 검색 중: ${country}`)
              videos = await searchTikTokViral(country, timeRangeNum, minViewsNum)
              // TikTok은 API 비용 없음 (스크래핑)
              break
              
            case 'instagram':
              console.log(`📷 Instagram 검색 중: ${country}`)
              videos = await searchInstagramViral(country, timeRangeNum, minViewsNum)
              // Instagram도 API 비용 없음 (스크래핑)
              break
              
            default:
              console.warn(`알 수 없는 플랫폼: ${platform}`)
          }

          if (videos && videos.length > 0) {
            allVideos.push(...videos)
            console.log(`✅ ${platform} ${country}: ${videos.length}개 영상 수집`)
          }

        } catch (error) {
          console.error(`❌ ${platform} ${country} 검색 실패:`, error.message)
          // 한 플랫폼 실패해도 계속 진행
        }
      }
    }

    // API 사용량 추적
    if (totalApiCalls > 0) {
      trackApiUsage(totalApiCalls)
    }

    // 중복 제거 (같은 제목 + 같은 채널)
    const uniqueVideos = []
    const seenVideos = new Set()

    for (const video of allVideos) {
      const uniqueKey = `${video.title.substring(0, 50)}_${video.channelTitle}`
      if (!seenVideos.has(uniqueKey)) {
        seenVideos.add(uniqueKey)
        uniqueVideos.push(video)
      }
    }

    // 카테고리 필터링
    let filteredVideos = uniqueVideos
    if (categoryList.length > 0) {
      filteredVideos = uniqueVideos.filter(video => 
        categoryList.includes(video.category)
      )
    }

    // 터짐지수 기준 정렬
    filteredVideos.sort((a, b) => b.viralScore - a.viralScore)

    // 상위 100개로 제한
    const finalVideos = filteredVideos.slice(0, 100)

    console.log(`🎯 최종 결과: ${finalVideos.length}개 바이럴 영상`)

    // 캐시에 저장
    cacheUtils.cacheSearchResults(
      countryList, platformList, categoryList, timeRangeNum, minViewsNum, finalVideos
    )

    // 응답 반환
    return res.status(200).json({
      success: true,
      videos: finalVideos,
      apiUsage: getApiUsage(),
      cached: false,
      searchInfo: {
        countries: countryList,
        platforms: platformList,
        categories: categoryList,
        timeRange: timeRangeNum,
        minViews: minViewsNum,
        totalFound: finalVideos.length,
        apiCallsUsed: totalApiCalls
      }
    })

  } catch (error) {
    console.error('❌ 바이럴 검색 API 오류:', error)
    
    return res.status(500).json({
      success: false,
      error: error.message || '서버 오류가 발생했습니다.',
      apiUsage: getApiUsage()
    })
  }
}
