import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    totalSearches: 0,
    totalCollected: 0,
    topCountries: {},
    topCategories: {},
    topPlatforms: {},
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

  // 분석 데이터 로드
  const loadAnalytics = async () => {
    try {
      setLoading(true)
      
      // 실제로는 API에서 데이터를 가져오지만, 시뮬레이션 데이터 사용
      const mockData = {
        totalSearches: 47,
        totalCollected: 23,
        topCountries: {
          'JP': 15,
          'US': 12,
          'KR': 8
        },
        topCategories: {
          '동물': 8,
          '뷰티': 6,
          '꿀팁/생활': 4,
          '연예인': 3,
          '지식/정보': 2
        },
        topPlatforms: {
          'youtube': 20,
          'tiktok': 2,
          'instagram': 1
        },
        recentActivity: [
          {
            id: 1,
            type: 'search',
            description: '일본 YouTube 콘텐츠 검색',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            result: '12개 바이럴 영상 발견'
          },
          {
            id: 2,
            type: 'collect',
            description: '동물 카테고리 영상 수집',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            result: '마이에셋에 저장됨'
          },
          {
            id: 3,
            type: 'search',
            description: '미국 TikTok 트렌드 검색',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            result: '8개 바이럴 영상 발견'
          }
        ]
      }
      
      setAnalytics(mockData)
      
    } catch (error) {
      console.error('분석 데이터 로드 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="loading">
        <h3>📊 분석 데이터 로딩 중...</h3>
      </div>
    )
  }

  return (
    <div>
      <Head>
        <title>분석 대시보드 - 바이럴 콘텐츠 파인더</title>
      </Head>

      <div style={{ padding: '40px 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', textAlign: 'center' }}>
            📊 분석 대시보드
          </h1>
          <p style={{ textAlign: 'center', color: '#888', marginBottom: '40px' }}>
            수집 활동 및 트렌드 분석
          </p>

          {/* 주요 지표 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', color: '#3b82f6', marginBottom: '10px' }}>
                {analytics.totalSearches}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>총 검색 횟수</div>
              <div style={{ fontSize: '12px', color: '#888' }}>누적 바이럴 검색</div>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', color: '#10b981', marginBottom: '10px' }}>
                {analytics.totalCollected}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>수집한 영상</div>
              <div style={{ fontSize: '12px', color: '#888' }}>마이에셋 저장</div>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', color: '#f59e0b', marginBottom: '10px' }}>
                {Math.round((analytics.totalCollected / analytics.totalSearches) * 100)}%
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>수집 성공률</div>
              <div style={{ fontSize: '12px', color: '#888' }}>검색 대비 수집률</div>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', color: '#ef4444', marginBottom: '10px' }}>
                2.3
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>평균 터짐지수</div>
              <div style={{ fontSize: '12px', color: '#888' }}>수집 영상 기준 (M)</div>
            </div>
          </div>

          {/* 차트 섹션 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {/* 국가별 분포 */}
            <div className="card">
              <h3 style={{ marginBottom: '20px' }}>🌍 국가별 수집 분포</h3>
              {Object.entries(analytics.topCountries).map(([country, count]) => (
                <div key={country} style={{ marginBottom: '15px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '5px'
                  }}>
                    <span>
                      {country === 'KR' ? '🇰🇷 한국' : 
                       country === 'JP' ? '🇯🇵 일본' : 
                       country === 'US' ? '🇺🇸 미국' : country}
                    </span>
                    <span style={{ fontWeight: '600' }}>{count}개</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#333',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(count / Math.max(...Object.values(analytics.topCountries))) * 100}%`,
                      height: '100%',
                      background: country === 'KR' ? '#ef4444' : 
                                 country === 'JP' ? '#f59e0b' : '#3b82f6',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* 카테고리별 분포 */}
            <div className="card">
              <h3 style={{ marginBottom: '20px' }}>🏷️ 카테고리별 수집 분포</h3>
              {Object.entries(analytics.topCategories).map(([category, count]) => (
                <div key={category} style={{ marginBottom: '15px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '5px'
                  }}>
                    <span>{category}</span>
                    <span style={{ fontWeight: '600' }}>{count}개</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#333',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(count / Math.max(...Object.values(analytics.topCategories))) * 100}%`,
                      height: '100%',
                      background: '#10b981',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* 플랫폼별 분포 */}
            <div className="card">
              <h3 style={{ marginBottom: '20px' }}>📱 플랫폼별 수집 분포</h3>
              {Object.entries(analytics.topPlatforms).map(([platform, count]) => (
                <div key={platform} style={{ marginBottom: '15px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '5px'
                  }}>
                    <span>
                      {platform === 'youtube' ? '📺 YouTube' : 
                       platform === 'tiktok' ? '🎵 TikTok' : 
                       platform === 'instagram' ? '📷 Instagram' : platform}
                    </span>
                    <span style={{ fontWeight: '600' }}>{count}개</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#333',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(count / Math.max(...Object.values(analytics.topPlatforms))) * 100}%`,
                      height: '100%',
                      background: platform === 'youtube' ? '#ef4444' : 
                                 platform === 'tiktok' ? '#000000' : '#e91e63',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 최근 활동 */}
          <div className="card">
            <h3 style={{ marginBottom: '20px' }}>📈 최근 활동</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {analytics.recentActivity.map((activity) => (
                <div key={activity.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid #333'
                }}>
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px'
                    }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        background: activity.type === 'search' ? '#3b82f6' : '#10b981',
                        color: 'white'
                      }}>
                        {activity.type === 'search' ? '🔍 검색' : '💾 수집'}
                      </span>
                      <span style={{ fontWeight: '600' }}>{activity.description}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      {activity.result}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    {new Date(activity.timestamp).toLocaleString('ko-KR')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 추천 액션 */}
          <div className="card">
            <h3 style={{ marginBottom: '20px' }}>💡 추천 액션</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '15px'
            }}>
              <div style={{
                padding: '15px',
                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid #3b82f6'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '5px' }}>
                  🇯🇵 일본 콘텐츠 집중
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  일본에서 가장 높은 수집률을 보이고 있습니다.
                </div>
              </div>
              
              <div style={{
                padding: '15px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid #10b981'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '5px' }}>
                  🐾 동물 카테고리 확장
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  동물 카테고리에서 좋은 성과를 보이고 있습니다.
                </div>
              </div>

              <div style={{
                padding: '15px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid #f59e0b'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '5px' }}>
                  📺 YouTube 최적화
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  YouTube에서 가장 많은 영상을 수집했습니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
