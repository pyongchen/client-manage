<template>
	<div class="container">
		<div class="bg"></div>
		<div class="en-title">Welcome</div>
		<div class="zh-title">客户管理系统</div>
		<el-form :model="store" :rules="rules" ref="userForm">
			<div class="login-box">
				<div class="inner-box">
					<div class="box-item">
						<el-form-item prop="username">
							<el-input placeholder="输入账号" v-model="store.username" style="width:350px;"></el-input>
						</el-form-item>
					</div>
					<div class="box-item">
						<el-form-item prop="password">
							<el-input placeholder="输入密码" v-model="store.password" style="width:350px;" type="password"></el-input>
						</el-form-item>
					</div>
					<div style="display: flex; margin-top: 20px">
						<el-button style="flex: 1" type="primary" @click="login">登陆</el-button>
						<el-button style="flex: 1" type="warning" @click=" register">注册</el-button>
					</div>
				</div>
			</div>
		</el-form>
	</div>
</template>

<script>
  import axios from 'axios';
  export default {
    data() {
      return {
        store: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' }
          ],
	        password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
	        ]
        }
      };
    },
    methods: {
      login() {
        this.$refs.userForm.validate(valid => {
	        if (!valid) return false;
          axios.post('/user/login', {
            username: this.store.username,
	          password: this.store.password
          }).then(res => {
            let data = res.data;
            if (data.code) return this.$message.error(data.msg);
            this.$message.success('登录成功');
            localStorage.setItem('username', data.user.username);
            setTimeout(() => {
              this.$router.push({ path: '/client' });
            }, 1000);
          }).catch(err => {
            console.log(err);
          });
        });
      },
	    register() {
        this.$refs.userForm.validate(valid => {
          if (!valid) return false;
          axios.post('/user/register', {
            username: this.store.username,
            password: this.store.password
          }).then(res => {
            let data = res.data;
            if (data.code) return this.$message.error(data.msg);
            this.$message.success('注册成功');
          }).catch(err => {
            console.log(err);
          });
        });
	    }
    }
  };
</script>

<style lang="sass">
	.en-title
		font-size: 80px
		font-weight: 100
		position: absolute
		left: 415px
		top: 100px
		color: #c6b3ac

	.zh-title
		font-size: 36px
		position: absolute
		/* 与login-box的margin-left对应，365 + 100 px */
		left: 465px
		top: 200px
		color: #fff

	.bg
		position: fixed
		top: 0
		left: 0
		width: 100%
		height: 100%
		min-width: 1000px
		z-index: -1
		background: url('../assets/login-bg.jpeg') no-repeat
		background-size: cover
		-webkit-background-size: cover
		-o-background-size: cover

	.login-box
		width: 400px
		// height: 330px;
		height: 220px
		margin-left: 365px
		margin-top: 290px
		padding: 10px
		background: #fff
		.inner-box
			width: 350px
			margin: 30px auto
			.box-item
				width: 400px
				margin: 0 auto
				margin-top: 16px
</style>
