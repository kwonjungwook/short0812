import { useState, useEffect } from 'react'
import Head from 'next/head'
import VideoCard from '../components/VideoCard'
import SearchControls from '../components/SearchControls'
import APIUsage from '../components/APIUsage'

export default function Home() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [apiUsage, setApiUsage] = useState({ used: 0, total: 10000 })
  const [lastSearch, setLastSearch] = useState(null)
  
  // 검색 조건 상태 - 기본값 변경: 10만 이상, 3일(72시간)
  const [searchParams, setSearchParams] = useState({
    countries: ['KR', 'JP', 'US'],
    platforms: ['youtube'],
    categories: [],
    timeRange: 72, // 3일 (72시간)로 변경
    minViews: 100000 // 10만으로 변경
  })

  // 검색 결과를 저장할 상태 추가 (카테고리 필터링 시 원본 유지)
  const [allVideos, setAllVideos] = useState([])
  const [filteredVideos, setFilteredVideos] = useState([])

  // 바이럴 콘텐츠 검색
  const searchViralContent = async (useCache = true) => {
    setLoading(true)
    
    try {
      const params = new URLSearchParams({
        countries: searchParams.countries.join(','),
        platforms: searchParams.platforms.join(','),
        categories: '', // 카테고리는 검색시 비워두고 클라이언트에서 필터링
        timeRange: searchParams.timeRange,
        minViews: searchParams.minViews,
        useCache: useCache
      })
      
      const response = await fetch(`/api/search-viral?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setAllVideos(data.videos) // 전체 결과 저장
        setApiUsage(data.apiUsage)
        setLastSearch(new Date())
        
        // 카테고리 필터 적용
        if (searchParams.categories.length > 0) {
          const filtered = data.videos.filter(video => 
            searchParams.categories.includes(video.category)
          )
          setFilteredVideos(filtered)
          setVideos(filtered)
        } else {
          setFilteredVideos(data.videos)
          setVideos(data.videos)
        }
      } else {
        alert('검색 중 오류가 발생했습니다: ' + data.error)
      }
    } catch (error) {
      console.error('검색 오류:', error)
      alert('검색 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 카테고리 변경시 필터링만 수행 (재검색 X)
  useEffect(() => {
    if (allVideos.length > 0) {
      if (searchParams.categories.length > 0) {
        const filtered = allVideos.filter(video => 
          searchParams.categories.includes(video.category)
        )
        setFilteredVideos(filtered)
        setVideos(filtered)
      } else {
        setFilteredVideos(allVideos)
        setVideos(allVideos)
      }
    }
  }, [searchParams.categories])

  // 영상 수집 (마이에셋에 저장)
  const collectVideo = async (video) => {
    try {
      const response = await fetch('/api/collect-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(video),
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('마이에셋에 수집되었습니다!')
        // 수집된 영상 표시 업데이트
        setVideos(prev => prev.map(v => 
          v.id === video.id ? { ...v, collected: true } : v
        ))
        setAllVideos(prev => prev.map(v => 
          v.id === video.id ? { ...v, collected: true } : v
        ))
      } else {
        alert('수집 중 오류가 발생했습니다: ' + data.error)
      }
    } catch (error) {
      console.error('수집 오류:', error)
      alert('수집 중 오류가 발생했습니다.')
    }
  }

  return (
    <div>
      <Head>
        <title>바이럴 콘텐츠 파인더 - 실시간 트렌드 수집</title>
        <meta name="description" content="한국, 일본, 미국의 최신 바이럴 콘텐츠를 실시간으로 수집하고 분석합니다." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        {/* API 사용량 표시 */}
        <APIUsage usage={apiUsage} />
        
        {/* 검색 컨트롤 */}
        <SearchControls 
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          onSearch={searchViralContent}
          loading={loading}
          lastSearch={lastSearch}
        />

        {/* 검색 결과 */}
        {loading ? (
          <div className="loading">
            <h3>🔍 바이럴 콘텐츠 검색 중...</h3>
            <p>3개국 × 플랫폼별 최신 트렌드를 분석하고 있습니다.</p>
          </div>
        ) : videos.length > 0 ? (
          <>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2>🔥 발견된 바이럴 콘텐츠 ({videos.length}개)</h2>
              <div style={{ fontSize: '14px', color: '#888' }}>
                {searchParams.categories.length > 0 && (
                  <span style={{ marginRight: '10px' }}>
                    필터: {searchParams.categories.join(', ')} | 전체: {allVideos.length}개
                  </span>
                )}
                {lastSearch && `마지막 검색: ${lastSearch.toLocaleTimeString()}`}
              </div>
            </div>
            
            <div className="video-grid">
              {videos.map((video) => (
                <VideoCard 
                  key={video.id} 
                  video={video} 
                  onCollect={() => collectVideo(video)}
                />
              ))}
            </div>
          </>
        ) : allVideos.length > 0 && searchParams.categories.length > 0 ? (
          <div className="empty-state">
            <h3>🔍 선택한 카테고리에 해당하는 영상이 없습니다</h3>
            <p>다른 카테고리를 선택하거나 전체 카테고리로 보기를 시도해보세요.</p>
            <p style={{ marginTop: '10px', fontSize: '14px', color: '#888' }}>
              전체 검색 결과: {allVideos.length}개
            </p>
          </div>
        ) : (
          <div className="empty-state">
            <h3>🎯 바이럴 콘텐츠를 검색해보세요</h3>
            <p>위의 조회 버튼을 클릭하면 최신 트렌드 영상을 찾아드립니다.</p>
            <p style={{ marginTop: '10px', fontSize: '14px', color: '#888' }}>
              기본 설정: 3일 이내, 10만+ 조회수
            </p>
          </div>
        )}
      </div>

      <footer style={{ 
        textAlign: 'center', 
        padding: '40px 20px', 
        color: '#666',
        borderTop: '1px solid #333',
        marginTop: '40px'
      }}>
        <p>🚀 바이럴 콘텐츠 파인더 · 실시간 트렌드 수집 시스템</p>
      </footer>
    </div>
  )
}
