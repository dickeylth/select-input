## 综述

SelectInput是下拉框结合输入框组件，用于根据下拉选项结果展示对应输入框，以及批量录入功能。

* 版本：1.0
* 作者：弘树
* demo：[http://gallery.kissyui.com/select-input/1.0/demo/index.html](http://gallery.kissyui.com/select-input/1.0/demo/index.html)

## 初始化组件

### 初始化

    S.use('gallery/select-input/1.0/index', function (S, SelectInput) {
         var select-input = new SelectInput({
            container: '.J_HotelPhoneWrapper',
            contentContainer: '.J_PhoneContentWrapper',
            inputContainer: '.J_PhoneInput',
            inpTpl: [
              '<div class="form-group"><input type="text" class="input-sm form-control country-code-inp J_CountryCodeInp" placeholder="国家代码" maxlength="5"/></div>&nbsp;-&nbsp;' +
                      '<div class="form-group"><input type="tel" class="input-sm form-control area-code-inp" placeholder="区号" maxlength="4"/></div>&nbsp;-&nbsp;' +
                      '<div class="form-group"><input type="tel" class="input-sm form-control" placeholder="固定电话号码" maxlength="10"/></div>&nbsp;-&nbsp;' +
                      '<div class="form-group"><input type="tel" class="input-sm form-control ext-num-inp" placeholder="分机" maxlength="5"/></div>',

              '<div class="form-group"><input type="tel" class="input-sm form-control mob-phone-inp" placeholder="移动电话号码" maxlength="18"></div>',

              '<div class="form-group"><input type="text" class="input-sm form-control country-code-inp J_CountryCodeInp" placeholder="国家代码" maxlength="5"/></div>&nbsp;-&nbsp;' +
                      '<div class="form-group"><input type="tel" class="input-sm form-control 400-phone-inp" placeholder="400或800电话号码" maxlength="18"></div>'
            ],
            itemSelector: '.J_PhoneItem',
            buttons: {
              add: '.J_AddPhone',
              del: '.J_DelPhone'
            }
        });
    });

### 需要指定的DOM中的selector

![SelectInput中的DOM选择器](http://gtms01.alicdn.com/tps/i1/T1T07OFj4XXXaFPnjB-790-188.jpg)

### 其他参数说明
* `inpTpl`
    * 对应各个下拉选项的输入框html，按照下拉选项顺序
    * @type {Array}

## API说明

* `getValue`
    * 拼合所有的输入值
    * @method getValue
    * @return {Object} key-value pair，其中key为select选中值，value为该项各输入框输入值的拼接字符串，以`separator`指定的分隔符拼接

## 事件

* `select`
    * 下拉框选中后触发事件
    * 传递监听回调的data: {container: contentContainer, selectNode: curNode}，分别为该item的contentContainer和当前下拉框节点
* `add-item`
    * 新增项（“增加”按钮点击）触发
* `del-item`
    * 删除项（“删除”按钮点击）触发