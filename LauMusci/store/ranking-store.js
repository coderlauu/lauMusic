// 引入全局状态管理工具
import {
    HYEventStore
} from 'hy-event-store'

import {
    getRankings
} from '../service/api_music'

const rankingMap = {
    0: 'newRanking',
    1: 'hotRanking',
    2: 'originRanking',
    3: 'upRanking'
}
const rankingStore = new HYEventStore({
    state: {
        newRanking: {},
        hotRanking: {},
        originRanking: {},
        upRanking: {}
    },
    actions: {
        getRankingDataAction(ctx) {
            for (let i = 0; i < 4; i++) {
                getRankings(i).then(res => {
                    const rankingName = rankingMap[i]
                    // 通过dispatch请求数据，然后把数据返回到这里
                    ctx[rankingName] = res.playlist
                })
            }
        }
    }
})

export {
    rankingStore,rankingMap
}