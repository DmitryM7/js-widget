/**
 * Created with JetBrains PhpStorm.
 * User: user
 * Date: 8/20/12
 * Time: 9:19 PM
 * To change this template use File | Settings | File Templates.
 */

(function ($, undefined) {
    $.widget("o.breadcrumbs",{
        options   : {
         path     : [],
         _path    : [],
         maxCount :null,
         skipRepeatValue:false
        },
        _create : function (params) {
            var self=this;
            $.each(self.options.path,function (index,el) {
              self._push(el);
            });
        },
         push    : function (link) {
            var self=this;

             // Удаляем ведущий и завершающий слэш,
             // так как никакой значащей информации они
             // не несут
             link.href = link.href.replace(/^\/+|\/+$/gm,'');

            /** Проверяем на наличие повторений **/
             if (!link.hasOwnProperty('title')) {
                 link.title=link.text;
             }

            if (self.options.skipRepeatValue && self._hasPath(link.href)) {
                return;
            };

            self._push(link);

            if (self.getCount() > self.options.maxCount) {
                self.shift();
            };
            self._clear();
            self.build();
        },
        _push   : function (link) {
          var self=this;
          var options=self.options;
          var el,lnk;

          el=$('<div></div>').addClass('breadcrumbs-point');

          $('<a></a>').
              attr('href',link.href).
              attr('title',link.title).
              append(link.text).
              appendTo(el);

          self.clearActive();

          options._path.push(el);
          options.path.push(link);
        },

        _render : function (el) {
            var self=this;
               if (el!==undefined) {
                   /**
                    * Обработчик click
                    * должен быть именно здесь.
                    * Так как элементы пересоздаются
                    * заново и в другом месте он потеряется.
                    */
                  el.click(function (e) {
                      var currLink=$(e.target).attr('href');
                       self._trigger('_onclick',{parent:self,link:currLink});
                   });

                   self.element.append(el);
               };
        },
         build : function () {
            var self=this;
            var options=self.options;
            var maxCount;
            var currWidth;

            maxCount = options.maxCount == null ? options._path.length : options.maxCount;


            $.each(options._path,function (key,val) {
                /**
                 * Обозначаем последний элемент в крошках
                 */
                if (key==options._path.length-1) {
                    val.addClass('last');
                } else {
                    val.removeClass('last');
                };
                self._render(val);
                currPos = val.position().left;
            });
             if (currPos==0 && self.getCount()!=1) {
                 // Полезли на другую строку удаляем до тех пор
                 // пока не останется одного элемента или вообще только один,
                 // но длинный
                 while (self.getCount()!=1 && currPos==0) {
                     self.shift();
                     $('.breadcrumbs-point:first').remove();
                     currPos=$('.breadcrumbs-point:last').position().left;
                 };
             };
        },
        _hasPath : function (href) {
            var self=this;
            var _result=false;
            /**
             * Если не использовать _result,
             * то будет выход из анонимной функции.
             */

            $.each(self.options.path,function (index,el) {
               if (el.href==href) {
                   _result=true;
                   return _result;
               }
            });
            return _result;
        },
        getCount: function () {
            return this.options._path.length;
        },
        shift: function () {
            var self=this;
            self.options._path.shift();
            self.options.path.shift();
        },
        _clear: function () {
            var self=this;
            self.element.empty();
        },
        clearActive: function () {
            var options=this.options;

            $.each(options._path,function (index,el) {
                el.removeClass('breadcrumbs-active');
            });
        },
        setActiveByHref: function (href) {
            var self=this;
            var currElement;
            var p = {};
            self.clearActive();

            /**
             * Ряд параметров в URL не надо учитывать.
             * Например, при пагинации таким параметром
             * является номер страницы.
             */

            // Удаляем ведущий и завершающий слэш,
            // так как никакой значащей информации они
            // не несут
            href = href.replace(/^\/+|\/+$/gm,'');

            href = $.removeURLParam(href,'currPage');
            href = $.removeURLParam(href,'forceLoad');


            $.each(self.options.path,function (index,el) {
                /**
                 * По идее надо делать строгое сравнение,
                 * так как в этой реализации возможны интересные
                 * побочные эффекты.
                 */

               if (el.href.endsWith(href)) {
                   currElement=self.options._path[index];
                   currElement.addClass('breadcrumbs-active');
               }
            });
        }


    });
})( jQuery );