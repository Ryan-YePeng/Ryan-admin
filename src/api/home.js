import {axiosG, axiosK} from '../utils/http'

const getVisitsUrl = 'api/visits';
export function getVisitsApi() {
  return new Promise(resolve => {
    axiosG(getVisitsUrl).then(result => {
      resolve(result)
    })
  })
}

const lineApi = 'api/visits/chartData';
export function getLineApi() {
  return new Promise(resolve => {
    axiosG(lineApi).then(result => {
      resolve(result)
    })
  })
}
