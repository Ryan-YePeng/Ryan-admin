import {axiosG, axiosJ} from '../utils/http'

const configUrl = 'api/emailTool/configuration';
export function configApi(data) {
  return new Promise(resolve => {
    axiosJ(configUrl, data).then(result => {
      resolve(result)
    })
  })
}

const getUrl = 'api/emailTool/get';
export function getApi() {
  return new Promise(resolve => {
    axiosG(getUrl).then(result => {
      resolve(result)
    })
  })
}

const sendUrl = 'api/emailTool/send';
export function sendApi(data) {
  return new Promise((resolve, reject) => {
    axiosJ(sendUrl, data).then(result => {
      resolve(result)
    }).catch(error => {
      reject(error)
    })
  })
}
