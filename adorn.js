/**
 * Created with JetBrains PhpStorm.
 * User: user
 * Date: 11.05.12
 * Time: 21:50
 * To change this template use File | Settings | File Templates.
 */
(function ($, undefined) {
$.widget("o.adorn",{
   options: {
                   "fileupload":{
                       fileObjName : null,
                       'debug'    : false,
                       swf:'/js/upload/flash/uploadify.swf',
                       uploader:null,
                       buttonText:'Выбрать файл(ы)...',
                       auto:false,
                       buttonImage : '',
                       button_image_url : '',
                       fileDataName:'file'
                    },
                   fuElement:null,
                   fuQueueCount:0,
                   params:{}
                 },
   _create: function(conf) {
       var self=this;
       var fileAddButton,fileClearButton,jFileInfo;
       var hasFileReader = self.hasFileReader();
       var p=self.element;
       var myPicker,jel;

       $.extend(self.options,conf);

       // Инициализируем элементы загрузки файлов
       self.options.fileupload.onCancel=function (r) {
           self.options.fuQueueCount=0;
           self._trigger('_onclear',{},{parent:self});
       };

       self.options.fileupload.onSelect=function (f) {
           self.options.fuQueueCount++;
       };

       self.options.fileupload.onQueueComplete=function (f) {
           self._trigger('_queuecomplete',{},{result:f});
       };

       self.options.fileupload.onUploadSuccess=function (f,d,r) {

           self._trigger('_uploadsuccess',{},{f:f,d:d,r:r});
       };

       if (arguments.hasOwnProperty(0)) {
           $.extend(self.options,arguments[0]);
       };

       $.each(self.element.find('[view-as]'),function (index,element) {
           jel=$(element);
           switch (jel.attr('view-as')) {
               case "datepicker":
                   jel.datepicker({showWeek: true});
                   break;
               case "fileupload":
                   self.options.fu=jel;
                   self.options.fuElement=jel.attr('id');
                   self.options.fileupload.fileObjName=jel.attr('model');
                   jel.uploadify(self.options.fileupload);
                  break;
               case "multiselect":
                   jel.attr('multiple','multiple');
                   jel.multiselect({
                       selectedList:30
                   }).multiselectfilter();
                   break;
               case "autocomplete":
                   var source=jel.attr('source');
                   var typeSelect=jel.attr('multiselect');
                   if (typeSelect) {
                       jel.bind( "keydown", function( event ) {
                           if ( event.keyCode === $.ui.keyCode.TAB &&
                               $( this ).data( "autocomplete" ).menu.active ) {
                               event.preventDefault();
                           }
                       }).autocomplete({
                               source: function( request, response ) {
                                   $.postJSON(source, {
                                       term: self._extractLast( request.term )
                                   }, response );
                               },
                               search: function() {
                                   // custom minLength
                                   var term = self._extractLast( this.value );
                                   if ( term.length < 2 ) {
                                       return false;
                                   }
                               },
                               focus: function() {
                                   // prevent value inserted on focus
                                   return false;
                               },
                               select: function( event, ui ) {
                                   var terms = self._split( this.value );
                                   // remove the current input
                                   terms.pop();
                                   // add the selected item
                                   terms.push( ui.item.value );
                                   // add placeholder to get the comma-and-space at the end
                                   terms.push( "" );
                                   this.value = terms.join( ", " );
                                   return false;
                               }
                           });
                   } else {
                       jel.autocomplete({
                           source:source
                       });
                   }
                   break;
               case "file":
                   if (hasFileReader) {
                       jel.attr('accept','audio/*,image/*,video/*,application/*,text/*,capture=camera');
                       fileAddButton=$('<input type="button" value="Файлы" class="adorn-add-button">').click(function (e) {
                           jel.click();
                       }).insertAfter(element);
                       fileClearButton=$('<input type="button" value="Очистить" class="adorn-clear-button">').click(function (e) {
                           self.clear();
                       }).insertAfter(fileAddButton);

                       jFileInfo = self.element.find('.file-info');

                       if (!jFileInfo.length) {
                           jFileInfo = $('<div class="file-info"></div>').insertAfter(fileClearButton);
                       };


                       jel.bind('change',function (e) {
                           var currElement=$(e.target);
                           var myFiles = currElement[0].files;
                           $.each(myFiles,function (key,file) {
                               jFileInfo.append('<p>'+file.name+'</p>');
                           });
                       });
                       jel.hide();
                   } else {
                       // Нет возможности использовать html5
                       // Используем uploadify
                       //self.options.fu=$(element);
                       //self.options.fileupload.fileObjName=$(element).attr('model');
                       //$(element).uploadify(self.options.fileupload);
                   };
                   break;
               case "jscolor":
                   myPicker = new jscolor.color(element, {required:false,hash:true});
                   break;
               case "tinymce":
                   jel.tinymce({
                       toolbar: [
                           'undo redo | bold italic | link image | alignleft aligncenter alignright | forecolor backcolor | numlist bullist | image'
                           ],
                       language:'ru',
                       menubar: 'edit insert format table tools',
                       statusbar: false,
                       plugins : ['emoticons template paste textcolor colorpicker textpattern image imagetools lists']
                   });
                   break;
           };
       });

       $.each(self.element.find('[model]'),function (index,element) {
           //Если нет имени на элементе, то добавим его
           if (!element.hasAttribute('name')) {
               $(element).attr('name',$(element).attr('model'));
           };

       });

       self._fillLocal();
     },
    fillElements:function (params) {
        var self=this;
        self.options.params=params;
        self._fillLocal();
    },
   clear : function () {
     var self=this,
         fileInfo=self.element.find('.file-info'),
         jel;

       $.each(self.element.find('[model]'),function (index,element) {
           jel = $(element);

           if (jel.attr('view-as')!='hidden-not-clear') {
               switch (jel.prop('type')) {
                   case 'radio':
                       break;
                   default:
                       jel.val('');
                       break;
               };

               if (jel.attr('view-as')=='tinymce') {
                   jel.tinymce('setContent','');
               };
           };
       });

     fileInfo.html('');

     if (self.options.fuElement!=null && self.options.fuQueueCount>0) {
         $('#'+self.options.fuElement).uploadify('cancel','*');
     } else {
         self._trigger('_onclear',{},{parent:self});
     };

   },
   get: function(formData) {
       var self=this;
       var postData={};

       var d2s;

       var fuElement;
       var myFiles;
       var returnFormData=true;

       var hasFileReader = self.hasFileReader();

       if (formData==null || formData==undefined || !hasFileReader) {
           returnFormData=false;
       };

       // Если есть считыватель файлов, и в качестве
       // параметра передано, что-то, но не объект типа FileReader
       if (hasFileReader && typeof(formData)!=='object') {
           formData = new FormData();
       };

       //Собираем данные с формы
       $.each(self.element.find('[model]'),function (index, element) {
           switch ($(element).attr('view-as')) {
               case 'multiselect':
                   var checkedItems = $(element).multiselect("getChecked").map(function(){
                       return this.value;
                   }).get();
                   postData[$(element).attr('model')]=checkedItems.join();
                   if (hasFileReader) {
                       formData.append($(element).attr('model'),checkedItems.join());
                   };
                   checkedItems=[];
                   break;
               case 'fileupload':
                   // Хотелось бы сделать так, но uploadify,
                   // не оставляет после себя первончального
                   // элемента.
                   break;
               case 'file':
                   if (hasFileReader) {
                       myFiles = $(element)[0].files;
                       $.each(myFiles,function (i,file) {
                           formData.append($(element).attr('model')+'['+i+']',file);
                       });
                   };
                   break;
               default:
                   switch ($(element).attr('type')) {
                       case "checkbox":
                           postData[$(element).attr('model')] = $(element).prop('checked');
                           if (hasFileReader) {
                               formData.append($(element).attr('model'),$(element).prop('checked'));
                           };
                           break;
                       case "radio":
                           if ($(element).prop('checked')) {
                               postData[$(element).attr('model')]=$(element).prop('value');
                               if (hasFileReader) {
                                   formData.append($(element).attr('model'),$(element).prop('value'));
                               };
                           };
                       break;
                       default:
                           // Правильно обрабатываем случай когда используется
                           // placeholder в IE8
                           // Есть аттрибут плейсхолдер и не произошло изменения содержимого,
                           // то пропускаем значение элемента.
                           
if ($.hasOwnProperty('browser') && $.browser.hasOwnProperty('msie') && $(element).attr('placeholder')!=undefined && $(element).attr('placeholder')!='' && $(element).attr('placeholder')==$(element).val()) {
				                ds2 = '';
                           } else {
                                d2s = $(element).val();
                           };




                           postData[$(element).attr('model')] = d2s;
                           if (hasFileReader) {
                               formData.append($(element).attr('model'),d2s);
                           };
                           break;
                   };
                   break;
           };
       });
       //Вся информация о виджетах получена
       //Пуляем событие
       //self._trigger('_onready',{},{parent:self,postData:postData,fuElement:self.options.fuElement});

    if (returnFormData) {
        return formData;
    } else {
        return postData;
    }

   },
   getAction:function () {
       var self=this;
       var currForm=self.element.find('form');
       return currForm.attr('action');
   },
   _split: function ( val ) {
        return val.split( /,\s*/ );
    },
   _extractLast: function (term) {
       var self=this;
        return self._split(term).pop();
    },
   hasFileReader: function () {
       if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
           return false;
       };

       return typeof(window.FileReader) == 'undefined' ? false : true;
   },
   _fillLocal: function () {
       var self=this,
           params=self.options.params,
           jqe,
           currElementModel,
           k, v,
           valueToSet;

       $.each(self.element.find('[model]'),function (index,element) {
           jqe=$(element);

           currElementModel=jqe.attr('model');
           valueToSet = params.hasOwnProperty(currElementModel) ? params[currElementModel] : '';


           if (jqe.is('select')) {

               /**********************************
                * Если наполняем select из ajax  *
                **********************************/
                   if (params.hasOwnProperty(currElementModel + '_option')) {
                       jqe.empty();

                       $.each (params[currElementModel + '_option'],function (k,v) {
                           jqe.append('<option value="' + k + '">' + v + '</option>');
                       });

                   };

               /**
                * Если элемент селект и принимает два значения истина/ложь,
                * то нужно чтобы значение которое приходило с сервера было строкой.
                * Иначе селект работать не будет.
                */
                    if (typeof(valueToSet)== 'boolean') {
                        valueToSet = (valueToSet + '').toLowerCase();
                    };

               };


           /*****************************************************
            * Если элемент помечен, как не очищаемый,           *
            * то его не трогаем                                 *
            *****************************************************/
               if (jqe.attr('view-as')!='hidden-not-clear') {
                   self._fillElement(jqe,valueToSet);
               };

       });
   },
    _fillElement: function (currElement,value) {

        switch (currElement.attr('type')) {
            case "checkbox":
                if (value=="true" || value=="1" || value===true) {
                    currElement.prop('checked',true);
                } else {
                    currElement.prop('checked',false);
                };
                break;
            case "radio":
                if (currElement.prop('value')==value) {
                    currElement.prop('checked',true);
                } else {
                    currElement.prop('checked',false);
                }
                break;
            default:
                try {
                    //************************************************************************
                    //* Ряд элементов может создавать дополнительные элементы dom элементы   *
                    //* при этом копирует остальные элементы в том числе и аттрибуты model.  *
                    //* Так как мы заранее не знаем поддерживают ли эти тэги метод val,      *
                    //* то обрабатываем ошибку.                                              *
                    //************************************************************************
                    currElement.val(value);
                } catch (err) {
                    //
                };
                break;
        };

        switch (currElement.attr('view-as')) {
            case "jscolor":
                if (currElement.val()=='') {
                    currElement.css('background-color','');
                    currElement.css('background-image','');
                };
                break;
        }
    },
    send:function (url,extData) {
        var self=this,
            d = new Date(),
            currEtime= d.getTime(),
            params={uid:currEtime};
        $.extend(params,self.get());
        self.options.fu.uploadify('settings','uploader',url);
        self.options.fu.uploadify('settings','formData',params);
        self.options.fu.uploadify('upload','*');
    }

  });
})( jQuery );