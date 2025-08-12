import { google } from 'googleapis'

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
})

// 카테고리 분류 키워드
const CATEGORY_KEYWORDS = {
  '뷰티': ['메이크업', '스킨케어', '뷰티', '화장', '코스메틱', 'makeup', 'skincare', 'beauty'],
  '연예인': ['아이돌', '배우', '연예인', '셀럽', '스타', 'idol', 'celebrity', 'star'],
  '꿀팁/생활': ['꿀팁', '라이프해킹', '정리', '살림', '노하우', 'tips', 'lifehack', 'organize'],
  '건강/다이어트': ['다이어트', '운동', '헬스', '요가', '건강', 'diet', 'workout', 'fitness', 'health'],
  '디지털/가전': ['스마트폰', '아이폰', '가전', '테크', 'IT', 'smartphone', 'tech', 'gadget'],
  '동물': ['강아지', '고양이', '동물', '펫', 'pet', 'animal', 'dog', 'cat'],
  '영화/엔터': ['영화', '드라마', '리뷰', '예고편', 'movie', 'drama', 'trailer', 'review'],
  '지식/정보': ['역사', '과학', '교육', '상식', '지식', 'history', 'science', 'education'],
  '법정/사건': ['사건', '실화', '미스터리', '범죄', '법정', 'crime', 'mystery', 'court']
}

// 터짐지수 계산 (3일까지 확장)
export function calculateViralScore(viewCount, publishedAt) {
  const now = new Date()
  const uploadTime = new Date(publishedAt)
  const hoursAgo = Math.floor((now - uploadTime) / (1000 * 60 * 60))
  
  // 72시간(3일) 초과시 0점
  if (hoursAgo > 72) return 0
  
  // 시간 가중치: 73 - 경과시간
  // 1시간 이내: 72점, 72시간: 1점
  const timeWeight = Math.max(1, 73 - hoursAgo)
  
  return viewCount * timeWeight
}

// 카테고리 자동 분류
export function categorizeVideo(title, description = '') {
  const text = (title + ' ' + description).toLowerCase()
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        return category
      }
    }
  }
  
  return '기타'
}

// YouTube 인기 영상 검색
export async function searchYouTubeViral(country, timeRange = 24, minViews = 500000) {
  try {
    // 시간 제한 계산
    const timeLimit = new Date()
    timeLimit.setHours(timeLimit.getHours() - timeRange)
    
    // 1. 인기 차트에서 검색
    const popularResponse = await youtube.videos.list({
      part: 'snippet,statistics,contentDetails',
      chart: 'mostPopular',
      regionCode: country,
      maxResults: 50,
      publishedAfter: timeLimit.toISOString(),
    })

    let allVideos = [...(popularResponse.data.items || [])]

    // 2. 키워드 검색 (바이럴 관련)
    const viralKeywords = country === 'KR' 
      ? ['핫한', '대박', '화제', '급상승'] 
      : country === 'JP' 
      ? ['バズった', '話題', 'トレンド', '急上昇']
      : ['viral', 'trending', 'breaking', 'exploding']

    for (const keyword of viralKeywords.slice(0, 2)) { // API 절약을 위해 2개만
      try {
        const searchResponse = await youtube.search.list({
          part: 'snippet',
          q: keyword,
          type: 'video',
          regionCode: country,
          publishedAfter: timeLimit.toISOString(),
          order: 'viewCount',
          maxResults: 25,
        })

        if (searchResponse.data.items) {
          const videoIds = searchResponse.data.items.map(item => item.id.videoId)
          
          const videosResponse = await youtube.videos.list({
            part: 'snippet,statistics,contentDetails',
            id: videoIds.join(','),
          })

          if (videosResponse.data.items) {
            allVideos.push(...videosResponse.data.items)
          }
        }
      } catch (error) {
        console.error(`키워드 "${keyword}" 검색 실패:`, error.message)
      }
    }

    // 3. 중복 제거 및 필터링
    const uniqueVideos = []
    const seenIds = new Set()

    for (const video of allVideos) {
      if (seenIds.has(video.id)) continue
      seenIds.add(video.id)

      const viewCount = parseInt(video.statistics.viewCount || 0)
      const publishedAt = video.snippet.publishedAt
      
      // 조회수 및 시간 필터
      if (viewCount < minViews) continue
      
      const viralScore = calculateViralScore(viewCount, publishedAt)
      if (viralScore === 0) continue // 72시간(3일) 초과

      // 영상 정보 구성
      const processedVideo = {
        id: video.id,
        title: video.snippet.title,
        channelTitle: video.snippet.channelTitle,
        publishedAt: publishedAt,
        thumbnail: video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url,
        viewCount: viewCount,
        likeCount: parseInt(video.statistics.likeCount || 0),
        commentCount: parseInt(video.statistics.commentCount || 0),
        duration: video.contentDetails?.duration || 'PT0S',
        url: `https://www.youtube.com/watch?v=${video.id}`,
        platform: 'youtube',
        country: country,
        viralScore: viralScore,
        hoursAgo: Math.floor((new Date() - new Date(publishedAt)) / (1000 * 60 * 60)),
        category: categorizeVideo(video.snippet.title, video.snippet.description),
        collected: false
      }

      uniqueVideos.push(processedVideo)
    }

    // 터짐지수 순으로 정렬
    uniqueVideos.sort((a, b) => b.viralScore - a.viralScore)

    return uniqueVideos

  } catch (error) {
    console.error(`YouTube 검색 오류 (${country}):`, error.message)
    throw new Error(`YouTube 검색 실패: ${error.message}`)
  }
}

