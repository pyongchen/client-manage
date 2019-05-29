<template>
	<div class="uni-app">
		<t-header></t-header>
		<div class="layout-content">
			<t-left-menu></t-left-menu>
			<div class="pages">
				<div class="pages-content">
					<router-view></router-view>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
  import tHeader from '../layout/tHeader.vue';
  import tLeftMenu from '../layout/tLeftMenu.vue';

  export default {
    name: 'uni-content',
    components: { tHeader, tLeftMenu },
    data() {
      return {
        year: new Date().getFullYear()
      };
    }
  };
</script>
<style lang="sass">
	.uni-app
		width: 100%
		height: 100vh
		display: flex
		flex-direction: column
	.layout-content
		background-color: #f0f2f5
		display: flex
		width: 100%
		flex: auto
		.pages
			flex: auto
			flex-direction: column
			display: flex
			padding: 10px
			background-color: #f0f2f5
			overflow-x: hidden
			overflow-y: auto
			.pages-content
				flex: auto
			.uni-layout-footer
				font-size: 15px
				padding: 20px
				text-align: center
</style>
