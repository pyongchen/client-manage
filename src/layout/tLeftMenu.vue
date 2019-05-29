<template>
	<div class="left-menu" ref="menuList">
		<div class="menu-list">
			<el-menu :default-active="activePath" :background-color="bgColor"
			  :text-color="textColor" :active-text-color="activeColor" :collapse="isCollapse">
				<a v-for="item in menuList" :key='item.path' :href="item.path" @click.prevent="switchPage(item.path)">
					<el-menu-item :index="item.path">
						<span slot="title">{{item.title}}</span>
					</el-menu-item>
				</a>
			</el-menu>
		</div>
	</div>
</template>
<script>
  export default {
    name: 'left-menu',
    data() {
      return {
        textColor: '#fff',
        activeColor: '#54d4f4',
        bgColor: '#3c434b',
        isCollapse: false,
        activePath: '',
        menuList: [
          { title: '客户管理', path: '/client' }
        ]
      };
    },
    watch: {
      $route(route) {
        this.activePath = route.path;
      }
    },
    mounted() {
      this.activePath = this.$route.path;
    },
    methods: {
      switchPage(val) {
        this.$router.push({ path: val });
        this.activePath = val;
      }
    }
  };
</script>
<style lang="sass">
	.left-menu
		flex: 0
		max-width: 160px
		min-width: 160px
		width: 160px
		background-color: #3c434b
		.menu-list
			height: 100%
			overflow-y: auto
			.el-menu
				border: none
		.collapse-btn
			position: fixed
			bottom: 0
			background-color: #2a2f34
			color: white
			width: 200px
			height: 50px
			line-height: 50px
			text-align: center
			i
				font-size: 20px
		.collapse-btn:hover
			cursor: pointer
</style>
