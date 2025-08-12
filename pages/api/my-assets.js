import { 
  getCollectedVideos, 
  removeCollectedVideo, 
  updateVideoStatus 
} from '../../lib/storage'

export default async function handler(req, res) {
  const { method } = req

  try {
    switch (method) {
      case 'GET':
        // 수집된 영상 목록 조회
        const videos = getCollectedVideos()
        
        // 카테고리별 통계
        const categoryStats = {}
        const statusStats = {}
        
        videos.forEach(video => {
          // 카테고리 통계
          if (video.category) {
            categoryStats[video.category] = (categoryStats[video.category] || 0) + 1
          }
          
          // 상태 통계
          statusStats[video.status] = (statusStats[video.status] || 0) + 1
        })

        return res.status(200).json({
          success: true,
          videos,
          stats: {
            total: videos.length,
            categories: categoryStats,
            statuses: statusStats,
            platforms: videos.reduce((acc, video) => {
              acc[video.platform] = (acc[video.platform] || 0) + 1
              return acc
            }, {}),
            countries: videos.reduce((acc, video) => {
              acc[video.country] = (acc[video.country] || 0) + 1
              return acc
            }, {})
          }
        })

      case 'DELETE':
        // 영상 삭제
        const { videoId } = req.query
        
        if (!videoId) {
          return res.status(400).json({
            success: false,
            error: '영상 ID가 필요합니다.'
          })
        }

        const removeResult = removeCollectedVideo(videoId)
        
        if (!removeResult.success) {
          return res.status(404).json(removeResult)
        }

        return res.status(200).json({
          success: true,
          message: '영상이 삭제되었습니다.',
          video: removeResult.video
        })

      case 'PUT':
        // 영상 상태 업데이트
        const { videoId: updateVideoId, status, notes } = req.body
        
        if (!updateVideoId || !status) {
          return res.status(400).json({
            success: false,
            error: '영상 ID와 상태가 필요합니다.'
          })
        }

        const updateResult = updateVideoStatus(updateVideoId, status, notes)
        
        if (!updateResult.success) {
          return res.status(404).json(updateResult)
        }

        return res.status(200).json({
          success: true,
          message: '영상 상태가 업데이트되었습니다.',
          video: updateResult.video
        })

      default:
        return res.status(405).json({
          success: false,
          error: '지원하지 않는 메소드입니다.'
        })
    }

  } catch (error) {
    console.error('❌ 마이에셋 API 오류:', error)
    
    return res.status(500).json({
      success: false,
      error: error.message || '서버 오류가 발생했습니다.'
    })
  }
}
