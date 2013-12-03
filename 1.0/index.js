/**
 * @fileoverview 
 * @author 弘树<tiehang.lth@alibaba-inc.com>
 * @module select-input
 **/
KISSY.add(function (S,Node,Base,Event) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * 
     * @class SelectInput
     * @constructor
     * @extends Base
     */
    function SelectInput(comConfig) {
        var self = this;
        //调用父类构造函数
        SelectInput.superclass.constructor.call(self, comConfig);

        var container = $(self.get('container'));
        self.container = container;
        self._initHTML = container.html();
        self._totalTpl = container.one(self.get('itemSelector')).outerHTML();

        // 初始化事件绑定
        self.bindEvent();
    }
    S.extend(SelectInput, Base, /** @lends SelectInput.prototype*/{

        /**
         * 绑定事件
         */
        bindEvent: function(){

            var self = this,
                container = self.container,
                buttons = self.get("buttons");

            // 下拉选择
            Event.delegate(container, 'change', 'select', self.selectType, self);

            // 增加项
            Event.delegate(container, 'click', buttons.add, self.addItem, self);

            // 删除项
            Event.delegate(container, 'click', buttons.del, self.delItem, self);

            // 输入事件
            Event.delegate(container, 'keyup change', 'input', self.inputChange, self);
        },

        /**
         * 下拉框选择的响应方法
         * @param {Event} e
         */
        selectType: function(e){
            var self = this,
                curNode = $(e.currentTarget),
                idx = curNode.getDOMNode().selectedIndex - 1,   // 由于第一项是“请选择”
                itemSelector = self.get('itemSelector'),
                contentContainer = self.get('contentContainer'),
                inputContainer = self.get('inputContainer'),
                inpTpl = self.get('inpTpl')[idx];

            // 获取对应输入框容器
            contentContainer = curNode.parent(itemSelector).one(contentContainer);

            // 渲染内容
            contentContainer.one(inputContainer).html(inpTpl);

            // 包含input和button的输入框容器展示
            contentContainer.removeClass('hidden');

            // 禁用当前下拉框
            curNode.prop('disabled', true);

            self.fire('select', {container: contentContainer, selectNode: curNode});

            // 使第一个输入框获得焦点
            contentContainer.one('input').fire('focus');

        },

        /**
         * 添加输入项
         * @param e {event}
         */
        addItem: function(e){
            var self = this,
                curNode = $(e.currentTarget),
                itemSelector = self.get('itemSelector'),
                contentContainer = self.get('contentContainer'),
                inputContainer = self.get('inputContainer'),
                totalTpl = self._totalTpl;

            // 获取当前最后一个输入项
            var lastItem = self.container.last(itemSelector);

            // 追加输入项到其后
            lastItem.after(totalTpl);

            // 更新计数
            self.set('itemCount', self.get('itemCount') + 1);

            // '增加'按钮隐藏
            curNode.addClass('hidden');

            self.fire('add-item');
        },

        /**
         * 删除输入项
         * @param e {event}
         */
        delItem: function(e){
            var self = this,
                curNode = $(e.currentTarget),
                itemSelector = self.get('itemSelector'),
                addBtn = self.container.one(self.get('buttons').add);

            // 首先需判断当前是否为仅有的一个输入项
            if(self.get('itemCount') == 1){

                // 如果是唯一的输入框，删除操作为重置为初始状态
                self.container.html(self._initHTML);

            }else{

                // 直接删除该输入项
                curNode.parent(itemSelector).remove();

                // 显示添加按钮
                addBtn.removeClass('hidden');

                // 更新计数
                self.set('itemCount', self.get('itemCount') - 1);
            }

            self.fire('del-item');

        },

        /**
         * 输入发生变化时响应
         * @param e {event}
         */
        inputChange: function(e){
            var self = this,
                curNode = $(e.currentTarget),
                contentContainer = self.get('contentContainer'),
                inputContainer = self.get('inputContainer'),
                value = '',
                delBtn = curNode.parent(contentContainer).one(self.get('buttons').del),
                addBtn = self.container.one(self.get('buttons').add);

            // 遍历所有的input框，拼合value
            curNode.parent(inputContainer).all('input').each(function(item){
                value += S.trim(item.val());
            });

            if(value != ''){
                // 当输入值非空时，显示button
                delBtn.removeClass('hidden');
                addBtn.removeClass('hidden');
            }else{
                // 反之隐藏
                addBtn.addClass('hidden');
            }

        },

        /**
         * 拼合所有的输入值
         * @method getValue
         * @return {Object} key-value pair
         */
        getValue: function(){
            var self = this,
                itemSelector = self.get('itemSelector'),
                inputContainer = self.get('inputContainer'),
                ret = {};
            self.container.all(itemSelector).each(function(item, idx){
                var key = item.one('select').val();

                var inpValue = '',
                    separator = self.get('separator'),
                    inputs = item.one(inputContainer).all('input');
                if(inputs.length > 1){
                    var inpArr = [];
                    inputs.each(function(item){
                        var val = S.trim(item.val());
                        if(val != ''){
                            inpArr.push(val);
                        }
                    });
                    inpValue = inpArr.join(separator);
                }else{
                    inpValue = S.trim(inputs.val());
                }

                if(inpValue != ''){
                    if(!(key in ret)){
                        ret[key] = [];
                    }
                    ret[key].push(inpValue);
                }
            });

            return ret;
        }

    }, {ATTRS : /** @lends SelectInput*/{

        /**
         * 总容器selector
         * @type {NodeList}
         */
        container: {
            value: null,
            getter: function(val){
                console.assert(val, 'SelectInput container invalid!');
                return $(val);
            }
        },

        /**
         * input和删除button的容器selector
         * @type {String} selector query string
         */
        contentContainer: {
            value: null
        },

        /**
         * input的容器selector
         * @type {String} selector query string
         */
        inputContainer: {
            value: null
        },

        /**
         * 对应各个下拉选项的输入框html，按照下拉选项顺序
         * @type {Array}
         */
        inpTpl: {
            value: []
        },

        /**
         * 输入项的selector
         * @type {String} selector query string
         */
        itemSelector: {
            value: null
        },

        /**
         * 添加和删除按钮selector
         * @type {Object} selector query string
         */
        buttons: {
            value: {
                add: null,
                del: null
            }
        },

        /**
         * 输入框计数
         * @type {Number}
         */
        itemCount: {
            value: 1
        },

        /**
         * 同组input框的值拼接分隔符
         * @type {String}
         */
        separator: {
            value: '#'
        }

    }});
    return SelectInput;
}, {requires:['node', 'base', 'event']});