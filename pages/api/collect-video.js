import { 
  getCollectedVideos, 
  addCollectedVideo, 
  removeCollectedVideo, 
  updateVideoStatus 
} from '../../lib/storage'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const video = req.body

    // 입력 검증
    if (!video || !video.id) {
      return res.status(400).json({
        success: false,
        error: '영상 정보가 올바르지 않습니다.'
      })
    }

    // 영상 수집 (파일 시스템에 저장)
    const result = addCollectedVideo(video)

    if (!result.success) {
      return res.status(400).json(result)
    }

    console.log(`✅ 영상 수집됨: ${video.title} (${video.platform} ${video.country})`)

    return res.status(200).json({
      success: true,
      message: '영상이 마이에셋에 수집되었습니다.',
      video: result.video,
      totalCollected: result.total
    })

  } catch (error) {
    console.error('❌ 영상 수집 API 오류:', error)
    
    return res.status(500).json({
      success: false,
      error: error.message || '서버 오류가 발생했습니다.'
    })
  }
}

// 외부에서 사용하기 위한 export (다른 API에서 사용)
export { 
  getCollectedVideos, 
  removeCollectedVideo, 
  updateVideoStatus 
}
