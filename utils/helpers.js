// 날짜 및 시간 유틸리티
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR')
}

export const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('ko-KR')
}

export const formatTimeAgo = (dateString) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now - date
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  
  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`
  } else {
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}일 전`
  }
}

// 숫자 포맷팅
export const formatNumber = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toLocaleString()
}

export const formatViralScore = (score) => {
  if (score >= 1000000000) {
    return (score / 1000000000).toFixed(1) + 'B'
  }
  if (score >= 1000000) {
    return (score / 1000000).toFixed(1) + 'M'
  }
  if (score >= 1000) {
    return (score / 1000).toFixed(1) + 'K'
  }
  return score.toString()
}

// 플랫폼 관련 유틸리티
export const getPlatformInfo = (platform) => {
  const platforms = {
    youtube: { icon: '📺', name: 'YouTube', color: '#ff0000' },
    tiktok: { icon: '🎵', name: 'TikTok', color: '#000000' },
    instagram: { icon: '📷', name: 'Instagram', color: '#e91e63' }
  }
  return platforms[platform] || { icon: '🎬', name: platform, color: '#888' }
}

// 국가 관련 유틸리티
export const getCountryInfo = (countryCode) => {
  const countries = {
    KR: { flag: '🇰🇷', name: '한국', color: '#ef4444' },
    JP: { flag: '🇯🇵', name: '일본', color: '#f59e0b' },
    US: { flag: '🇺🇸', name: '미국', color: '#3b82f6' }
  }
  return countries[countryCode] || { flag: '🌍', name: countryCode, color: '#888' }
}

// 카테고리 관련 유틸리티
export const getCategoryInfo = (category) => {
  const categories = {
    '뷰티': { icon: '🧴', color: '#ec4899' },
    '연예인': { icon: '⭐', color: '#f59e0b' },
    '꿀팁/생활': { icon: '🏠', color: '#10b981' },
    '건강/다이어트': { icon: '💪', color: '#06b6d4' },
    '디지털/가전': { icon: '📱', color: '#6366f1' },
    '동물': { icon: '🐾', color: '#84cc16' },
    '영화/엔터': { icon: '🎬', color: '#ef4444' },
    '지식/정보': { icon: '🧠', color: '#8b5cf6' },
    '법정/사건': { icon: '⚖️', color: '#64748b' },
    '기타': { icon: '📋', color: '#6b7280' }
  }
  return categories[category] || categories['기타']
}

// 터짐지수 레벨 계산
export const getViralLevel = (score) => {
  if (score >= 50000000) return { level: 'legendary', label: '전설급', color: '#fbbf24', emoji: '🔥🔥🔥' }
  if (score >= 20000000) return { level: 'epic', label: '대박급', color: '#f97316', emoji: '🔥🔥' }
  if (score >= 10000000) return { level: 'high', label: '고득점', color: '#ef4444', emoji: '🔥' }
  if (score >= 5000000) return { level: 'good', label: '우수', color: '#eab308', emoji: '✨' }
  if (score >= 1000000) return { level: 'normal', label: '보통', color: '#10b981', emoji: '👍' }
  return { level: 'low', label: '낮음', color: '#6b7280', emoji: '📈' }
}

// 시간 가중치 배지 스타일
export const getTimeBadgeStyle = (hoursAgo) => {
  if (hoursAgo <= 3) {
    return { 
      className: 'time-urgent', 
      label: `⚡ ${hoursAgo}시간 전`, 
      color: '#ef4444' 
    }
  }
  if (hoursAgo <= 8) {
    return { 
      className: 'time-high', 
      label: `🔥 ${hoursAgo}시간 전`, 
      color: '#f97316' 
    }
  }
  if (hoursAgo <= 16) {
    return { 
      className: 'time-medium', 
      label: `⏰ ${hoursAgo}시간 전`, 
      color: '#eab308' 
    }
  }
  return { 
    className: 'time-low', 
    label: `📅 ${hoursAgo}시간 전`, 
    color: '#22c55e' 
  }
}

// URL 유틸리티
export const createYouTubeUrl = (videoId) => {
  return `https://www.youtube.com/watch?v=${videoId}`
}

export const createShortsUrl = (videoId) => {
  return `https://www.youtube.com/shorts/${videoId}`
}

export const extractVideoId = (url) => {
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    /youtube\.com\/shorts\/([^"&?\/\s]{11})/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  return null
}

// 텍스트 유틸리티
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const highlightKeywords = (text, keywords) => {
  if (!keywords || keywords.length === 0) return text
  
  let highlightedText = text
  keywords.forEach(keyword => {
    const regex = new RegExp(`(${keyword})`, 'gi')
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>')
  })
  
  return highlightedText
}

// 로컬 스토리지 유틸리티
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('로컬 스토리지 저장 오류:', error)
    return false
  }
}

export const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('로컬 스토리지 로드 오류:', error)
    return defaultValue
  }
}

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('로컬 스토리지 삭제 오류:', error)
    return false
  }
}

// API 에러 처리
export const handleApiError = (error, fallbackMessage = '알 수 없는 오류가 발생했습니다.') => {
  if (error.response) {
    // API 응답 에러
    return error.response.data?.message || error.response.data?.error || fallbackMessage
  } else if (error.request) {
    // 네트워크 에러
    return '네트워크 연결을 확인해주세요.'
  } else {
    // 기타 에러
    return error.message || fallbackMessage
  }
}

// 파일 다운로드 유틸리티
export const downloadAsJSON = (data, filename = 'data.json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { 
    type: 'application/json' 
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const downloadAsCSV = (data, filename = 'data.csv') => {
  if (!data || data.length === 0) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// 색상 유틸리티
export const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// 디바운스 유틸리티
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 배열 유틸리티
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = (groups[item[key]] || [])
    group.push(item)
    groups[item[key]] = group
    return groups
  }, {})
}

export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (order === 'desc') {
      return b[key] - a[key]
    }
    return a[key] - b[key]
  })
}

// 브라우저 호환성 체크
export const isSupported = {
  localStorage: () => {
    try {
      const test = '__test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (e) {
      return false
    }
  },
  
  webNotifications: () => {
    return 'Notification' in window
  },
  
  webShare: () => {
    return 'share' in navigator
  }
}
