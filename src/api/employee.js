import {axiosG} from '../utils/http'

const getUrl = 'api/emp/get?';
export function get(param) {
  return new Promise(resolve => {
    axiosG(getUrl + param).then(result => {
      resolve(result)
    })
  })
}
