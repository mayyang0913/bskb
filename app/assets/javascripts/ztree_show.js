var show_div = ".tab-content .active.in .show_content";
function get_ztree_setting(){
	return {
		async: {
			enable: true,
			url:get_ztree_params('init'),
			type: "get",
			autoParam:["id", "name=n", "level=lv"],
			otherParam:{"otherParam":"zTreeAsyncTest"}
		},
		edit: {
			drag: {
				autoExpandTrigger: true,
				prev: dropPrev,
				inner: dropInner,
				next: dropNext,
				iscopy: false,
				ismove: true
			},
			enable: true,
			showRemoveBtn: false,
			showRenameBtn: false
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			beforeDrag: beforeDrag,
			beforeDrop: beforeDrop,
			beforeDragOpen: beforeDragOpen,
			onDrag: onDrag,
			onDrop: onDrop,
			onExpand: onExpand,
			onRightClick: OnRightClick,
			onClick: showTreeNode,
			onAsyncSuccess: zTreeOnAsyncSuccess
		}
	};
}

function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
	var current_node_id = get_ztree_params('current_node_id');
	if (current_node_id != 0){
		var node = zTree.getNodeByParam("id", current_node_id, null);
		zTree.expandNode(node.getParentNode(), true, false, true);
		if(get_ztree_params('ajax_show_node')){
			var url = get_ztree_params('show') + node.id;
			show_content(url,show_div);
		}
	}
};

function dropPrev(treeId, nodes, targetNode) {
	var pNode = targetNode.getParentNode();
	if (pNode && pNode.dropInner === false) {
		return false;
	} else {
		for (var i=0,l=curDragNodes.length; i<l; i++) {
			var curPNode = curDragNodes[i].getParentNode();
			if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
				return false;
			}
		}
	}
	return true;
}

function dropInner(treeId, nodes, targetNode) {
	if (targetNode && targetNode.dropInner === false) {
		return false;
	} else {
		for (var i=0,l=curDragNodes.length; i<l; i++) {
			if (!targetNode && curDragNodes[i].dropRoot === false) {
				return false;
			} else if (curDragNodes[i].parentTId && curDragNodes[i].getParentNode() !== targetNode && curDragNodes[i].getParentNode().childOuter === false) {
				return false;
			}
		}
	}
	return true;
}

function dropNext(treeId, nodes, targetNode) {
	var pNode = targetNode.getParentNode();
	if (pNode && pNode.dropInner === false) {
		return false;
	} else {
		for (var i=0,l=curDragNodes.length; i<l; i++) {
			var curPNode = curDragNodes[i].getParentNode();
			if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
				return false;
			}
		}
	}
	return true;
}

var log, className = "dark", curDragNodes, autoExpandNode;
function beforeDrag(treeId, treeNodes) {
	className = (className === "dark" ? "":"dark");
	showLog("[ "+getTime()+" beforeDrag ]&nbsp;&nbsp;&nbsp;&nbsp; drag: " + treeNodes.length + " nodes." );
	for (var i=0,l=treeNodes.length; i<l; i++) {
		if (treeNodes[i].drag === false) {
			curDragNodes = null;
			return false;
		} else if (treeNodes[i].parentTId && treeNodes[i].getParentNode().childDrag === false) {
			curDragNodes = null;
			return false;
		}
	}
	curDragNodes = treeNodes;
	return true;
}

function beforeDragOpen(treeId, treeNode) {
	autoExpandNode = treeNode;
	return true;
}

function beforeDrop(treeId, treeNodes, targetNode, moveType, isCopy) {
	className = (className === "dark" ? "":"dark");
	showLog("[ "+getTime()+" beforeDrop ]&nbsp;&nbsp;&nbsp;&nbsp; moveType:" + moveType);
	showLog("target: " + (targetNode ? targetNode.name : "root") + "  -- is "+ (isCopy==null? "cancel" : isCopy ? "copy" : "move"));
	return true;
}

function onDrag(event, treeId, treeNodes) {
	className = (className === "dark" ? "":"dark");
	showLog("[ "+getTime()+" onDrag ]&nbsp;&nbsp;&nbsp;&nbsp; drag: " + treeNodes.length + " nodes." );
}

function onDrop(event, treeId, treeNodes, targetNode, moveType, isCopy) {
	className = (className === "dark" ? "":"dark");
	showLog("[ "+getTime()+" onDrop ]&nbsp;&nbsp;&nbsp;&nbsp; moveType:" + moveType);
	showLog("target: " + (targetNode ? targetNode.name : "root") + "  -- is "+ (isCopy==null? "cancel" : isCopy ? "copy" : "move"))
	send_data(targetNode.id,treeNodes[0].id,moveType,isCopy);
}

