import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Navigation() {
  const router = useRouter()

  const navItems = [
    { href: '/', label: '🔍 콘텐츠 발굴', icon: '🔍' },
    { href: '/my-assets', label: '📁 마이에셋', icon: '📁' },
    { href: '/analytics', label: '📊 분석', icon: '📊' },
    { href: '/settings', label: '⚙️ 설정', icon: '⚙️' }
  ]

  return (
    <nav style={{
      background: '#1a1a1a',
      borderBottom: '1px solid #333',
      padding: '0 20px'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '60px'
      }}>
        {/* 로고 */}
        <Link href="/" style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#3b82f6',
          textDecoration: 'none'
        }}>
          🚀 바이럴 파인더
        </Link>

        {/* 메뉴 */}
        <div style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center'
        }}>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: router.pathname === item.href ? '#3b82f6' : '#888',
                background: router.pathname === item.href ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                border: router.pathname === item.href ? '1px solid #3b82f6' : '1px solid transparent',
                transition: 'all 0.3s ease',
                fontSize: '14px'
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* 사용자 정보 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '14px',
          color: '#888'
        }}>
          <span>👤 사용자</span>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10b981'
          }} />
        </div>
      </div>
    </nav>
  )
}
