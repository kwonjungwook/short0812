import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function MyAssets() {
  const [assets, setAssets] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    category: '',
    status: '',
    platform: '',
    country: ''
  })

  // 마이에셋 데이터 로드
  const loadAssets = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/my-assets')
      const data = await response.json()
      
      if (data.success) {
        setAssets(data.videos)
        setStats(data.stats)
      } else {
        alert('데이터 로드 실패: ' + data.error)
      }
    } catch (error) {
      console.error('마이에셋 로드 오류:', error)
      alert('데이터 로드 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 영상 삭제
  const deleteVideo = async (videoId) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    
    try {
      const response = await fetch(`/api/my-assets?videoId=${videoId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('삭제되었습니다.')
        loadAssets() // 목록 새로고침
      } else {
        alert('삭제 실패: ' + data.error)
      }
    } catch (error) {
      console.error('삭제 오류:', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  // 상태 업데이트
  const updateStatus = async (videoId, status) => {
    try {
      const response = await fetch('/api/my-assets', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          videoId,
          status,
          notes: ''
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        loadAssets() // 목록 새로고침
      } else {
        alert('상태 업데이트 실패: ' + data.error)
      }
    } catch (error) {
      console.error('상태 업데이트 오류:', error)
      alert('상태 업데이트 중 오류가 발생했습니다.')
    }
  }

  // 필터링된 영상 목록
  const filteredAssets = assets.filter(video => {
    if (filter.category && video.category !== filter.category) return false
    if (filter.status && video.status !== filter.status) return false
    if (filter.platform && video.platform !== filter.platform) return false
    if (filter.country && video.country !== filter.country) return false
    return true
  })

  useEffect(() => {
    loadAssets()
  }, [])

  if (loading) {
    return (
      <div className="loading">
        <h3>📁 마이에셋 로딩 중...</h3>
      </div>
    )
  }

  return (
    <div>
      <Head>
        <title>마이에셋 관리 - 바이럴 콘텐츠 파인더</title>
      </Head>

      {/* 헤더 */}
      <header className="header">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '2rem' }}>📁 마이에셋 관리</h1>
              <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>
                수집한 바이럴 콘텐츠 관리 및 편집 준비
              </p>
            </div>
            <Link href="/" className="btn btn-primary">
              🔍 콘텐츠 발굴로 돌아가기
            </Link>
          </div>
        </div>
      </header>

      <div className="container">
        {/* 통계 대시보드 */}
        <div className="card">
          <h3 style={{ marginBottom: '15px' }}>📊 수집 현황</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '15px' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                {stats.total || 0}
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>총 수집 영상</div>
            </div>
            
            {stats.statuses && Object.entries(stats.statuses).map(([status, count]) => (
              <div key={status} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                  {count}
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  {status === 'collected' ? '수집됨' : 
                   status === 'in_progress' ? '편집중' : 
                   status === 'completed' ? '완료' : status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 필터 */}
        <div className="card">
          <h3 style={{ marginBottom: '15px' }}>🔍 필터</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px' 
          }}>
            {/* 카테고리 필터 */}
            <div>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>
                카테고리
              </label>
              <select 
                value={filter.category}
                onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #333',
                  background: '#1a1a1a',
                  color: 'white'
                }}
              >
                <option value="">전체</option>
                {stats.categories && Object.keys(stats.categories).map(category => (
                  <option key={category} value={category}>
                    {category} ({stats.categories[category]})
                  </option>
                ))}
              </select>
            </div>

            {/* 상태 필터 */}
            <div>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>
                상태
              </label>
              <select 
                value={filter.status}
                onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #333',
                  background: '#1a1a1a',
                  color: 'white'
                }}
              >
                <option value="">전체</option>
                <option value="collected">수집됨</option>
                <option value="in_progress">편집중</option>
                <option value="completed">완료</option>
              </select>
            </div>

            {/* 플랫폼 필터 */}
            <div>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>
                플랫폼
              </label>
              <select 
                value={filter.platform}
                onChange={(e) => setFilter(prev => ({ ...prev, platform: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #333',
                  background: '#1a1a1a',
                  color: 'white'
                }}
              >
                <option value="">전체</option>
                {stats.platforms && Object.keys(stats.platforms).map(platform => (
                  <option key={platform} value={platform}>
                    {platform === 'youtube' ? '📺 YouTube' : 
                     platform === 'tiktok' ? '🎵 TikTok' : 
                     platform === 'instagram' ? '📷 Instagram' : platform}
                     ({stats.platforms[platform]})
                  </option>
                ))}
              </select>
            </div>

            {/* 국가 필터 */}
            <div>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>
                국가
              </label>
              <select 
                value={filter.country}
                onChange={(e) => setFilter(prev => ({ ...prev, country: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #333',
                  background: '#1a1a1a',
                  color: 'white'
                }}
              >
                <option value="">전체</option>
                {stats.countries && Object.keys(stats.countries).map(country => (
                  <option key={country} value={country}>
                    {country === 'KR' ? '🇰🇷 한국' : 
                     country === 'JP' ? '🇯🇵 일본' : 
                     country === 'US' ? '🇺🇸 미국' : country}
                     ({stats.countries[country]})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 영상 목록 */}
        {filteredAssets.length > 0 ? (
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2>📋 수집된 영상 ({filteredAssets.length}개)</h2>
              <button 
                className="btn btn-primary"
                onClick={loadAssets}
              >
                🔄 새로고침
              </button>
            </div>
            
            <div className="video-grid">
              {filteredAssets.map((video) => (
                <div key={video.id} className="video-card">
                  {/* 썸네일 */}
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="video-thumbnail"
                  />
                  
                  {/* 영상 정보 */}
                  <div className="video-info">
                    {/* 카테고리 & 상태 */}
                    <div style={{ marginBottom: '8px', display: 'flex', gap: '4px' }}>
                      <span className="category-badge">{video.category}</span>
                      <span style={{
                        fontSize: '11px',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        background: video.status === 'completed' ? '#10b981' : 
                                   video.status === 'in_progress' ? '#f59e0b' : '#6b7280',
                        color: 'white'
                      }}>
                        {video.status === 'collected' ? '수집됨' : 
                         video.status === 'in_progress' ? '편집중' : 
                         video.status === 'completed' ? '완료' : video.status}
                      </span>
                    </div>

                    <h3 className="video-title">{video.title}</h3>
                    
                    <div className="video-meta">
                      📺 {video.channelTitle} · 
                      {video.platform === 'youtube' ? '📺' : 
                       video.platform === 'tiktok' ? '🎵' : '📷'} · 
                      {video.country === 'KR' ? '🇰🇷' : 
                       video.country === 'JP' ? '🇯🇵' : '🇺🇸'}
                    </div>

                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>
                      수집일: {new Date(video.collectedAt).toLocaleDateString('ko-KR')}
                    </div>

                    {/* 액션 버튼 */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <a 
                        href={video.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ fontSize: '11px', padding: '6px 10px' }}
                      >
                        ▶️ 보기
                      </a>
                      
                      {video.status === 'collected' && (
                        <button 
                          className="btn btn-success"
                          style={{ fontSize: '11px', padding: '6px 10px' }}
                          onClick={() => updateStatus(video.id, 'in_progress')}
                        >
                          ✏️ 편집시작
                        </button>
                      )}
                      
                      {video.status === 'in_progress' && (
                        <button 
                          className="btn btn-success"
                          style={{ fontSize: '11px', padding: '6px 10px' }}
                          onClick={() => updateStatus(video.id, 'completed')}
                        >
                          ✅ 완료
                        </button>
                      )}
                      
                      <button 
                        className="btn btn-danger"
                        style={{ fontSize: '11px', padding: '6px 10px' }}
                        onClick={() => deleteVideo(video.id)}
                      >
                        🗑️ 삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <h3>📁 수집된 영상이 없습니다</h3>
            <p>콘텐츠 발굴에서 영상을 수집해보세요.</p>
            <Link href="/" className="btn btn-primary">
              🔍 콘텐츠 발굴하기
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
