import fs from 'fs'
import path from 'path'

const STORAGE_DIR = path.join(process.cwd(), 'data')
const ASSETS_FILE = path.join(STORAGE_DIR, 'collected-assets.json')

// 저장소 초기화
function initStorage() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true })
  }
  
  if (!fs.existsSync(ASSETS_FILE)) {
    fs.writeFileSync(ASSETS_FILE, JSON.stringify([]))
  }
}

// 수집된 영상 목록 가져오기
export function getCollectedVideos() {
  initStorage()
  try {
    const data = fs.readFileSync(ASSETS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('❌ 저장소 읽기 오류:', error)
    return []
  }
}

// 영상 수집 (추가)
export function addCollectedVideo(video) {
  initStorage()
  try {
    const videos = getCollectedVideos()
    
    // 중복 확인
    const exists = videos.some(v => v.id === video.id)
    if (exists) {
      return { success: false, error: '이미 수집된 영상입니다.' }
    }
    
    // 수집 정보 추가
    const collectedVideo = {
      ...video,
      collectedAt: new Date().toISOString(),
      status: 'collected',
      notes: ''
    }
    
    videos.push(collectedVideo)
    fs.writeFileSync(ASSETS_FILE, JSON.stringify(videos, null, 2))
    
    return { success: true, video: collectedVideo, total: videos.length }
  } catch (error) {
    console.error('❌ 영상 저장 오류:', error)
    return { success: false, error: error.message }
  }
}

// 영상 삭제
export function removeCollectedVideo(videoId) {
  initStorage()
  try {
    const videos = getCollectedVideos()
    const index = videos.findIndex(v => v.id === videoId)
    
    if (index === -1) {
      return { success: false, error: '영상을 찾을 수 없습니다.' }
    }
    
    const removed = videos.splice(index, 1)[0]
    fs.writeFileSync(ASSETS_FILE, JSON.stringify(videos, null, 2))
    
    return { success: true, video: removed }
  } catch (error) {
    console.error('❌ 영상 삭제 오류:', error)
    return { success: false, error: error.message }
  }
}

// 영상 상태 업데이트
export function updateVideoStatus(videoId, status, notes = '') {
  initStorage()
  try {
    const videos = getCollectedVideos()
    const video = videos.find(v => v.id === videoId)
    
    if (!video) {
      return { success: false, error: '영상을 찾을 수 없습니다.' }
    }
    
    video.status = status
    video.notes = notes
    video.updatedAt = new Date().toISOString()
    
    fs.writeFileSync(ASSETS_FILE, JSON.stringify(videos, null, 2))
    
    return { success: true, video }
  } catch (error) {
    console.error('❌ 상태 업데이트 오류:', error)
    return { success: false, error: error.message }
  }
}

// 검색 결과 캐시 저장
const SEARCH_CACHE_FILE = path.join(STORAGE_DIR, 'search-cache.json')

export function getSearchCache() {
  initStorage()
  try {
    if (!fs.existsSync(SEARCH_CACHE_FILE)) {
      return {}
    }
    const data = fs.readFileSync(SEARCH_CACHE_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('❌ 캐시 읽기 오류:', error)
    return {}
  }
}

export function saveSearchCache(cacheData) {
  initStorage()
  try {
    fs.writeFileSync(SEARCH_CACHE_FILE, JSON.stringify(cacheData, null, 2))
    return true
  } catch (error) {
    console.error('❌ 캐시 저장 오류:', error)
    return false
  }
}
