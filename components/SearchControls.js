export default function SearchControls({ 
  searchParams, 
  setSearchParams, 
  onSearch, 
  loading, 
  lastSearch 
}) {
  
  // 국가 선택 토글
  const toggleCountry = (country) => {
    setSearchParams(prev => ({
      ...prev,
      countries: prev.countries.includes(country)
        ? prev.countries.filter(c => c !== country)
        : [...prev.countries, country]
    }))
  }

  // 플랫폼 선택 토글
  const togglePlatform = (platform) => {
    setSearchParams(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
  }

  // 카테고리 선택 토글
  const toggleCategory = (category) => {
    setSearchParams(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  // 캐시 여부에 따른 검색
  const handleSearch = (useCache) => {
    onSearch(useCache)
  }

  const categories = [
    '뷰티', '연예인', '꿀팁/생활', '건강/다이어트', '디지털/가전',
    '동물', '영화/엔터', '지식/정보', '법정/사건'
  ]

  return (
    <div className="search-controls">
      {/* 국가 선택 */}
      <div className="control-group">
        <label className="control-label">🌍 수집 국가</label>
        <div className="control-buttons">
          {[
            { code: 'KR', name: '🇰🇷 한국' },
            { code: 'JP', name: '🇯🇵 일본' },
            { code: 'US', name: '🇺🇸 미국' }
          ].map(country => (
            <button
              key={country.code}
              className={`filter-btn ${searchParams.countries.includes(country.code) ? 'active' : ''}`}
              onClick={() => toggleCountry(country.code)}
            >
              {country.name}
            </button>
          ))}
        </div>
      </div>

      {/* 플랫폼 선택 */}
      <div className="control-group">
        <label className="control-label">📱 수집 플랫폼</label>
        <div className="control-buttons">
          {[
            { code: 'youtube', name: '📺 YouTube' },
            { code: 'tiktok', name: '🎵 TikTok' },
            { code: 'instagram', name: '📷 Instagram' }
          ].map(platform => (
            <button
              key={platform.code}
              className={`filter-btn ${searchParams.platforms.includes(platform.code) ? 'active' : ''}`}
              onClick={() => togglePlatform(platform.code)}
            >
              {platform.name}
            </button>
          ))}
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="control-group">
        <label className="control-label">🏷️ 카테고리 필터 (선택사항)</label>
        <div className="control-buttons">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${searchParams.categories.includes(category) ? 'active' : ''}`}
              onClick={() => toggleCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 검색 조건 */}
      <div className="control-group">
        <label className="control-label">⚙️ 검색 조건</label>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px',
          marginTop: '10px'
        }}>
          
          {/* 시간 범위 */}
          <div>
            <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>
              ⏰ 시간 범위
            </label>
            <select 
              value={searchParams.timeRange}
              onChange={(e) => setSearchParams(prev => ({ ...prev, timeRange: Number(e.target.value) }))}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #333',
                background: '#1a1a1a',
                color: 'white'
              }}
            >
              <option value={1}>1시간 이내</option>
              <option value={3}>3시간 이내</option>
              <option value={6}>6시간 이내</option>
              <option value={12}>12시간 이내</option>
              <option value={24}>24시간 이내 (1일)</option>
              <option value={48}>48시간 이내 (2일)</option>
              <option value={72}>72시간 이내 (3일)</option>
            </select>
          </div>

          {/* 최소 조회수 */}
          <div>
            <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>
              👀 최소 조회수
            </label>
            <select 
              value={searchParams.minViews}
              onChange={(e) => setSearchParams(prev => ({ ...prev, minViews: Number(e.target.value) }))}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
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

      {/* 검색 버튼 */}
      <div className="control-group">
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            className="btn btn-primary"
            onClick={() => handleSearch(true)}
            disabled={loading || searchParams.countries.length === 0}
            style={{ minWidth: '140px' }}
          >
            {loading ? '🔍 검색 중...' : '💾 캐시 우선 조회'}
          </button>
          
          <button 
            className="btn btn-success"
            onClick={() => handleSearch(false)}
            disabled={loading || searchParams.countries.length === 0}
            style={{ minWidth: '140px' }}
          >
            {loading ? '🔍 검색 중...' : '⚡ 실시간 조회'}
          </button>
        </div>
        
        {searchParams.countries.length === 0 && (
          <p style={{ 
            textAlign: 'center', 
            color: '#ef4444', 
            fontSize: '12px', 
            marginTop: '8px',
            marginBottom: 0
          }}>
            최소 1개 국가를 선택해주세요.
          </p>
        )}
      </div>

      {/* 마지막 검색 정보 */}
      {lastSearch && (
        <div style={{ 
          textAlign: 'center', 
          fontSize: '12px', 
          color: '#666', 
          marginTop: '10px' 
        }}>
          마지막 검색: {lastSearch.toLocaleString('ko-KR')}
        </div>
      )}
    </div>
  )
}
