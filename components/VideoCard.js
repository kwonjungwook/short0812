import Image from 'next/image'

export default function VideoCard({ video, onCollect }) {
  // 시간 가중치에 따른 배지 색상
  const getTimeBadgeClass = (hoursAgo) => {
    if (hoursAgo <= 3) return 'time-urgent'
    if (hoursAgo <= 8) return 'time-high'
    if (hoursAgo <= 16) return 'time-medium'
    return 'time-low'
  }

  // 숫자 포맷팅
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  // 터짐지수 포맷팅
  const formatViralScore = (score) => {
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

  // 플랫폼 아이콘
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'youtube': return '📺'
      case 'tiktok': return '🎵'
      case 'instagram': return '📷'
      default: return '🎬'
    }
  }

  // 국가 플래그
  const getCountryFlag = (country) => {
    switch (country) {
      case 'KR': return '🇰🇷'
      case 'JP': return '🇯🇵'
      case 'US': return '🇺🇸'
      default: return '🌍'
    }
  }

  return (
    <div className="video-card">
      {/* 썸네일 */}
      <div style={{ position: 'relative' }}>
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="video-thumbnail"
          onError={(e) => {
            e.target.src = '/default-thumbnail.jpg'
          }}
        />
        
        {/* 시간 배지 */}
        <div style={{ 
          position: 'absolute', 
          top: '8px', 
          left: '8px',
          display: 'flex',
          gap: '4px'
        }}>
          <span className={`time-badge ${getTimeBadgeClass(video.hoursAgo)}`}>
            ⏱️ {video.hoursAgo}시간 전
          </span>
        </div>

        {/* 플랫폼 & 국가 배지 */}
        <div style={{ 
          position: 'absolute', 
          top: '8px', 
          right: '8px',
          display: 'flex',
          gap: '4px'
        }}>
          <span style={{
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '11px'
          }}>
            {getPlatformIcon(video.platform)} {getCountryFlag(video.country)}
          </span>
        </div>
      </div>

      {/* 영상 정보 */}
      <div className="video-info">
        {/* 카테고리 */}
        {video.category && (
          <div style={{ marginBottom: '8px' }}>
            <span className="category-badge">{video.category}</span>
          </div>
        )}

        {/* 제목 */}
        <h3 className="video-title">{video.title}</h3>

        {/* 채널 정보 */}
        <div className="video-meta">
          📺 {video.channelTitle}
        </div>

        {/* 통계 */}
        <div className="video-stats">
          <div style={{ fontSize: '12px', color: '#888' }}>
            👀 {formatNumber(video.viewCount)} · 
            👍 {formatNumber(video.likeCount)} · 
            💬 {formatNumber(video.commentCount)}
          </div>
          <div className="viral-score">
            🔥 {formatViralScore(video.viralScore)}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginTop: '12px' 
        }}>
          <button 
            className={video.collected ? "btn btn-success" : "btn btn-primary"}
            onClick={onCollect}
            disabled={video.collected}
            style={{ flex: 1, fontSize: '12px' }}
          >
            {video.collected ? '✅ 수집됨' : '💾 수집하기'}
          </button>
          
          <a 
            href={video.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ 
              backgroundColor: '#374151',
              color: 'white',
              fontSize: '12px',
              padding: '8px 12px'
            }}
          >
            ▶️ 보기
          </a>
        </div>

        {/* 업로드 시간 */}
        <div style={{ 
          fontSize: '11px', 
          color: '#666', 
          marginTop: '8px',
          textAlign: 'center'
        }}>
          📅 {new Date(video.publishedAt).toLocaleDateString('ko-KR')} {new Date(video.publishedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}
