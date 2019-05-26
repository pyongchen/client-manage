<template>
	<div class="data-table">
		<el-input v-if="filter" class="filter" v-model="filterKey" style="width: 250px" placeholder="输入关键字搜素">
			<i slot="prefix" class="el-input__icon el-icon-search"></i>
		</el-input>
		<slot :list="data"></slot>
		<el-pagination class="data-table-paging" v-if="paging" background
			@size-change="changeSize" @current-change="changePage"
			:current-page="page_no" :page-size="page_size" :page-sizes="pagesSizes"
			layout="total, sizes, prev, pager, next, jumper" :total="length">
		</el-pagination>
	</div>
</template>
<script>
	export default {
		name: 'dataTable',
		props: ['paging', 'filter', 'totalData', 'defaultSize', 'serverOption'],
		data() {
			return {
				filterKey: '',
				pagesSizes: [10, 20, 50, 100, 500],
				data: [],
				filterData: [],
				page_size: this.defaultSize || 10,
				page_no: 1,
				length: 0
			};
		},
		watch: {
			serverOption() {
				if (this.page_no == this.serverOption.page_no) this.setData();
				else this.changePage(this.serverOption.page_no);
			},
			totalData(val) {
				this.filterData = val;
				this.setData();
			},
			filterKey(val) {
				if (!val) {
					this.filterData = this.totalData;
					this.changePage(1);
				} else {
					this.filterData = this.allData.filter(item => {
						for (let key in item) {
							let res = item[key];
							if (res instanceof Array) return res.indexOf(val) > -1;
							else return String(res).indexOf(val) > -1;
						}
					});
					this.changePage(1);
				}
			}
		},
		computed: {
			allData() {
				return this.totalData;
			}
		},
		methods: {
			changeSize(value) { // 修改每页大小
				this.page_size = value;
				this.setData();
			},
			changePage(value) { // 翻页
				this.page_no = value;
				this.setData();
			},
			setData() {
				if (this.serverOption) {
					this.serverOption.loading = true;
					let baseParam = {};
					for (let key in this.serverOption) {
						baseParam[key] = this.serverOption[key];
					}
					baseParam.page_size = this.page_size;
					baseParam.page_num = (this.page_no - 1) || 0;
					this.axiosPost(baseParam).then(res => {
						let data = res.returnData.data;
						let dataKey = this.serverOption.dataKey || 'data_list';
						this.data = data[dataKey];
						this.length = +data.total;
						this.serverOption.loading = false;
					}).catch(err => this.$message.error(err.toString()));
				} else {
					if (!this.paging) {
						this.data = this.filterData;
					} else {
						if (!this.filterData) return;
						let start = (this.page_no - 1) * this.page_size;
						let end = start + this.page_size;
						this.data = this.filterData.slice(start, end);
					}
					this.length = this.filterData.length;
				}
			},
			download(headers, keys, fileName) {
				let list = [];
				for (let i = 0, len = this.totalData.length; i < len; i++) {
					let item = {};
					keys.forEach((k, j) => {
						item['k' + j] = this.totalData[i][k];
					});
					list.push(item);
				}
				this.exportCSV(list, headers, fileName);
			}
		}
	};
</script>
<style lang="sass">
	.data-table
		.filter
			margin-bottom: 10px
		.data-table-paging
			padding-top: 10px
</style>
