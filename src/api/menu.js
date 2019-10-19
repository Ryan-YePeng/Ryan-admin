import {axiosG} from '../utils/http'

const menuUrl = 'api/menu/build';
export function get() {
  return new Promise(resolve => {
    axiosG(menuUrl).then(result=> {
      return resolve(result)
    })
  })
}
