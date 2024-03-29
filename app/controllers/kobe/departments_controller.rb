# -*- encoding : utf-8 -*-
class Kobe::DepartmentsController < KobeController

  skip_before_action :verify_authenticity_token, :only => [:move, :valid_dep_name, :destroy, :commit]
  before_action :get_dep, :only => [:index, :show, :edit, :update, :destroy, :add_user, :freeze, :update_freeze, :upload, :update_upload, :commit]
  layout :false, :only => [:show, :edit, :new, :add_user, :freeze, :upload, :commit]

  def index
    
  end

  def move
    ztree_move(Department)
  end

  def ztree
    ztree_json(Department)
  end

  def new
    @dep = Department.new
    @dep.parent_id = params[:pid] unless params[:pid].blank?
    @myform = SingleForm.new(Department.xml, @dep, { form_id: "department_form", action: kobe_department_path(@dep) })
  end

  def create
    dep = create_and_write_logs(Department, Department.xml)
    if dep
      tips_get("创建成功。")
      redirect_to kobe_departments_path(id: dep)
    else
      flash_get(dep.errors.full_messages)
      redirect_to root_path
    end
  end

  def update
    if update_and_write_logs(@dep)
      tips_get("更新单位信息成功。")
      redirect_to kobe_departments_path(id: @dep)
    else
      flash_get(@dep.errors.full_messages)
      redirect_back_or
    end
  end

  def edit
    @myform = SingleForm.new(Department.xml, @dep, { form_id: "department_form", action: kobe_department_path(@dep), method: "patch" })
  end

  def show
    @arr  = []
    @arr << { title: "附件", icon: "fa-paperclip", content: show_uploads(@dep,true) }
    @arr << { title: "历史记录", icon: "fa-clock-o", content: show_logs(@dep) }
  end

  # 删除单位
  def destroy
    if @dep.destroy
      render :text => "删除成功！"
    else
      render :text => "操作失败！"
    end
  end

  # 冻结单位
  def freeze
  end

  def update_freeze
    logs = prepare_logs_content(@dep,"冻结单位",params[:opt_liyou])
    if @dep.change_status_and_write_logs("冻结",logs)
      tips_get("冻结单位成功。")
    else
      flash_get(@dep.errors.full_messages)
    end
    redirect_to kobe_departments_path(id: @dep)
  end

  # 分配人员账号
  def add_user
  end

  def update_add_user
    user = User.new(params.require(:user).permit(:login, :password, :password_confirmation))
    if user.save
      user.update(department_id: params[:id])
      write_logs(user,"分配人员账号",'账号创建成功')
      tips_get("账号创建成功。")
      redirect_to kobe_departments_path(id: params[:id],u_id: user.id)
    else
      flash_get(user.errors.full_messages)
      redirect_back_or
    end
  end

  # 修改资质证书
  def upload
    @myform = SingleForm.new(nil, @dep, { form_id: "edit_upload", button: false, upload_files: true, min_number_of_files: 4, action: update_upload_kobe_department_path(@dep) })
  end

  def update_upload
    tips_get("上传资质证书成功。")
    redirect_to kobe_departments_path(id: @dep)
  end

  # 注册提交
  def commit
    logs = prepare_logs_content(@dep,"提交","注册完成，提交！")
    if @dep.change_status_and_write_logs("未审核",logs)
      tips_get("提交成功，请等待审核。")
    else
      flash_get(@dep.errors.full_messages)
    end
    redirect_to kobe_departments_path(id: @dep)
  end

  # 验证单位名称
  def valid_dep_name
    render :text => valid_remote(Department, ["name = ? and id != ?", params[:departments][:name], params[:obj_id]])
  end

  private  

    def get_dep
      @dep = Department.find(params[:id]) unless params[:id].blank? 
    end
end
