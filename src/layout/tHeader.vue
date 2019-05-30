<template>
	<div class="uni-header">
		<div class="content">
			<a class="uni-title" style="margin-left: 10px">
				<span>客户管理系统</span>
			</a>
			<div class="right-content">
				<el-tooltip placement="bottom" effect="light" popper-class="user-tooltip">
					<div slot="content">
						<div class="user-item" @click="logout">
							<i class="el-icon-switch-button icon"></i>
							<span>退出登录</span>
						</div>
						<div class="user-item" @click="changePass">
							<i class="el-icon-key icon"></i>
							<span>修改密码</span>
						</div>
					</div>
					<div class="user">
						<img :src="user.head">
						<span>{{ user.name }}</span>
					</div>
				</el-tooltip>
			</div>
		</div>
		<el-dialog title="更改密码" :visible.sync="showDialog" width="30%">
			<span>新密码：</span>
			<el-input type="password" v-model="store.password" style="width: 200px"></el-input>
			<span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitChangePass">确 定</el-button>
      </span>
		</el-dialog>
	</div>
</template>
<script>
	import axios from 'axios';
  export default {
    name: 'uni-header',
    data() {
      return {
        url: location.href,
        user: {
          name: '',
          head: 'https://soe-mp-demo-1255701415.cos.ap-guangzhou.myqcloud.com/test/img5.jpg'
        },
        tabs: [],
	      store: {
          password: ''
	      },
	      showDialog: false
      };
    },
    computed: {
      type() {
        return this.getCookie('loginType');
      }
    },
    mounted() {
      this.user.name = localStorage.getItem('username');
    },
    methods: {
      logout() {
        axios.post('/user/logout').then(() => {
          this.$message.success('退出成功');
          localStorage.removeItem('username');
          setTimeout(() => {
            this.$router.push({ path: '/login' });
          }, 500);
        });
      },
      changePass() {
        this.showDialog = true;
      },
	    submitChangePass() {
        axios.post('/user/updatePass', {
          password: this.store.password,
        }).then(() => {
          this.$message.success('更新成功');
          this.showDialog = false;
          this.logout();
        });
	    }
    }
  };
</script>
<style lang="sass">
	.uni-header
		background-color: #3c434b
		box-shadow: rgba(0, 21, 41, 0.08) 0 1px 4px
		height: 60px
		line-height: 60px
		.content
			height: 100%
			width: 100%
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
				color: rgba(255, 255, 255, 1)
				i
					font-size: 25px
					margin: 5px
				.user
					float: right
					.el-submenu:hover
						background-color: inherit
			.right-content
				flex: 1
				justify-content: flex-end
				align-items: center
				display: flex
				padding-right: 20px
				.user
					display: flex
					align-items: center
					height: 20px
					img
						width: 32px
						height: 32px
						border-radius: 50%
						margin-right: 5px
					color: rgba(255, 255, 255, 1)
					.logout
						margin-left: 20px
						text-decoration: underline
					.logout:hover
						cursor: pointer
				.user:hover
					cursor: pointer
</style>
