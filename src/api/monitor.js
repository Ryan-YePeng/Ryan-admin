import {axiosG} from '../utils/http'

const getLogsUrl = 'api/logs/info?';
export function getLogsApi(param) {
  return new Promise(resolve => {
    axiosG(getLogsUrl + param).then(result => {
      return resolve(result)
    })
  })
}

const getErrorLogUrl = 'api/logs/error?';
export function getErrorLogApi(param) {
  return new Promise(resolve => {
    axiosG(getErrorLogUrl + param).then(result => {
      return resolve(result)
    })
  })
}

const getErrorInfoUrl = 'api/logs/error/';
export function getErrorInfoApi(param) {
  return new Promise(resolve => {
    axiosG(getErrorInfoUrl + param).then(result => {
      return resolve(result)
    })
  })
}
