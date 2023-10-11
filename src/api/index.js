// API 管理

/* JNC */
import { 
    exportAPIGetPositions, exportAPIGetSinglePosition,
    exportAPIGetDevices, exportAPIGetSingleDevice,
    exportAPIGetInspects, exportAPIGetSingleInspect,
    exportAPIGetHistoryInspects, exportAPIGetSingleHistoryInspect,
 } from "./modules/jnc";

/* 監測場域 */
export const apiGetPositions = exportAPIGetPositions
export const apiGetSinglePosition = exportAPIGetSinglePosition

/* 監測設備 */
export const apiGetDevices = exportAPIGetDevices
export const apiGetSingleDevice = exportAPIGetSingleDevice

/* 監測數據 - 即時 */
export const apiGetInspects = exportAPIGetInspects
export const apiGetSingleInspect = exportAPIGetSingleInspect

/* 監測數據 - 歷史 */
export const apiGetHistoryInspects = exportAPIGetHistoryInspects
export const apiGetSingleHistoryInspect = exportAPIGetSingleHistoryInspect