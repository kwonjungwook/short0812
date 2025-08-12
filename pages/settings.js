import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Settings() {
  const [settings, setSettings] = useState({
    // API 설정
    youtubeApiKey: '',
    
    // 검색 기본값
    defaultCountries: ['KR', 'JP', 'US'],
    defaultPlatforms: ['youtube'],
    defaultTimeRange: 24,
    defaultMinViews: 500000,
    
    // 알림 설정
    notifications: {
      highViralScore: true,
      lowApiQuota: true,
      newTrends: false
    },
    
    // 캐시 설정
    cacheEnabled: true,
    cacheTTL: 30, // 분
    
    // UI 설정
    darkMode: true,
    language: 'ko',
    itemsPerPage: 20
  })
  
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  // 설정 저장
  const saveSettings = async () => {
    setLoading(true)
    
    try {
      // 실제로는 API로 저장하지만, 여기서는 localStorage 사용
      localStorage.setItem('viralFinderSettings', JSON.stringify(settings))
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      
    } catch (error) {
      console.error('설정 저장 오류:', error)
      alert('설정 저장 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 설정 로드
  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('viralFinderSettings')
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    } catch (error) {
      console.error('설정 로드 오류:', error)
    }
  }

  // 설정 초기화
  const resetSettings = () => {
    if (confirm('모든 설정을 초기값으로 되돌리시겠습니까?')) {
      localStorage.removeItem('viralFinderSettings')
      window.location.reload()
    }
  }

  // API 키 테스트
  const testApiKey = async () => {
    if (!settings.youtubeApiKey) {
      alert('YouTube API 키를 입력해주세요.')
      return
    }

    try {
      setLoading(true)
      
      // 실제 API 테스트 (간단한 요청)
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=KR&maxResults=1&key=${settings.youtubeApiKey}`)
      
      if (response.ok) {
        alert('✅ API 키가 유효합니다!')
      } else {
        const error = await response.json()
        alert(`❌ API 키 오류: ${error.error?.message || '유효하지 않은 키입니다.'}`)
      }
      
    } catch (error) {
      console.error('API 키 테스트 오류:', error)
      alert('❌ API 키 테스트 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  return (
    <div>
      <Head>
        <title>설정 - 바이럴 콘텐츠 파인더</title>
      </Head>

      <div style={{ padding: '40px 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', textAlign: 'center' }}>
            ⚙️ 설정
          </h1>
          <p style={{ textAlign: 'center', color: '#888', marginBottom: '40px' }}>
            시스템 설정 및 개인화 옵션
          </p>

          {/* API 설정 */}
          <div className="card">
            <h3 style={{ marginBottom: '20px' }}>🔑 API 설정</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600' 
              }}>
                YouTube Data API v3 키
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="password"
                  value={settings.youtubeApiKey}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    youtubeApiKey: e.target.value 
                  }))}
                  placeholder="YouTube API 키를 입력하세요"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    background: '#1a1a1a',
                    color: 'white'
                  }}
                />
                <button 
                  className="btn btn-primary"
                  onClick={testApiKey}
                  disabled={loading || !settings.youtubeApiKey}
                >
                  {loading ? '테스트 중...' : '🧪 테스트'}
                </button>
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                Google Cloud Console에서 발급받은 YouTube Data API v3 키를 입력하세요.
              </div>
            </div>
          </div>

          {/* 검색 기본값 */}
          <div className="card">
            <h3 style={{ marginBottom: '20px' }}>🔍 검색 기본값</h3>
            
            {/* 기본 국가 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600' 
              }}>
                기본 수집 국가
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { code: 'KR', name: '🇰🇷 한국' },
                  { code: 'JP', name: '🇯🇵 일본' },
                  { code: 'US', name: '🇺🇸 미국' }
                ].map(country => (
                  <button
                    key={country.code}
                    className={`filter-btn ${settings.defaultCountries.includes(country.code) ? 'active' : ''}`}
                    onClick={() => {
                      const newCountries = settings.defaultCountries.includes(country.code)
                        ? settings.defaultCountries.filter(c => c !== country.code)
                        : [...settings.defaultCountries, country.code]
                      setSettings(prev => ({ ...prev, defaultCountries: newCountries }))
                    }}
                  >
                    {country.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 기본 플랫폼 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600' 
              }}>
                기본 플랫폼
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { code: 'youtube', name: '📺 YouTube' },
                  { code: 'tiktok', name: '🎵 TikTok' },
                  { code: 'instagram', name: '📷 Instagram' }
                ].map(platform => (
                  <button
                    key={platform.code}
                    className={`filter-btn ${settings.defaultPlatforms.includes(platform.code) ? 'active' : ''}`}
                    onClick={() => {
                      const newPlatforms = settings.defaultPlatforms.includes(platform.code)
                        ? settings.defaultPlatforms.filter(p => p !== platform.code)
                        : [...settings.defaultPlatforms, platform.code]
                      setSettings(prev => ({ ...prev, defaultPlatforms: newPlatforms }))
                    }}
                  >
                    {platform.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 기본 시간 범위 & 조회수 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600' 
                }}>
                  기본 시간 범위 (시간)
                </label>
                <select
                  value={settings.defaultTimeRange}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    defaultTimeRange: Number(e.target.value) 
                  }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    background: '#1a1a1a',
                    color: 'white'
                  }}
                >
                  <option value={1}>1시간</option>
                  <option value={3}>3시간</option>
                  <option value={6}>6시간</option>
                  <option value={12}>12시간</option>
                  <option value={24}>24시간</option>
                </select>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600' 
                }}>
                  기본 최소 조회수
                </label>
                <select
                  value={settings.defaultMinViews}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    defaultMinViews: Number(e.target.value) 
                  }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    background: '#1a1a1a',
                    color: 'white'
                  }}
                >
                  <option value={100000}>10만+</option>
                  <option value={500000}>50만+</option>
                  <option value={1000000}>100만+</option>
                  <option value={2000000}>200만+</option>
                  <option value={5000000}>500만+</option>
                </select>
              </div>
            </div>
          </div>

          {/* 알림 설정 */}
          <div className="card">
            <h3 style={{ marginBottom: '20px' }}>🔔 알림 설정</h3>
            
            {[
              { key: 'highViralScore', label: '고득점 바이럴 영상 발견 시', icon: '🔥' },
              { key: 'lowApiQuota', label: 'API 할당량 부족 시', icon: '⚠️' },
              { key: 'newTrends', label: '새로운 트렌드 감지 시', icon: '📈' }
            ].map(notification => (
              <div key={notification.key} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid #333'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{notification.icon}</span>
                  <span>{notification.label}</span>
                </div>
                <button
                  className={`filter-btn ${settings.notifications[notification.key] ? 'active' : ''}`}
                  onClick={() => setSettings(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      [notification.key]: !prev.notifications[notification.key]
                    }
                  }))}
                  style={{ minWidth: '60px' }}
                >
                  {settings.notifications[notification.key] ? 'ON' : 'OFF'}
                </button>
              </div>
            ))}
          </div>

          {/* 시스템 설정 */}
          <div className="card">
            <h3 style={{ marginBottom: '20px' }}>🖥️ 시스템 설정</h3>
            
            {/* 캐시 설정 */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <span style={{ fontWeight: '600' }}>💾 캐시 사용</span>
                <button
                  className={`filter-btn ${settings.cacheEnabled ? 'active' : ''}`}
                  onClick={() => setSettings(prev => ({
                    ...prev,
                    cacheEnabled: !prev.cacheEnabled
                  }))}
                  style={{ minWidth: '60px' }}
                >
                  {settings.cacheEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
              
              {settings.cacheEnabled && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '14px',
                    color: '#888'
                  }}>
                    캐시 유지 시간 (분)
                  </label>
                  <input
                    type="number"
                    value={settings.cacheTTL}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      cacheTTL: Number(e.target.value) 
                    }))}
                    min="5"
                    max="120"
                    style={{
                      width: '100px',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #333',
                      background: '#1a1a1a',
                      color: 'white'
                    }}
                  />
                  <span style={{ marginLeft: '8px', fontSize: '12px', color: '#888' }}>
                    5-120분 사이
                  </span>
                </div>
              )}
            </div>

            {/* 페이지당 항목 수 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600' 
              }}>
                📄 페이지당 표시 항목 수
              </label>
              <select
                value={settings.itemsPerPage}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  itemsPerPage: Number(e.target.value) 
                }))}
                style={{
                  width: '150px',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #333',
                  background: '#1a1a1a',
                  color: 'white'
                }}
              >
                <option value={10}>10개</option>
                <option value={20}>20개</option>
                <option value={50}>50개</option>
                <option value={100}>100개</option>
              </select>
            </div>
          </div>

          {/* 저장 버튼 */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'center',
            marginTop: '40px'
          }}>
            <button 
              className="btn btn-primary"
              onClick={saveSettings}
              disabled={loading}
              style={{ minWidth: '120px' }}
            >
              {loading ? '저장 중...' : saved ? '✅ 저장됨' : '💾 설정 저장'}
            </button>
            
            <button 
              className="btn btn-danger"
              onClick={resetSettings}
              disabled={loading}
            >
              🔄 초기화
            </button>
          </div>

          {saved && (
            <div style={{
              textAlign: 'center',
              marginTop: '20px',
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid #10b981',
              color: '#10b981'
            }}>
              ✅ 설정이 성공적으로 저장되었습니다!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
