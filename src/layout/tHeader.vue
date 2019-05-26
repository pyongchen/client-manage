<template>
  <div class="uni-header">
    <div class="content">
      <a class="uni-title" href>
        <span>慧学教学平台</span>
      </a>
      <div class="menu" v-for="(tab, index) in tabs" :key="index">
        <div class="menu-item" @click="switchPage(index, tab.key)">{{ tab.name }}</div>
      </div>
      <div class="right-content" v-if="type == 'teacher'">
        <div class="online">
          <a href="https://coding.qq.com/python-lab" target="_blank">在线编程</a>
        </div>
        <el-tooltip placement="bottom" effect="light" popper-class="user-tooltip">
          <div slot="content">
            <div class="user-item" @click="userCenter">
              <i class="el-icon-user icon"></i>
              <span>个人中心</span>
            </div>
            <div class="user-item" @click="logout">
              <i class="el-icon-switch-button icon"></i>
              <span>退出登录</span>
            </div>
          </div>
          <div class="user">
            <img :src="user.head">
            <span>{{ user.name }}</span>
          </div>
        </el-tooltip>
      </div>
      <div class="right-content" v-if="type == 'student'">
        <div class="user">
          <img :src="user.head">
          <div>{{user.name}}</div>
          <div class="logout" @click="logout">退出</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'uni-header',
  data() {
    return {
      url: location.href,
      user: {
        name: '测试账号',
        head:
          'https://soe-mp-demo-1255701415.cos.ap-guangzhou.myqcloud.com/test/img5.jpg'
      },
      teacherTabs: [
        { key: 'courseList', name: '我的课程' },
        { key: 'homeworkManage', name: '作业管理' },
        { key: 'courseManage', name: '课程管理' },
        { key: 'teacherManage', name: '教师管理' },
        { key: 'studentManage', name: '学生管理' },
        { key: 'iot', name: '物联网设备管理' }
      ],
      studentTabs: [
        { key: 'learning', name: '我正在学' },
        { key: 'learned', name: '我学过的' }
      ],
      tabs: []
    };
  },
  computed: {
    type() {
      return this.getCookie('loginType');
    }
  },
  mounted() {
    if (this.type == 'student') this.tabs = this.studentTabs;
    else if (this.type == 'teacher') this.tabs = this.teacherTabs;

    let path = this.$route.path.split('/');
    let key = path[path.length - 1];
    if (key == 'courseDetail' || key == 'courseArrange') key = 'courseManage'; // 课程管理、课程详情、排课信息
    let index = this.getTabIndex(key);

    this.$nextTick(() => {
      let menuItems = document.querySelectorAll('.menu-item');
      this.addClass(menuItems[index], 'active');
    });
  },
  methods: {
    switchPage(index, page) {
      let menuItems = document.querySelectorAll('.menu-item');
      menuItems.forEach(item => this.removeClass(item, 'active'));
      this.addClass(menuItems[index], 'active');

      this.$router.push({ path: page });
    },
    getTabIndex(key) {
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i].key == key) return i;
      }
      return 0;
    },
    userCenter() {
      this.$router.push('/teacher/userCenter');
    },
    logout() {
      this.setCookie('loginType', '');
      location.href = '/' + this.type;
    }
  }
};
</script>
<style lang="sass">
	.uni-header
		background-color: #0181EF
		box-shadow: rgba(0, 21, 41, 0.08) 0 1px 4px
		height: 60px
		line-height: 60px
		.content
			height: 100%
			max-width: 1200px
			margin: 0 auto
			display: flex
			position: relative
			
			.uni-title
				float: left
				width: 200px
				height: 60px
				display: flex
				align-items: center
				font-weight: 500
				font-size: 24px
				color: rgba(255,255,255,1)
				i
					font-size: 25px
					margin: 5px
				.user
					float: right
					.el-submenu:hover
						background-color: inherit
			.menu
				display: flex
				line-height: 60px
				.menu-item
					margin-right: 15px
					font-weight: 400
					font-size: 14px
					color: rgba(255,255,255,1)
					opacity: 0.7
				.menu-item:hover
					cursor: pointer
				.active
					font-weight: bold
					opacity: 1
			.right-content
				flex: 1
				justify-content: flex-end
				align-items: center
				display: flex
				.online
					width: 90px
					height: 30px
					border: 1px solid rgba(251,251,251,1)
					border-radius: 15px
					color: rgba(251,251,251,1)
					line-height: 30px
					text-align: center
					margin-right: 20px
					a
						color: rgba(251,251,251,1)
				.online:hover
					cursor: pointer
					font-weight: bold
					transform: scale(1.1)
				.user
					display: flex
					align-items: center
					height: 20px
					img
						width: 32px
						height: 32px
						border-radius: 50%
						margin-right: 5px
					color: rgba(255,255,255,1)
					.logout
						margin-left: 20px
						text-decoration: underline
					.logout:hover
						cursor: pointer
				.user:hover
					cursor: pointer
</style>
