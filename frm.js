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
            id           : null,
            url          : null,
            frmObject    : null,
            params       : {},
            saveAction   : 'save',
            loadAction   : 'load',
            buttons      : ['apply','save'],
            width        : '950px',
            _title       :null
 },
setParam: function(paramName,paramValue) {
  this.options.params[paramName]=paramValue;
},
/** Открыть **/
open : function () {
var self=this;
         if (self._trigger('_beforeopen',{},{parent:self,action:self.options._currAction})===false) {
                                               return;
         };
          this._fillLocal();
          this._fillRemote();
          /*
           * Если id не указан, то данные
           * по средствам AJAX мы не получим.
           */
          if (this.options.id==null) {
              this.options.frmObject.dialog('open');
          };

},
close : function () {
    var self=this;
    self.options.frmObject.dialog('close');
},
/** Установить искомый ID **/
setId   : function (id)  {
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
  return this.options.params[param];
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
},
/**
       * Создать виджет
       * @private
       */
_createDialog : function () {
          var self=this;
          var buttons=[];

          if ($.inArray('apply',self.options.buttons)!=-1) {

              buttons.push({
                         text:'Применить',
                         click:function () {
                                           self.options._currAction='apply';
                                           if (self._trigger('_onclick',{},{parent:self,action:self.options._currAction})===false) {
                                               return;
                                           };
                                           self._saveEdit();
                         }
              });
          };

          if ($.inArray('save',self.options.buttons)!=-1) {

              buttons.push({
                  text:'Сохранить',
                      click:function () {
                                         self.options._currAction=self.options.saveAction;
                                         if (self._trigger('_onclick',{},{parent:self,action:self.options._currAction})===false) {
                                            return;
                                         };
                                         self._saveEdit();
                                        }
              });
          };

          buttons.push({
               text:'Отмена',
               click:function () {
                   self.options._currAction='cancel';
                   self._trigger('_onclick',{},{parent:self,action:self.options._currAction});
                   self._clear();
               }
           });

          self._adorn();

          self.options.frmObject.dialog({
              width:self.options.width,
              autoOpen:false,
              modal:true,
              buttons:buttons,
              beforeClose : function (event,ui) {
                  self._trigger('_beforeclose',{},{parent:self,event:event,ui:ui,action:self.options._currAction});
              }
          });
          // Запоминаем первоначальный заголовок
          this.options._title=this.options.frmObject.dialog('option','title');
      },

/**
     * Сохранить
     * @private
     */
 _saveEdit     : function () {
        var self=this,
            url=self._makeUrl(self.options.saveAction),
            params,
            hasFileReader = self.element.adorn('hasFileReader'),
            processData = !hasFileReader,
            contentType = hasFileReader ? false : 'application/x-www-form-urlencoded; charset=UTF-8';

          // Если есть считыватель файлов, то adorn вернет
          // FormData иначе {}


         if (hasFileReader) {
            params = new FormData();
            params=self.element.adorn('get',params);

	    if (self.options.id) {
	        params.append('id',self.options.id);
	    };
          $.each(self.options.params,function (key,value) {
                params.append(key,value);
            });
         } else {
                params=self.element.adorn('get');
                params['id']=self.options.id;
                $.extend(params,self.options.params);
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
            var self= this;
            var m   = {};
            var currElement, currElementModel;

            $.extend(self.options.params,{id:self.options.id});


            if (self.options.id!=undefined) {
                this._doAction(self.options.loadAction,self.options.params,function (result) {

                    self.element.adorn('fillElements',result);
                    /**
                     * Если айдишник указан, то данные мы обязаны получить.
                     */
                     if (self.options.id) {
                        self.options.frmObject.dialog('open');
                    }
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
            return this.options.url + (action != null ? '/' + action : "");
        },
_bindToEvents: function () {
            var self=this;
            var params={};
            self.element.bind('adorn_queuecomplete',function (e,queueData) {
                    self._afterSave(queueData);
                });
            self.element.bind('adorn_onclear',function (e,rrr) {
                    self.options.frmObject.dialog('close');
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
          self._clear();
          self._trigger('_aftersave',{},{parent:self,result:res});
          self.close();
      },
_afterCancel : function () {
          var self=this;
          self._trigger('_aftersave',{},{parent:self});
          self.options.frmObject.dialog('close');
      },
 setTitle: function (title) {
    this.options.frmObject.dialog('option','title',title);
 },
 resetTitle: function() {
     this.options.frmObject.dialog('option','title',this.options._title);
 },
 getTitle:function () {
     return this.options.frmObject.dialog('option','title');
 }
});
})( jQuery );


