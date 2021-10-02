/**
 * Created by dmitr_000 on 18.01.15.
 */
(function ($, undefined) {
    $.widget("o.sprint",{
        options: {
           weekByRow:8,
           defSprints:{},
           _res:{},
           width:'650',
           title:'',
           _frmObject:null,
           multiSelect:true
        },
        getWeeksInYear    : function (d) {
            return moment(d).isoWeeksInYear()
        },
        getLastMonthDate : function (date) {
            var res;
            res = new Date(date.getFullYear(),date.getMonth(),new Date(date.getFullYear(),date.getMonth()+1,0).getDate());
            return res;
        },
        getFirstMonthDate: function (month) {
            var res;
            res = new Date(date.getFullYear(),date.getMonth(),1);
            return res;
        },
        _create: function(conf) {
            var self=this,
                p=self.element,
                s;

            $.extend(self.options,conf);
            $.extend(self.options._res,self.options.defSprints);
            self.options.title=self.element.attr('title');

            self._initCanvas(p);
            self._initDialog();
            self._trigger('_aftercreate',{},{parent:self});

        },
        _initCanvas: function(p) {
            var el,self=this;
            el=$('<div class="sprint-panel">'      +
                 '<p>'                             +
                 '<table><tr><td><a href="#" class="sprint-left-btn"><img src="/images/32x32/14-32.png"></a></td><td><input type="text" name="year" class="sprint-year-input" model="sprint-year" value="' + moment().year() + '" size="4"></td><td><a href="#" class="sprint-right-btn"><img src="/images/32x32/12-32.png"></a></td></tr></table>' +
            '</p>'                            +
                 '<div id="sprint-place"></div>'   +
                 '</div>');
            p.append(el);

            self.options._frmObject=self.element.find('.sprint-panel');

            self.options._frmObject.find('.sprint-left-btn').click(function (e) {
                var currYear = parseInt(self.options._frmObject.find('[model="sprint-year"]').val()),
                    newYear;
                newYear = currYear - 1;
                self.options._frmObject.find('[model="sprint-year"]').val(newYear);
                $.extend(self.options._res,self._getSelected(currYear));
                self._set2Panel(self._buildByYear(newYear,self.options._res));
                return false;
            });

            self.options._frmObject.find('.sprint-right-btn').click(function (e) {
                var yearInput = self.options._frmObject.find('[model="sprint-year"]'),
                    currYear = parseInt(yearInput.val()),
                    newYear;
                newYear = currYear + 1;
                yearInput.val(newYear);
                $.extend(self.options._res,self._getSelected(currYear));
                self._set2Panel(self._buildByYear(newYear,self.options._res));
                return false;
            });

            self.options._frmObject.find('[model="sprint-year"]').blur(function (e) {
                var yearInput = self.options._frmObject.find('[model="sprint-year"]'),
                    currYear = parseInt(yearInput.val());
                yearInput.val(currYear);
                $.extend(self.options._res,self._getSelected(currYear));
                self._set2Panel(self._buildByYear(currYear,self.options._res));
                return false;
            });


        },
        _initDialog : function () {
            var self=this;
            self.options._frmObject.dialog({
                autoOpen: false,
                width   : self.options.width,
                modal   : true,
                title   : self.options.title,
                buttons : [{
                             'text':'Применить',
                              click: function () {
                                  var currYear = parseInt(self.options._frmObject.find('[model="sprint-year"]').val());
                                  $.extend(self.options._res,self._getSelected(currYear));
                                  self.options._frmObject.dialog('close');
                                  self._trigger('_afterclose',{},{parent:self,type:'apply'});
                                  self._trigger('_afterapply',{},{parent:self});
                              }
                           },
                           {
                             'text':'Отменить',
                              click: function () {
                                  // Возвращаем выбранные до открытия элементы                                  
                                  self.options._frmObject.dialog('close');
                                  self._trigger('_afterclose',{},{parent:self,type:'cancel'});
                                  self._trigger('_afterсancel',{},{parent:self});
                              }
                           }
                           ]
            });
         },
        _buildByYear : function (year,sel) {
            var self=this,
                res='',
                begDate,endDate,
                weekByRow = self.options.weekByRow,
                isChecked,currSprint,sprintId,
                showCheckbox=false;

            begDate = new Date(year,0,1);
            endDate = new Date(year,11,28);
            begWeek = 1;
            endWeek = self.getWeeksInYear(begDate);

            // В IE <= 8 не работает :checked учитываем этот
            // нюанс путем явного отображения чекбосов.
            if ( $.browser.msie ) {
                showCheckbox= $.browser.version <= 8 ? true : false;
            };

            //Строим таблицу которая будет отображать спринты
            res = res + '<table>';
            for (i=begWeek;i<endWeek+1;i++) {
                 isChecked = sel.hasOwnProperty(self._idByYearWeek(year,i)) && sel[self._idByYearWeek(year,i)]===true;

                 currSprint=moment().year() == year ? moment().isoWeek() : -1;

                 if (i % weekByRow == 1) {
                     res = res + '<tr>';
                 };
                /**
                 * Во-первых, выделяемый спринт который идет в текущий момент, если на этот спринт запланирова работа,
                 * то выделяем его просто как спринт в работу.
                 * Во-вторых, в случае если используется IE отображаем checkbox и выделяем цветом
                 * @type {string}
                 */
                res = res + '<td>' +
                    '<label class="sprint-label ' + (currSprint == i && !isChecked ? 'sprint-selected' : (showCheckbox && isChecked ? 'sprint-input-checked' : '')) + '">' +
                    '<input type="checkbox" class="' + (showCheckbox ? '' :'sprint-input') +'" model="' + i + '"' + (isChecked ? 'checked' : '') +'>' +
                    '<span class="sprint-span">' + i + '</span>' +
                    '</label>' +
                    '</td>';

                if (i % weekByRow == 0 || i==endWeek) {
                    res = res + '</tr>';
                }
            };
            res = res + '</table>';
            return res;
        },
        _set2Panel : function (pan) {
            var self=this;
            self.options._frmObject.find('#sprint-place').html(pan);
        },
        _getSelected : function (year) {
            var self=this,
                p=self.options._frmObject,
                res={},
                sprintId;

            if (year==undefined) {
                year = moment().year();
            };

            $.each(p.find('input'),function (i,element) {
                sprintId =self._idByYearWeek(year,$(element).attr('model'));
                res[sprintId]=$(element).prop('checked');
            });
            return res;
        },
        _idByYearWeek:function (year,week) {
            var weekWithZero;
            // Здесь воспринимаем все числа как строки
            week = week.toString();
            year = year.toString();
            weekWithZero = week.length<2 ? '0'+week : week;
            return year + weekWithZero;
        },
        getSprintsBySplitter: function(splitter) {
            var self=this,res='';
            $.each (self.options._res,function (i,e) {
                if (e==true) {
                    res = res + i + splitter;
                };
            });
            return res.substr(0,res.length-1);
        },
        _isChrome: function () {
           return /chrom(e|ium)/.test(navigator.userAgent.toLowerCase()); 
        },
        open: function () {
          var self=this, 
               s,
               currYear = moment().year();
            // Запоминаем выбранный на текущий момент спринты
            // для того чтобы затем могли отменить изменения
          self.options._frmObject.find('[model="sprint-year"]').val(currYear);

          s = self._buildByYear(currYear,self.options._res);
          self._set2Panel(s);

          self.options._frmObject.dialog('open');

        },

        getCurrSprint : function () {              
             return _idByYearWeek(moment().year(),moment().isoWeek());
        }
   });
})( jQuery );