function onExpand(event, treeId, treeNode) {
	if (treeNode === autoExpandNode) {
		className = (className === "dark" ? "":"dark");
		showLog("[ "+getTime()+" onExpand ]&nbsp;&nbsp;&nbsp;&nbsp;" + treeNode.name);
	}
}

function showLog(str) {
	if (!log) log = $("#log");
	log.append("<li class='"+className+"'>"+str+"</li>");
	if(log.children("li").length > 8) {
		log.get(0).removeChild(log.children("li")[0]);
	}
}

function getTime() {
	var now= new Date(),
	h=now.getHours(),
	m=now.getMinutes(),
	s=now.getSeconds(),
	ms=now.getMilliseconds();
	return (h+":"+m+":"+s+ " " +ms);
}

function setTrigger() {
	var zTree = $.fn.zTree.getZTreeObj("ztree_show");
	zTree.setting.edit.drag.autoExpandTrigger = $("#callbackTrigger").attr("checked");
}


// 提交数据给后台
function send_data(targetId,sourceId,moveType,isCopy){
	var json_data = jQuery.param({ "sourceId": sourceId, "targetId": targetId, "moveType": moveType, "isCopy": isCopy });
	$.post(get_ztree_params('move'), json_data);
}


// 右键菜单函数begin

function OnRightClick(event, treeId, treeNode) {
	if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
		zTree.cancelSelectedNode();
		showRMenu("root", event.clientX - $("#main-nav").width() - event.target.offsetLeft, event.target.offsetTop);
	} else if (treeNode && !treeNode.noR) {
		zTree.selectNode(treeNode);
		var target_a = $(event.target).parents("a")[0];
		showRMenu("node", target_a.offsetLeft + target_a.offsetWidth, target_a.offsetTop);
	}
}

function showRMenu(type, x, y) {
	$("#rMenu ul").show();
	if (type=="root") {
		$("#m_del").hide();
	} else {
		$("#m_del").show();
	}
	rMenu.css({"top":y+"px", "left":x+"px", "visibility":"visible"});

	$("body").bind("mousedown", onBodyMouseDown);
}
function hideRMenu() {
	if (rMenu) rMenu.css({"visibility": "hidden"});
	$("body").unbind("mousedown", onBodyMouseDown);
}
function onBodyMouseDown(event){
	if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length>0)) {
		rMenu.css({"visibility" : "hidden"});
	}
}


function showTreeNode() {
	var	node  = zTree.getSelectedNodes()[0];
	if (node) {
		var url = get_ztree_params('show') + node.id;
		show_content(url,show_div);
	}
}
function addTreeNode() {
	hideRMenu();
	var node = zTree.getSelectedNodes()[0];
	var url = get_ztree_params('add') + 'new'
	if (node){
		url = url + '?pid=' + node.id;
	}
	show_content(url,show_div);
}
function editTreeNode() {
	hideRMenu();
	var node = zTree.getSelectedNodes()[0];
	if (node) {
		var url = get_ztree_params('edit') + node.id + "/edit";
		show_content(url,show_div);
	}
}
function removeTreeNode() {
	hideRMenu();
	var nodes = zTree.getSelectedNodes();
	if (nodes && nodes.length>0) {
		if (nodes[0].children && nodes[0].children.length > 0) {
			var msg = "下级子节点也会一并删除并且不可恢复，您确认要删除么？";
			ajaxDestroyNode(nodes[0],msg);
		} else {
			var msg = "删除后不可恢复，您确认要删除么？";
			ajaxDestroyNode(nodes[0],msg);
		}
	}
}

function ajaxDestroyNode(node,msg) {
	confirm_dialog(msg,	function(){
		$.ajax({
			type: "delete",
			url: get_ztree_params('destroy') + node.id,
			async: false,
			cache: false,
			dataType: "text",
			success: function(data) {
				zTree.removeNode(node);
				$(show_div).html("");
				tips_dialog(data);
			},
			error: function (data, textStatus){
				flash_dialog("操作失败，请重试！错误代码：" + textStatus + "\n" + data, init_ztree());
			}
		});
	});
}

// 右键菜单函数end
// 初始化zTree的数据，包括后台更新后重新加载树
function init_ztree(){
	$.fn.zTree.init($("#ztree_show"), get_ztree_setting());
}
