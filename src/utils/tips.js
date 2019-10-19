import {Message, MessageBox, Notification} from 'element-ui'

const successMsg = msg => {
  Message.success(msg)
};

const warnMsg = msg => {
  Message.warning(msg)
};

const errorMsg = msg => {
  Message.error(msg)
};

const infoMsg = msg => {
  Message.info(msg)
};

const successNotify = msg => {
  Notification.success({
    title: '成功',
    message: msg
  })
};

const warnNotify = msg => {
  Notification.warning({
    title: '警告',
    message: msg
  })
};

const infoNotify = msg => {
  Notification.info({
    title: '消息',
    message: msg
  })
};

const errorNotify = msg => {
  Notification.error({
    title: '错误',
    message: msg
  })
};

const msgBox = (text = '确定执行此操作吗？', type = 'warning') => {
  return MessageBox.confirm(text, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: type
  })
};

export default {
  successMsg,
  warnMsg,
  errorMsg,
  infoMsg,
  successNotify,
  warnNotify,
  infoNotify,
  errorNotify,
  msgBox
}
