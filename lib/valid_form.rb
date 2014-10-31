# -*- encoding : utf-8 -*-
module ValidForm

	# 验证department表的name是否唯一 true：通过验证，false：已存在
	def valid_unique_dep_name(name,id=nil)
		id ||= 0
		return Department.where(["name = ? and id != ?", name, id]).blank? ? true : false
	end

	# 验证user表的login是否唯一 true：通过验证，false：已存在
	def valid_unique_user_login(login)
		return User.where(login: login).blank? ? true : false
	end
	
end