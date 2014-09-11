# -*- encoding : utf-8 -*-

class Department < ActiveRecord::Base
	has_many :user, dependent: :destroy
  # 树形结构
  has_ancestry :cache_depth => true
  default_scope -> {order(:ancestry, :sort, :id)}

  include AboutAncestry

	def self.xml(who='',options={})
	  %Q{
	    <?xml version='1.0' encoding='UTF-8'?>
	    <root>
	      <node name='单位名称' column='name' class='{required:true}' hint='必须与参照营业执照中的单位名称保持一致'/>
	      <node name='单位简称' column='short_name'/>
	      <node name='组织机构代码' column='org_code' class='{required:true}' hint='请参照组织机构代码证上的号码'/>
	      <node name='成立日期' class='{required:true,dateISO:true}' icon='calendar' hint='以营业执照中的成立日期为准'/>
	      <node name='单位性质' column='industry' data_type='checkbox' class='{required:true, rangelength:[2,3]}' data='政府机关|事业单位|中央企业|地方国有企业|私营企业'/>
		  	<node name='单位人数' data_type='radio' class='{required:true}' data='20人以下|21-100人|101-500人|501-1001人|1001-10000人|1000人以上'/>
	      <node name='注册资金' column='capital' icon='jpy' class='{required:true}'/>
	      <node name='所在地区' data_type='tree_select' url='/home/treetest'/>
	      <node name='邮政编码' column='area_id' class='{required:true,number:true,rangelength:[6,6]}'/>
	      <node name='详细地址' column='address'/>
	      <node name='邮箱地址' icon='envelope'/>
	      <node name='是否保密单位' column='is_secret' data_type='radio' class='{required:true}' data='是|否'/>
	      <node name='排序号' column='sort' placeholder='在同级单位中的排序号' hint='数字越小排序越靠前'/>
	      <node name='单位介绍' column='summary' data_type='textarea' class='{required:true}' placeholder='不超过800字'/>
	      <node name='备注' data_type='richtext'/>
	    </root>
	  }
	end
end