// TikTok 스크래핑 (더 현실적인 시뮬레이션)
export async function searchTikTokViral(country, timeRange = 24, minViews = 100000) {
  // 실제로는 웹 스크래핑 또는 비공식 API 사용
  // 현재는 현실적인 시뮬레이션 데이터 반환
  await new Promise(resolve => setTimeout(resolve, 500)) // 0.5초 대기

  const trendingTitles = {
    'KR': [
      '대박 웃긴 강아지 리액션 모음',
      '하루만에 배우는 K-POP 커버댄스',
      '학교 급식 후기 영상',
      '대학생 공감 100% 번아웃 브이로그',
      '카페 사장님의 대혈단 이벤트'
    ],
    'JP': [
      'おもしろ猫動画集',
      'トレンドダンスチャレンジ',
      '日本食リアクション',
      'アニメコスプレメイク',
      '東京ストリートファッション'
    ],
    'US': [
      'Crazy Pet Reactions Compilation',
      'Food Hack That Actually Works',
      'College Dorm Room Tour',
      'Street Interview Gone Wrong',
      'Celebrity Lookalike Pranks'
    ]
  }

  const creators = [
    'trendy_creator', 'viral_master', 'funny_clips', 'daily_vlogs', 'dance_star',
    'comedy_king', 'foodie_love', 'pet_lovers', 'fashion_icon', 'tech_guru'
  ]

  const mockData = []
  const numVideos = Math.floor(Math.random() * 5) + 3 // 3-7개 영상

  for (let i = 0; i < numVideos; i++) {
    const hoursAgo = Math.floor(Math.random() * timeRange)
    const titles = trendingTitles[country] || trendingTitles['US']
    
    mockData.push({
      id: `tiktok_${country}_${Date.now()}_${i}`,
      title: titles[Math.floor(Math.random() * titles.length)],
      channelTitle: `@${creators[Math.floor(Math.random() * creators.length)]}`,
      publishedAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
      thumbnail: `https://picsum.photos/400/300?random=${Date.now()}_${i}`,
      viewCount: Math.floor(Math.random() * 3000000) + minViews,
      likeCount: Math.floor(Math.random() * 100000) + 20000,
      commentCount: Math.floor(Math.random() * 10000) + 2000,
      duration: `PT${Math.floor(Math.random() * 50) + 10}S`,
      url: `https://www.tiktok.com/@creator/video/${Date.now()}_${i}`,
      platform: 'tiktok',
      country: country,
      viralScore: 0,
      hoursAgo: hoursAgo,
      category: categorizeVideo(titles[Math.floor(Math.random() * titles.length)]),
      collected: false
    })
  }

  // 터짐지수 계산
  mockData.forEach(video => {
    video.viralScore = calculateViralScore(video.viewCount, video.publishedAt)
  })

  return mockData.filter(video => video.viralScore > 0 && video.viewCount >= minViews)
}

