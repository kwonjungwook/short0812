export default function APIUsage({ usage }) {
  const percentage = (usage.used / usage.total) * 100

  const getStatusColor = () => {
    if (percentage >= 90) return '#ef4444' // 빨강 - 위험
    if (percentage >= 70) return '#f97316' // 주황 - 주의  
    if (percentage >= 30) return '#eab308' // 노랑 - 보통
    return '#10b981' // 초록 - 여유
  }

  const getStatusText = () => {
    if (percentage >= 90) return '⚫ 한계 (90%+)'
    if (percentage >= 70) return '🔴 위험 (70-90%)'
    if (percentage >= 30) return '🟡 주의 (30-70%)'
    return '🟢 여유 (0-30%)'
  }

  const getRemainingCalls = () => {
    const remaining = usage.total - usage.used
    const estimatedCalls = Math.floor(remaining / 300) // 1회 조회당 약 300 units
    return estimatedCalls
  }

  return (
    <div className="api-usage">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <div>
          <span style={{ fontWeight: '600', fontSize: '14px' }}>
            📊 API 사용량
          </span>
          <span style={{ 
            marginLeft: '12px',
            color: getStatusColor(),
            fontWeight: '600',
            fontSize: '12px'
          }}>
            {getStatusText()}
          </span>
        </div>
        
        <div style={{ fontSize: '12px', color: '#888' }}>
          {usage.used.toLocaleString()} / {usage.total.toLocaleString()} units ({percentage.toFixed(1)}%)
        </div>
      </div>

      {/* 사용량 바 */}
      <div className="usage-bar">
        <div 
          className="usage-fill"
          style={{ 
            width: `${percentage}%`,
            background: getStatusColor()
          }}
        />
      </div>

      {/* 추가 정보 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '8px',
        fontSize: '12px',
        color: '#888'
      }}>
        <span>
          🔍 예상 남은 조회 횟수: <strong style={{ color: 'white' }}>{getRemainingCalls()}회</strong>
        </span>
        <span>
          🔄 일일 리셋: 매일 자정 (PST)
        </span>
      </div>

      {/* 경고 메시지 */}
      {percentage >= 70 && (
        <div style={{
          marginTop: '8px',
          padding: '8px 12px',
          borderRadius: '6px',
          background: percentage >= 90 ? '#ef4444' : '#f97316',
          color: 'white',
          fontSize: '12px',
          textAlign: 'center'
        }}>
          {percentage >= 90 
            ? '⚠️ API 할당량이 거의 소진되었습니다. 캐시 우선 조회를 사용해주세요.'
            : '⚠️ API 사용량이 많습니다. 효율적인 조회를 권장합니다.'
          }
        </div>
      )}

      {/* 절약 팁 */}
      {percentage >= 30 && (
        <details style={{ marginTop: '8px' }}>
          <summary style={{ 
            fontSize: '12px', 
            color: '#888', 
            cursor: 'pointer',
            userSelect: 'none'
          }}>
            💡 API 절약 팁
          </summary>
          <div style={{ 
            fontSize: '11px', 
            color: '#888', 
            marginTop: '4px',
            paddingLeft: '16px'
          }}>
            • 캐시 우선 조회 사용 (30분간 결과 재사용)<br/>
            • 국가/플랫폼 선택적 조회<br/>
            • 시간 범위를 짧게 설정<br/>
            • 카테고리 필터 활용
          </div>
        </details>
      )}
    </div>
  )
}
