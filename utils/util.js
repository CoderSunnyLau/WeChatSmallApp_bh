const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var alert = function(msg, callback){
	wx.showModal({
		title: '提示',
		content: msg,
		showCancel: false,
		success: function(r){
			if(typeof(callback) == 'function'){callback(r);}
		}
	});
}
var confirm = function(msg, callback){
	wx.showModal({
		title: '提示',
		content: msg,
		showCancel: true,
		success: function(r){
			if(typeof(callback) == 'function'){callback(r);}
		}
	});
}

module.exports = {
  formatTime: formatTime,
  alert: alert,
  confirm: confirm,
}