// Instagram Reels 스크래핑 (더 현실적인 시뮬레이션)
export async function searchInstagramViral(country, timeRange = 24, minViews = 100000) {
  // 실제로는 웹 스크래핑 사용
  // 현재는 현실적인 시뮬레이션 데이터 반환
  await new Promise(resolve => setTimeout(resolve, 500)) // 0.5초 대기

  const reelsTitles = {
    'KR': [
      '메이크업 변신 리얼 타임',
      '서울 카페 투어 브이로그',
      '홈트레이닝 루틴 공개',
      'OOTD 패션 코디',
      '명품하울 언박싱'
    ],
    'JP': [
      'メイクタイムラプス',
      '東京カフェ巡り',
      'フィットネスルーティン',
      'コーディネート紹介',
      'グルメツアー'
    ],
    'US': [
      'Get Ready With Me',
      'Coffee Shop Aesthetic',
      'Workout Transformation',
      'Fashion Haul Try-On',
      'Food Recipe Tutorial'
    ]
  }

  const influencers = [
    'fashion_guru', 'beauty_queen', 'fitness_lover', 'food_blogger', 'travel_diary',
    'style_icon', 'makeup_artist', 'daily_lifestyle', 'healthy_living', 'creative_soul'
  ]

  const mockData = []
  const numVideos = Math.floor(Math.random() * 5) + 3 // 3-7개 영상

  for (let i = 0; i < numVideos; i++) {
    const hoursAgo = Math.floor(Math.random() * timeRange)
    const titles = reelsTitles[country] || reelsTitles['US']
    
    mockData.push({
      id: `instagram_${country}_${Date.now()}_${i}`,
      title: titles[Math.floor(Math.random() * titles.length)],
      channelTitle: `@${influencers[Math.floor(Math.random() * influencers.length)]}`,
      publishedAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
      thumbnail: `https://picsum.photos/400/300?random=${Date.now()}_ig_${i}`,
      viewCount: Math.floor(Math.random() * 2500000) + minViews,
      likeCount: Math.floor(Math.random() * 80000) + 15000,
      commentCount: Math.floor(Math.random() * 8000) + 1500,
      duration: `PT${Math.floor(Math.random() * 60) + 15}S`,
      url: `https://www.instagram.com/reel/${Date.now()}_${i}`,
      platform: 'instagram',
      country: country,
      viralScore: 0,
      hoursAgo: hoursAgo,
      category: categorizeVideo(titles[Math.floor(Math.random() * titles.length)]),
      collected: false
    })
  }

  // 터짐지수 계산
  mockData.forEach(video => {
    video.viralScore = calculateViralScore(video.viewCount, video.publishedAt)
  })

  return mockData.filter(video => video.viralScore > 0 && video.viewCount >= minViews)
}

// API 사용량 추적
let dailyApiUsage = 0
const MAX_DAILY_USAGE = 10000

export function trackApiUsage(units) {
  dailyApiUsage += units
  return {
    used: dailyApiUsage,
    total: MAX_DAILY_USAGE,
    remaining: MAX_DAILY_USAGE - dailyApiUsage
  }
}

export function getApiUsage() {
  return {
    used: dailyApiUsage,
    total: MAX_DAILY_USAGE,
    remaining: MAX_DAILY_USAGE - dailyApiUsage
  }
}

// API 사용량 초기화 (매일 자정)
export function resetDailyUsage() {
  dailyApiUsage = 0
}
