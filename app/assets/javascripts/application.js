// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require plugins/jquery-1.10.2.min
//= require plugins/jquery-migrate-1.2.1.min
//= require jquery_ujs 
//= require plugins/bootstrap/js/bootstrap.min
//= require plugins/back-to-top
//= require plugins/jquery.query
//= require plugins/dialog-min
//= require plugins/fancybox/source/jquery.fancybox.pack
//= require app
//= require form

$(function() {

	// 初始化
	App.init();
	// 初始化 图片展示
	App.initFancybox();

	// 状态筛选,用于list列表页面
	$(".status_filter").on('click',function(){
		var newUrl = $.query.REMOVE("page");
		newUrl = $.query.set("status_filter", $(this).attr("value")).toString(); //如果存在会替换掉存在的参数的值
		location.href = newUrl;
	});
	// 日期筛选,用于list列表页面
	$(".date_filter").on('click',function(){
		var newUrl = $.query.REMOVE("page");
		newUrl = $.query.set("date_filter", $(this).attr("value")).toString(); //如果存在会替换掉存在的参数的值
		location.href = newUrl;
	});

});

// 验证表单字段规则
function validate_form_rules (form_id,rules,messages) {
	messages = messages || {};
	$(form_id).validate({
		rules: rules,
		messages: messages,
		errorPlacement: function(error, element)
		{
			error.insertAfter(element.parent());
		}
	});
};

// 手动关闭提示弹框
function flash_dialog (content) {
	content = "<p>" + content + "</p>"
	dialog({
    title: '提示',
    content: content,
    fixed: true //  开启固定定位
	}).show();
};
// 自动关闭提示框
function tips_dialog (content) {
	var d = dialog({
    content: content,
    quickClose: true, // 点击空白处关闭提示框
    fixed: true
	});
	d.show();
	setTimeout(function () {
	    d.close().remove();
	}, 5000);
};
// 确认弹框
function confirm_dialog (content,ok_function) {
	dialog({
    content: content,
    fixed: true,
    okValue: '确定',
    ok: ok_function,
    cancelValue: '取消',
    cancel: function () {}
	}).show();
}