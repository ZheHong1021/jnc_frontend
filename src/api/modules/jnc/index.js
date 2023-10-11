import axios from 'axios'

const instance = axios.create({
    baseURL: '/api/jnc'
})


/* 監測場域 */
export const exportAPIGetPositions = (params) => instance.get('/positions', {params})
export const exportAPIGetSinglePosition = (id, params) => instance.get(`/position/${id}`, {params})

/* 監測設備 */
export const exportAPIGetDevices = (params) => instance.get('/devices', {params})
export const exportAPIGetSingleDevice = (id, params) => instance.get(`/device/${id}`, {params})

/* 監測數據 - 即時 */
export const exportAPIGetInspects = (params) => instance.get('/inspects', {params})
export const exportAPIGetSingleInspect = (id, params) => instance.get(`/inspect/${id}`, {params})

/* 監測數據 - 歷史 */
export const exportAPIGetHistoryInspects = (params) => instance.get('/history-inspects', {params})
export const exportAPIGetSingleHistoryInspect = (id, params) => instance.get(`/history-inspect/${id}`, {params})
