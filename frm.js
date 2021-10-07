/**
 * Created with JetBrains PhpStorm.
 * User: user
 * Date: 27.04.12
 * Time: 17:27
 * To change this template use File | Settings | File Templates.
 */

(function ($, undefined) {
  $.widget("o.frm",{
 options: {
     url           : null,
     frmObject     : null,
     params        : {},
     _paramsSended : {},
     saveAction    : 'save',
     applyAction   : 'apply',
     okAction      : 'ok',
     loadAction    : 'load',
     showButtons   : ['apply', 'save'],
     buttons       : [],
     width         : '950px',
     useCtrlEnter  : true,
     _title        : null,
     showTitle     : true
 },
setParam: function(paramName,paramValue) {

  if (paramName=='id') {
      this.options.id=paramValue;
      return;
  };
  this.options.params[paramName]=paramValue;

},
/** Открыть **/
open : function () {

        if (this._trigger('_beforeopen',{},{parent:this,action:this.options._currAction})===false) {
            return;
        };
          this._fillLocal();
          this._fillRemote();
    /****************************************
     * Если id не указан, то данные
     * по средствам AJAX мы не получим.
     ***************************************/


          if (this.options.id==null || !this.options.hasOwnProperty('loadAction') || this.options.loadAction==null) {
              this.options.frmObject.dialog('open');
          };
},
close : function () {
          var self=this;
          self.options.frmObject.dialog('close');
          self._trigger('_afterclose',{},{parent:self});
},
/** Установить искомый ID **/
setId   : function (id)  {
   /*
     Это присвоение обязательно, так как от предыдущих
     отправок может остаться айдишник в параметрах.
    */
   this.options.params.id=id;
   this.options.id=id;
 },

/** Поменять действие по-умолчанию **/
setAction : function (action) {
    this.options.action=action;
},
setUrl : function (url) {
          this.options.url=url;
},

/** Установить доп. параметры **/
setParams : function(params) {
    var self=this;
    $.extend(this.options.params,params);
 },

/** Получить параметры **/
getParams : function () {
          var self=this;
          return this.options.params;
      },
getParam  : function (param) {

  if (param=='id') {
      return this.options.id;
  };
  return this.options.params[param];
},

getParamSended : function (param) {
          var self=this;

          if (self.options._paramsSended.hasOwnProperty(param)) {
              return self.options._paramsSended[param];
          };

          return null;
},
/** Полная очистка форма + пар-ры **/
clear: function () {
  this._clear();
  this.options.params={};
},
/** Отобразить **/
_create : function (conf) {
    $.extend(this.options,conf);
    this.options.frmObject = this.element;
    this._createDialog();

    this._trigger('_aftercreate',{},{parent:this});

},

      /**
       * Создать виджет
       * @private
*/
_createDialog : function () {
          var self=this,
             buttons=[];
    $.extend(buttons,self.options.buttons);


    self.options.pid = 'frm-' + $(self.element).attr('id');

    if ($.inArray('apply',self.options.showButtons)>-1) {
        buttons.push({
            text:'Применить',
            click:function () {
                self.options._currAction=self.options.applyAction;
                self._trigger('_onclick',{},{parent:self,action:self.options._currAction});

                if (self._beforeSave({button:'apply'})===false) {
                    return;
                };
                self._saveEdit();
            },
            'class':'btn'
        });
    };

    if ($.inArray('save',self.options.showButtons)>-1) {
        buttons.push({
            text:'Сохранить',
            click:function () {
                self.options._currAction=self.options.saveAction;
                self._trigger('_onclick',{},{parent:self,action:self.options._currAction,button:'save'});

                if (self._beforeSave({button:'save'})===false) {
                    return;
                };
                self._saveEdit();
            },
            'class':'btn'
        });
    };

    if ($.inArray('ok',self.options.showButtons)>-1) {
        buttons.push({
            text:'ОК',
            click:function () {

                self.options._currAction=self.options.okAction;
                self._trigger('_onclick',{},{parent:self,action:self.options._currAction});

                if (self._beforeSave({button:'ok'})===false) {
                    return;
                };
                self._saveEdit();
            },
            'class':'btn'
        });
    };

    buttons.push({
               text:'Отмена',
               click:function () {
                   self.options._currAction='cancel';
                   self._trigger('_onclick',{},{parent:self,action:self.options._currAction});
                   self._afterCancel();
               },
            'class':'btn'
           });



          self._adorn();

          self.options.frmObject.dialog({
              width:self.options.width,
              autoOpen:false,
              modal:true,
              buttons:buttons,
              dialogClass: self.options.pid,
              beforeClose : function (event,ui) {
                  self._trigger('_beforeclose',{},{parent:self,event:event,ui:ui,action:self.options._currAction});

                  /** Данная ветка отрабатывает событие закрытия по Esc **/

                  if (!self.options._currAction || self.options._currAction=='cancel') {
                      self._trigger('_aftercancel',{},{parent:self});
                  };
              }
          });

          if (self.options.height) {
              self.options.frmObject.dialog('option','height',self.options.height);
          };

          // Запоминаем первоначальный заголовок
          this.options._title=this.options.frmObject.dialog('option','title');

          self._bindKeyEvents();
      },

/**
     * Сохранить
     * @private
     */
 _saveEdit     : function () {
        var self=this,
            url=self._makeUrl(self.options.saveAction),
            params,
            tryToSend,
            hasFileReader = self.element.adorn('hasFileReader'),
            processData = !hasFileReader,
            contentType = hasFileReader ? false : 'application/x-www-form-urlencoded; charset=UTF-8';

        // Если передаем в качестве параметра ссылку на считыватель файлов, то adorn вернет
        // FormData иначе {}
        tryToSend=self.element.adorn('get');
        tryToSend['id']=self.options.id;
        $.extend(tryToSend,self.options.params);

         if (hasFileReader) {
            params = new FormData();
            params=self.element.adorn('get',params);


        	if (self.options.id) {
                    try {
                        params.delete('id')
                    } catch (e) { };
        	        params.append('id',self.options.id);
        	    };

            self._fillFormData(params,self.options.params);

         } else {
                params=tryToSend;
         };

        if (self._beforeSend(tryToSend)===false) {
            return;
        };

        $.ajax({
                url: url,
                data: params,
                processData: processData,
                type: 'POST',
                cache:false,
                contentType: contentType,
                dataType:'json',
                success: function (res) {
                    $.extend(self.options._paramsSended,self.element.adorn('get'));
                    self._afterSave(res);
                }
            });

    },

/** Очистить форму**/
_clear: function () {
        this.element.adorn('clear');
 },
/** Загрузить с сервиса **/
_fillRemote : function () {
            var self= this,
                m   = {},
                currElement,
                currElementModel;

            $.extend(self.options.params,{id:self.options.id});


    if (!self.options.hasOwnProperty('loadAction') || self.options.loadAction==null) {
        return;
    };


    if (self.options.id!=undefined) {


        this._doAction(self.options.loadAction,self.options.params,function (result) {
            self.element.adorn('fillElements',result);
            self._trigger('_afterload',{},{parent:self,result:result});
            /********************************************************
             * Если айдишник указан, то данные мы обязаны получить. *
             ********************************************************/
            if (self.options.id) {
                self.options.frmObject.dialog('open');
            };
        });
    };
        },
/** Загрузить с локальных параметров **/
_fillLocal  : function () {
            /**
             * Если на форме вывода есть элемент,
             * который передаем в качестве параметра,
             * то устанавливаем его значение.
             */
            var self=this;
            var params=self.options.params;
            self.element.adorn('fillElements',params);
        },
/**
         * Закрашиваем элементы,
         * навешивая на них jQuery
         * виджеты.
         * @private
         */
_adorn   : function () {
    var self=this;
    self._bindToEvents();
    self.element.adorn();
},

_doAction     : function (name,params,onEndAction) {
            var self=this;
            $.postJSON(self._makeUrl(name),params,function (result) {
                onEndAction(result);
            });
        },
_makeUrl      : function (action) {
            return $.createUrl(this.options.url,action);
        },
_bindToEvents: function () {
            var self=this;
            var params={};
            self.element.bind('adorn_queuecomplete',function (e,queueData) {
                    self._afterSave(queueData);
            });

            self.element.bind('adorn_onready',function(e,finfo) {

                $.extend(params,self.options.params);
                    if (finfo.fuElement==undefined || finfo.fuElement==null) {
                        // Перекрываем ID из рисователя
                        finfo.postData['id']=self.options.id;

                        //Отправляем на сервер
                        self._doAction(self.options.saveAction,finfo.postData,function (result) {
                            self._afterSave(result);
                        });
                    } else {
                        $.extend(params,finfo.postData);
                        $('#'+finfo.fuElement).uploadify('settings','formData',params);
                        $('#'+finfo.fuElement).uploadify('settings','uploader',self._makeUrl(self.options.saveAction));
                        $('#'+finfo.fuElement).uploadify('upload','*');

                    };

            });
},
_afterSave : function (res) {
          var self=this;

          if (self._trigger('_aftersave',{},{parent:self,result:res})===false) {
               return false;
          };

          self._clear();
          self.close()
      },
_beforeOpen: function () {
          var self=this;
          return self._trigger('_beforeopen',{},{parent:self});
},
_beforeSave: function (p) {
          var self = this;
          return self._trigger('_beforesave',{},{parent:self,action:self.options._currAction,button: p.button});
},
_beforeSend: function (params) {
    var self=this;
    return self._trigger('_beforesend',{},{parent:self,action:self.options._currAction,params:params});
},
_afterCancel : function () {
          var self=this;
          self.close();
          self._trigger('_aftercancel',{},{parent:self});
      },
 setTitle: function (title) {
    this.options.frmObject.dialog('option','title',title);
 },
 resetTitle: function() {
     this.options.frmObject.dialog('option','title',this.options._title);
 },
 getTitle:function () {
     return this.options.frmObject.dialog('option','title');
 },
_bindKeyEvents: function () {
          var self=this;

          if (self.options.useCtrlEnter) {
              $('.'+self.options.pid).on('keyup',function (e) {

                  if ((e.ctrlKey || e.metaKey) && (e.keyCode == 13 || e.keyCode == 10)) {

                      self.options._currAction=self.options.okAction;
                      self._trigger('_onclick',{},{parent:self,action:self.options._currAction});

                      if (self._beforeSave({button:'ctrl+enter'})===false) {
                          return;
                      };

                      self._saveEdit();
                  };
              });
          };

},
      /*******************************************
       * Взято с https://stackoverflow.com/questions/22783108/convert-js-object-to-form-data
       * @param FormData
       * @param data
       * @param name
       * @private
       */
_fillFormData: function (FormData, data, name){
    var self=this;
        name = name || '';
        if (typeof data === 'object'){
            $.each(data, function(index, value){
                if (name == ''){
                    self._fillFormData(FormData, value, index);
                } else {
                    self._fillFormData(FormData, value, name + '['+index+']');
                }
            })
        } else {
            FormData.append(name, data);
        }
    },
      unsetParam: function (key) {
          if (this.options.params.hasOwnProperty(key)) {
              delete this.options.params[key];
          };
      },
      save: function () {
          var self=this;

          if (self._beforeSave({button:'__program_trigger__'})===false) {
              return;
          };
          self._saveEdit();
      }

  });
})( jQuery );
