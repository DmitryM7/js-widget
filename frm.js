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
     url: null,
     frmObject: null,
     params: {},
     _paramsSended: {},
     saveAction: 'save',
     applyAction: 'apply',
     okAction: 'ok',
     loadAction: 'load',
     showButtons: ['apply', 'save'],
     buttons: [],
     width: '950px',
     useCtrlEnter:true,
     _title: null,
     showTitle: true
 },
      close : function () {
          var self=this;
          self.options.frmObject.dialog('close');
          self._trigger('_afterclose',{},{parent:self});
      },
      setParam: function(paramName,paramValue) {
  this.options.params[paramName]=paramValue;
},
      /** Открыть **/
open : function () {

          this._fillLocal();
          this._fillRemote();
          /****************************************
           * Если id не указан, то данные
           * по средствам AJAX мы не получим.
           ***************************************/

          if (this.options.id==null && this._beforeOpen()!==false) {
              this.options.frmObject.dialog('open');
          };

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
},
/**
       * Создать виджет
       * @private
       */
_createDialog : function () {
          var self=this;
          var buttons=[];

          $.extend(buttons,self.options.buttons);

          self.options.pid = 'frm-' + $(self.element).attr('id');

          if ($.inArray('apply',self.options.showButtons)>-1) {
              buttons.push({
                         text:'Применить',
                         click:function () {
                                           self.options._currAction=self.options.applyAction;
                                           self._trigger('_onclick',{},{parent:self,action:self.options._currAction});

                                           if (self._beforeSave()===false) {
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
                                         self._trigger('_onclick',{},{parent:self,action:self.options._currAction});

                                        if (self._beforeSave()===false) {
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

                      if (self._beforeSave()===false) {
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
                   self._clear();
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
              closeText: "Закрыть",
              beforeClose : function (event,ui) {
                  self._trigger('_beforeclose',{},{parent:self,event:event,ui:ui,action:self.options._currAction});
              }
          });
          // Запоминаем первоначальный заголовок
          this.options._title=this.options.frmObject.dialog('option','title');

          var closeButton=$('<div style="position:absolute;right:18px;top:17px"></div>').
                        append($('<a href="#"><img src="../../../images/verstka/close.jpg"></a>').click(function (e) {
                            self.close();
                            return false;
                        }));

          if  (!self.options.showTitle) {
        $('.' + self.options.pid).find('.ui-dialog-titlebar').remove();
        $('.' + self.options.pid).find('.ui-tabs-nav').append(closeButton);
    } else {
        $('.' + self.options.pid).find('.ui-dialog-title').append(closeButton);
        $('.' + self.options.pid).find('.ui-dialog-titlebar-close').remove();
    };

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
            hasFileReader = self.element.adorn('hasFileReader'),
            processData = !hasFileReader,
            contentType = hasFileReader ? false : 'application/x-www-form-urlencoded; charset=UTF-8';


    /**
     * Если не прописан внешний URL, то считаем, что сохранение прошло.
     */
    if (self.options.url==null) {
        self._afterSave();
        return;
    };

          // Если есть считыватель файлов, то adorn вернет
          // FormData иначе {}


         if (hasFileReader) {
            params = new FormData();
            params=self.element.adorn('get',params);

            $.each(self.options.params,function (key,value) {
                        params.append(key,value);
             });
         } else {
                params=self.element.adorn('get');
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


            if (self.options.id!=undefined) {
                this._doAction(self.options.loadAction,self.options.params,function (result) {

                    self.element.adorn('fillElements',result);

                    self._trigger('_afterload',{},{parent:self,result:result});

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
            return this.options.url+(action!=null ? '/'+action : "");
        },
_bindToEvents: function () {
            var self=this;
            var params={};
            self.element.bind('adorn_queuecomplete',function (e,queueData) {
                    self._afterSave(queueData);
                });
            self.element.bind('adorn_onclear',function (e,rrr) {
                    self.close();
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
_beforeOpen: function () {
    var self=this;
    return self._trigger('_beforeopen',{},{parent:self});
 },
_beforeSave: function () {
    var self = this;
    return self._trigger('_beforesave',{},{parent:self,action:self.options._currAction});
},
_afterCancel : function () {
          var self=this;
          self._trigger('_aftersave',{},{parent:self});
          self.close();
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

                if (self._beforeSave()===false) {
                    return;
                };

                self._saveEdit();
            };
        });
    };

}
});
})( jQuery );

/*
jQuery(function($) {
//alert($('.footer').css('position'));
 PopUpHide();
  // здесь код скрипта, где в $ будет находиться объект, предоставляющий доступ к функциям jQuery
/*
$(".wibor_ustr_list").hover(function() {
$(".wiborite_ustr").removeClass('opa');
});

$(".wiborite_ustr").hover(function() {
$(".wiborite_ustr").removeClass('opa');
});*/
/*$(".wibor_ustr_pic").click(function() {


});

/*$(document).click(function() {

//$( this ).removeClass( "hover" );
//$( ".wiborite_ustr" ).mouseleave();
//$( ".wibor_ustr_list" ).mouseleave();
/*
if (jQuery(this).attr('class') == 'wibor_ustr_pic') {
alert(jQuery(this).attr('class'));
$(".wiborite_ustr").css("opacity",'1');
$(".wiborite_ustr").css("left",'0');
} else {
alert(jQuery(this).attr('class'));
$(".wiborite_ustr").css("opacity",'0');
$(".wiborite_ustr").css("left",'-99999px');
}
*/
//$(".wiborite_ustr").css("left",'-99999999999px');

//$(".wiborite_ustr").addClass("opa");
//$(".wiborite_ustr").removeClass('opa');
/*
});

$( ".dob_ustr" ).click(function() {

    $("#popup1").show();
});

})*/
/*
function PopUpShow(){

    $("#popup1").show();
}
function PopUpHide(){
    $("#popup1").hide();
}
;*/