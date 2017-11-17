// component/testTmp/testTmp.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
		someTxt: 'Hello'
  },

  /**
   * 组件的方法列表
   */
  methods: {
		click: function(){
			this.setData({
				someTxt: 'World'
			})
		}
  }
})
