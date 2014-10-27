# -*- encoding : utf-8 -*-
module ApplicationHelper

  # 格式化日期
  def show_date(d)
    (d.is_a?(Date) || d.is_a?(Time)) ? d.strftime("%Y-%m-%d") : d
  end

  # 格式化时间
  def show_time(t)
    d.is_a?(Time) ? t.strftime("%Y-%m-%d %H:%M:%S") : t
  end

  # 显示序号
  def show_index(index, per = 20)
    params[:page] ||= 1
    (params[:page].to_i - 1) * per + index + 1
  end

  # 将数组转化为a链接,btn是否显示为按钮样式，配合btn_group方法使用
  def arr_to_link(arr,btn=true)
    unless arr.is_a?(Array)
      return arr
    else
      if arr.length < 3 
        opts = btn ? {class: "btn btn-sm btn-default"} : {}
      else
        opts = arr[2]
        opts[:class] = "btn btn-sm btn-default" if btn
      end
      return link_to(arr[0].html_safe,arr[1],opts)
    end
  end

  # 按钮组,一般应用与操作列表和状态、时间筛选
  def btn_group(arr,dropdown=true)
    return "" if arr.blank?
    unless dropdown || arr.length > 10
      return raw arr.map{|a|arr_to_link(a)}.join.html_safe
    else 
      first = arr_to_link(arr.shift)
      if first.index("<a").nil?
        top = "<button data-toggle='dropdown' class='btn btn-sm btn-default dropdown-toggle' type='button'>#{first} <i class='fa fa-sort-desc'></i></button>"
      else
        top = "#{first}<button data-toggle='dropdown' class='btn btn-sm btn-default dropdown-toggle' type='button'><i class='fa fa-sort-desc'></i></button>"
      end
      # 如果有多个元素就使用按钮组
      unless arr.blank?
        li = arr.map{|c|"<li>#{arr_to_link(c,false)}</li>"}.join("\n")
        str = %Q|
        <div class='btn-group'>
          #{top}
          <ul role='menu' class='dropdown-menu'>
            #{li}
          </ul>
        </div>|
      else
        str = first
      end
      return raw str.html_safe
    end
  end

  # 列表标题栏的筛选过滤器
  def head_filter(name,arr)
    current = params[name] || "all"
    limited = arr.find{|a|a[1].to_s == current }
    arr.delete_if{|a|a[1] == limited[1]}.map!{|a|"<a href='javascript:void(0)' class='#{name}' value='#{a[1]}'>#{a[0]}</a>"}
    arr.unshift(limited[0])
    return btn_group(arr,true)
  end

  # 显示步骤,用于用户注册页面
  # def step(arr,step)
  #   len = arr.length
  #   active = Array.new(len){|i| i < step ? " class='active'" : ""}
  #   color = Array.new(len){|i| i < step ? "badge-u" : "badge-light"}
  #   arr.map!.with_index{|a,i|"<li#{active[i]}><a><span class='badge rounded-2x #{color[i]}'>#{i+1}</span> #{a}</a></li>"}
  #   str = %Q|
  #   <div class="step">
  #     <ul class="nav nav-justified">
  #       #{arr.join}
  #     </ul>     
  #   </div>|
  #   return raw str.html_safe
  # end

end
