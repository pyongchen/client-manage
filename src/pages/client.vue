<template>
	<div class="client">
		<el-button type="primary" icon="el-icon-plus" size="small"
		           @click="addItem" style="margin-bottom: 10px">添加客户
		</el-button>
		<div class="filter-bar" style="margin-bottom: -10px">
			<el-form :inline="true">
				<el-form-item label="选择部门">
					<el-select v-model="filter.department" placeholder="选择部门" size="small" @change="changeDep">
						<el-option v-for="item in departmentList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="选择日期">
					<el-date-picker type="date" placeholder="开始日期" size="small" :pickerOptions="pickerOptions"
					  v-model="filter.startDate" style="width: 140px" @change="changeDate"></el-date-picker>
					<span style="margin: 0 5px;">-</span>
					<el-date-picker type="date" placeholder="结束日期" size="small" :pickerOptions="pickerOptions"
					  v-model="filter.endDate" style="width: 140px" @change="changeDate"></el-date-picker>
				</el-form-item>
				<el-form-item style="float: right; margin: 0">
					<el-input style="width: 180px" size="small" suffix-icon="el-icon-search"
					  v-model="searchKey" placeholder="输入业务员搜索"></el-input>
				</el-form-item>
			</el-form>
		</div>
		<data-table :paging="true" :total-data="showData">
			<template slot-scope="{list}">
				<el-table :data="list">
					<template slot="empty"><span>暂无数据</span></template>
					<el-table-column prop="number" label="客户编号"></el-table-column>
					<el-table-column prop="name" label="客户名称"></el-table-column>
					<el-table-column prop="salesman" label="所属业务员"></el-table-column>
					<el-table-column prop="department" label="所属部门"></el-table-column>
					<el-table-column prop="date" label="录入日期">
						<template slot-scope="scope">
							<span>{{ timeFormat(new Date(scope.row.date), 'yyyy-MM-dd')}}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button size="mini" @click="editItem(scope.row)" type="primary"
							  :disabled="scope.row.salesman != username">编辑</el-button>
							<el-button size="mini" @click="deleteItem(scope.row)" type="danger"
							  :disabled="scope.row.salesman != username">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</data-table>
		<el-dialog :title="title" :visible.sync="dialog.addEdit.show" width="30%">
			<el-form label-width="100px">
				<el-form-item label="客户编号">
					<el-input v-model="item.number" placeholder="输入客户编号"></el-input>
				</el-form-item>
				<el-form-item label="客户名称">
					<el-input v-model="item.name" placeholder="输入客户名称"></el-input>
				</el-form-item>
				<el-form-item label="所属部门">
					<el-input v-model="item.department" placeholder="输入所属部门"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
        <el-button @click="dialog.addEdit.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitAddEdit" size="small">确 定</el-button>
      </span>
		</el-dialog>
		<el-dialog title="删除" :visible.sync="dialog.delete.show" width="30%">
			<span>确定删除该客户？</span>
			<span slot="footer" class="dialog-footer">
        <el-button @click="dialog.delete.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitDelete" size="small">确 定</el-button>
      </span>
		</el-dialog>
	</div>
</template>
<script>
  import axios from 'axios';
  import dataTable from '../components/dataTable.vue';
  import { timeFormat } from '../tools/index';

  let startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  export default {
    name: 'client',
    components: { dataTable },
    data() {
      return {
        msg: '客户管理',
        totalData: [],
	      showData: [],
        timeFormat: timeFormat,
        item: {
          number: '',
          name: '',
          salesman: '',
          department: '',
          date: ''
        },
        dialog: {
          addEdit: {show: false, item: {}},
          delete: {show: false, item: {}}
        },
        type: '',
        title: '',
        filter: {
          department: '',
	        startDate: startDate,
	        endDate: new Date()
        },
        departmentList: [],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
	      username: localStorage.getItem('username'),
        searchKey: ''
      }
    },
    mounted() {
      this.getData();
      this.getDepartmentList();
	    },
	  watch: {
      searchKey(val) {
        if (!val) {
          this.showData = this.totalData;
          return;
        }
        let newList = [];
        this.totalData.forEach(item => {
          if (item.salesman.indexOf(val) > -1) newList.push(item);
        });
        this.showData = newList;
      }
	  },
    methods: {
      addItem() {
        this.type = 'add';
        for (let key in this.item) this.item[key] = '';
        this.title = '添加客户';
        this.dialog.addEdit.show = true;
      },
      editItem(item) {
        this.type = 'edit';
        let newItem = {};
        for (let key in item) newItem[key] = item[key];
        this.item = newItem;
        this.title = '编辑客户';
        this.dialog.addEdit.show = true;
      },
      submitAddEdit() {
        let url = '/cgi/addClient';
        if (this.type == 'edit') url = '/cgi/updateClient';
        axios.post(url, this.item).then(res => {
          if (res.data.code) {
            this.$message.error(res.data.msg);
            if (res.data.code== 4) setTimeout(() => { this.$router.push({path: '/login'}) }, 500);
          } else {
            this.$message.success(this.type == 'add' ? '添加成功' : '编辑成功');
            this.dialog.addEdit.show = false;
            this.getData();
            this.getDepartmentList();
          }
        }).catch(err => {
          this.$message.error(err.toString());
        });
      },
	    deleteItem(item) {
		    this.dialog.delete.show = true;
		    this.dialog.delete.item = item;
	    },
      submitDelete() {
        axios.post('/cgi/deleteClient', {
          id: this.dialog.delete.item.id
        }).then(res => {
          if (res.data.code == 4) {
            this.$message.error(res.data.msg);
            setTimeout(() => { this.$router.push({path: '/login'}) }, 500);
          } else {
            this.$message.success('删除成功');
            this.dialog.delete.show = false;
            this.getData();
            this.getDepartmentList();
          }
        }).catch(err => {
          this.$message.error(err.toString());
        });
      },
      getDepartmentList() {
        axios.get('/cgi/allDepartment').then(res => {
          let list = res.data.list || [];
          let departmentList = [];
          list.forEach(item => { departmentList.push({ label: item.department, value: item.department });});
          this.departmentList = [{ value: '', label: '全部'}].concat(departmentList);
        }).catch(err => {
          console.log(err);
        });
      },
      changeDep() {
        this.getData();
      },
	    changeDate() {
        this.getData();
	    },
      getData() {
        this.searchKey = '';
        let department = this.filter.department;
        let startDate = timeFormat(this.filter.startDate, 'yyyy-MM-dd'),
	        endDate = timeFormat(this.filter.endDate, 'yyyy-MM-dd');
        axios({
	        method: 'get',
	        url: '/cgi/clients',
	        params: {
            department: department,
            startDate: startDate,
            endDate: endDate
	        }
        }).then(res => {
          let data = res.data;
          if (data.code == 4) {
            this.$message.error(data.msg);
            setTimeout(() => {
              this.$router.push({path: '/login'})
            }, 500);
          } else {
            this.totalData = data.list;
            this.showData = data.list;
          }
        }).catch(err => {
          console.log(err);
        });
      }
    }
  }
</script>
<style lang="sass">
	.client
		.action-btn:hover
			cursor: pointer
</style>
