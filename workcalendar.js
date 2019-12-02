(function ($, undefined) {
$.widget("o.workcalendar",{
   options: {
      currYear:null,
      currMonth:null,
      url:'/board/workCalendar',
      extParams:{},
      employees:{},
      enableTools:true,
      holidayWeekDay: [6, 7],
      typeList:{
        'birthday':{
          'text':'День рожденья'
        },
        'noShakeNew':{
            'icon':'/images/128x128/pause.png',
            'text':'Исключить из распределения'
        },
        'oldNoShakeNew': {
           'icon':'/images/128x128/pause-gray.png',
           'text':'Для истории исключить из распределения'
        },
         'criticalEvent': {
              'icon':'/images/32x32/thunder3.png',
              'text':'ЧС'
          },
        'other': {
            'text':'Иное'
        }
      },
// ISO-8601
      _dayNames: {
         "1":"Пнд",
         "2":"Вт",
         "3":"Ср",
         "4":"Чт",
         "5":"Пт",
         "6":"Сб",
         "7":"Вск"
      }
   },
   _create: function(conf) {
       var self=this,
           options = self.options,
           currDate = new Date();

       $.extend(self.options,conf);


       options.currYear  = options.currYear  == null ? currDate.getFullYear() : options.currYear;
       options.currMonth = options.currMonth == null ? currDate.getMonth() + 1: options.currMonth;

       if (options.hasOwnProperty('url') && options.url != null) {
          self._remoteRefresh();
       } else {
                 self._initCanvas();      
       };

   },
   _initCanvas : function () {
        var self = this,
            options = self.options,
            htmlHeader = '<table border="0">' +
                         '<tbody>' +
                         '  <tr> ' +
                         '   <td><a href="#" class="workcalendar-left-year workcalendar-left-btn"><img src="/images/32x32/14-32.png"></a></td>' +
                         '   <td><input type="text" name="year" class="workcalendar-year-input" model="workcalendar-year" value="' + self.options.currYear +  '" size="4"></td>' +
                         '   <td><a href="#" class="workcalendar-right-year workcalendar-right-btn"><img src="/images/32x32/12-32.png"></a></td>' +
                         '   <td><a href="#" class="workcalendar-left-month workcalendar-left-btn"><img src="/images/32x32/14-32.png"></a></td>' +
                         '   <td><input type="text" name="month" class="workcalendar-month-input" model="workcalendar-year" value="' + self.options.currMonth + '" size="4"></td>' +
                         '   <td><a href="#" class="workcalendar-right-month workcalendar-right-btn"><img src="/images/32x32/12-32.png"></a></td>' +
                         (
                         options.enableTools ? '<td><input type="button" value="Рабоч." class="workcalendar-button-aswork"></td>'    + 
                                               '<td><input type="button" value="Выход." class="workcalendar-button-asholiday"></td>' +
                                               '<td><input type="button" value="Смеще." class="workcalendar-button-asmove"></td>'    +
                                               '<td><input type="button" value="Инфо" class="workcalendar-button-asinfo"></td>'
                         : '') + 
                         '  </tr>'   +
                         ' </tbody>' +
                         '</table>',

            moveDialog = '<div class="workcalendar-moveDialog hidden" title="Режим работы">' +
                          '<dl>'                                             +
                          '<dt><label>Смена:</label></dt>'                   +
		          '<dd>'                                             +
                          '<select class="workcalendar-select-shift">'       +
                          '<option value="0">0-ая (00:00 - 09:00)</option>'  +
                          '<option value="1">1-ая (01:00 - 10:00)</option>'  +
                          '<option value="2">2-ая (02:00 - 11:00)</option>'  +
                          '<option value="3">2-ая (03:00 - 12:00)</option>'  +
                          '<option value="4">4-ая (04:00 - 03:00)</option>'  +
                          '<option value="5">5-ая (05:00 - 14:00)</option>'  +
                          '<option value="6">6-ая (06:00 - 15:00)</option>'  +
                          '<option value="7">7-ая (07:00 - 16:00)</option>'  +
                          '<option value="8">8-ая (08:00 - 17:00)</option>'  +
                          '<option value="9">9-ая (09:00 - 18:00)</option>'  +
                          '<option value="10">10-ая (10:00 - 19:00)</option>' +
                          '<option value="11">11-ая (11:00 - 20:00)</option>' +
                          '<option value="12">12-ая (12:00 - 21:00)</option>' +
                          '<option value="13">13-ая (13:00 - 22:00)</option>' +
                          '<option value="14">14-ая (14:00 - 23:00)</option>' +
                          '<option value="15">15-ая (15:00 - 24:00)</option>' +
                          '<option value="16">16-ая (16:00 - 01:00)</option>' +
                          '<option value="17">17-ая (17:00 - 02:00)</option>' +
                          '<option value="18">18-ая (18:00 - 03:00)</option>' +
                          '<option value="19">19-ая (19:00 - 04:00)</option>' +
                          '<option value="20">20-ая (20:00 - 05:00)</option>' +
                          '<option value="21">21-ая (21:00 - 06:00)</option>' +
                          '<option value="22">22-ая (22:00 - 07:00)</option>'                     +
                          '<option value="23">23-ая (23:00 - 08:00)</option>'                     +
                          '<option value="24">24-ая (24:00 - 09:00)</option>'                     + 
                         '</select>'                                                              +
                         '</dd>'                                                                  +
                         '<dt><label>Комментарий:</label><dt>'                                    +
                         '<dd><textarea class="workcalendar-moveDialog-comment"></textarea></dd>' +
			  '</dl>'                                                                 + 
                          '</div>',
            infoDialog = '<div class="workcalendar-infoDialog hidden" title="Информация">'           +
                          '<dl>'                                                                     +
                            '<dt><label>Тип:</label></dt>'                                           +
                            '<dd><select class="workcalendar-infoDialog-infotype">'                  +
                                    self._createInfoListOption()                                     +
                                 '</select>'                                                         +
                             '</dd>'                                                                 +
                            '<dd><textarea class="workcalendar-infoDialog-comment"></textarea></dd>' +
			  '</dl>'                                                                    + 
                         '</div>',
            moveDialogElement,
            infoDialogElement,
            workFlow = self._renderCalendar();


            self.element.html('<div class="workcalendar-canvas">' + htmlHeader + workFlow + moveDialog + infoDialog + '</div>');


 /*****************************************
  * Диалоги                               *
  *****************************************/
       moveDialogElement = self.element.find('.workcalendar-moveDialog').first();
       moveDialogElement.frm({
                           autoOpen:false,
			   width: '550px',
                           buttons: ['save'],
	        _onclick:function (e,res) {
                    var newShift    = $(this).find('.workcalendar-select-shift').first().val(),
                        moveComment = $(this).find('.workcalendar-moveDialog-comment').val(),
                        params;

                        if (res.action=='save') {
                            params=self._getMoveParams(newShift,moveComment);
                        };

                        res.parent.close();
                        return false;
                  }
        });

       infoDialogElement = self.element.find('.workcalendar-infoDialog').first();
       infoDialogElement.frm({
                           autoOpen:false,
			               width: '550px',
                           buttons: ['save'],                       
                          _onclick:function (e,res) {
                                var infoComment = $(this).find('.workcalendar-infoDialog-comment').val(),
                                    type        = $(this).find('.workcalendar-infoDialog-infotype').val(),
                                    params;
                                   if (res.action=='save') {
                                       params = self._getInfoParams(infoComment,type);
                                   };
                                   res.parent.close();
                                   return false;
                          }
        });


 /****************************************
  * События на изменение ячеек таблицы   *
  ****************************************/

   self.element.find('td.workcalendar-table-td').mousedown(function(){
    $(this).toggleClass('workcalendar-selected');

     self.element.find('td.workcalendar-table-td').on('mouseenter',function(){
      $(this).toggleClass('workcalendar-selected');
    });

  }).mouseup(function(){
    $('td.workcalendar-table-td').off('mouseenter');
  });

  self.element.find('td.workcalendar-table-td').dblclick(function () {
        //alert('Нажал два раза');
  });

 /*****************************************************
  * События обработки кнопок изменения года.          *
  *****************************************************/
  $(self.element.find('.workcalendar-left-year').first()).click(function (e) {
        var el       = self.element.find('.workcalendar-year-input').first(),
            newYear  = self._calcNewYear($(el).val(),-1),
            newMonth = $(self.element.find('.workcalendar-month-input').first()).val();
       
        $(el).val(newYear);

         self.options.currYear = newYear;
         self.options.currMonth = newMonth;

        if (self._trigger('_onchangeperiod',{},{
                                        year:newYear,
                                        month:newMonth
                                       })===false) {
           return false;
        };

        self._remoteRefresh();
        return false;
       
  });

  $(self.element.find('.workcalendar-right-year').first()).click(function (e) {
        var el = $(self.element.find('.workcalendar-year-input').first());
            newYear  = self._calcNewYear($(el).val(),1),
            newMonth = $(self.element.find('.workcalendar-month-input').first()).val();

        $(el).val(newYear);

         self.options.currYear = newYear;
         self.options.currMonth = newMonth;
       
        if (self._trigger('_onchangeperiod',{},{
                                        year:newYear,
                                        month:newMonth
                                       })===false) {
           return false;
        };

        self._remoteRefresh();
        return false;

  });

 /*****************************************************
  * События обработки кнопок изменения месяца.        *
  *****************************************************/


    $(self.element.find('.workcalendar-left-month').first()).click(function (e) {
        var currYear     = self.element.find('.workcalendar-year-input').first().val(),
            currMonth    = self.element.find('.workcalendar-month-input').first().val(),
            yearMonthObj = self._calcNewMonth(currYear,currMonth,-1),
            newYear      = yearMonthObj.year,
            newMonth     = yearMonthObj.month,
            el;


        el = self.element.find('.workcalendar-year-input').first();
        $(el).val(newYear);

        el = self.element.find('.workcalendar-month-input').first();
        $(el).val(newMonth);

         self.options.currYear  = newYear;
         self.options.currMonth = newMonth;

        if (self._trigger('_onchangeperiod',{},{
                                        year:newYear,
                                        month:newMonth
                                       })===false) {
           return false;
        };

        self._remoteRefresh();
           return false;

    });


  $(self.element.find('.workcalendar-right-month').first()).click(function (e) {
        var currYear     = self.element.find('.workcalendar-year-input').first().val(),
            currMonth    = self.element.find('.workcalendar-month-input').first().val(),
            yearMonthObj = self._calcNewMonth(currYear,currMonth,1),
            newYear      = yearMonthObj.year,
            newMonth     = yearMonthObj.month,
            el;


        el = self.element.find('.workcalendar-year-input').first();
        $(el).val(newYear);

        el = self.element.find('.workcalendar-month-input').first();
        $(el).val(newMonth);

         self.options.currYear  = newYear;
         self.options.currMonth = newMonth;

        if (self._trigger('_onchangeperiod',{},{
                                        year:newYear,
                                        month:newMonth
                                       })===false) {
           return false;
        };

        self._remoteRefresh();
           return false;

    });

 /****************************************************
  * События нажатия на кнопки изменения статуса дня  *
  ****************************************************/

  $.each(self.element.find('.workcalendar-button-asholiday,.workcalendar-button-aswork'),function (i,btn) {
     $(btn).click(function (e) {
        var  selected = {},
             selectedOne = {},
             currYear,
             currMonth,
             currType = $(e.target).hasClass('workcalendar-button-asholiday') ? 'holiday' : ($(e.target).hasClass('workcalendar-button-aswork') ? 'work' : 'undefined');

       el = self.element.find('.workcalendar-year-input').first();
       currYear = $(el).val();

       el = self.element.find('.workcalendar-month-input').first();
       currMonth = $(el).val();

       $.each(self.element.find('.workcalendar-selected'),function (i,el) {
           var currElement = $(el),
               currDateIndex = currYear + self._digitWithZero(currMonth) + self._digitWithZero(currElement.data('day')),
               tA = {},
               currPersonId=currElement.data('id');
                   
                   if (selected.hasOwnProperty(currPersonId)) {
                       tA[currDateIndex] = {currYear:currYear,currMonth:currMonth,currDay:currElement.data('day'),type:currType};
                       $.extend(selected[currPersonId].daysObject, tA);		  
                   }
                   else {
                     tA[currDateIndex] = {currYear:currYear,currMonth:currMonth,currDay:currElement.data('day'),type:currType};
                     selected[currPersonId]= {daysObject:tA};
                   };

       });

       $.each(selected,function (i,s) {
           $.extend(self.options.employees[i].daysObject,s.daysObject);
       });

       if (self._trigger('_onchangedata',{},{selected:selected,type:currType})===false) {
         return;
       };

       if (self.options.url != undefined) {
                var params = {selected:selected};

                $.extend(params,self.options.extParams);

                $.postJSON(self.options.url,params,function (res) {
              
                   self._trigger('_onsenddata',{},{selected:selected,res:res,type:currType});
            });
       };

	self._initCanvas();

    });

      self.element.find('.workcalendar-button-asmove').first().click(function(e){
         moveDialogElement.frm('open');
         return;
      });

      self.element.find('.workcalendar-button-asinfo').first().click(function(e){
         infoDialogElement.frm('open');
         return;
      });



  });


   },
  _renderCalendar:function () {
      var self=this,
          employees = self.options.employees,
          html = '',
          th = '';

      
      html = '<table border="1" class="workcalendar-table">' + 
             '<thead>';

        tr = '<tr>';
        tr = tr + '<th rowspan="2"> N </th>' + 
                  '<th rowspan="2"> ФИО </th>';

         for (i=1;i<self._getDaysInMonth(self.options.currYear,self.options.currMonth) + 1;i++) {
             tr = tr + '<th class="' + self._getGlobalDayStatus(self.options.currYear,self.options.currMonth,i) + '">' + i + '</th>';
         };

        tr = tr + '</tr>';

        tr = tr + '<tr>';

         for (i=1;i<self._getDaysInMonth(self.options.currYear,self.options.currMonth) + 1;i++) {
             tr = tr + '<th class="' + self._getGlobalDayStatus(self.options.currYear,self.options.currMonth,i) + '">' + self.options._dayNames[self._getDayOfWeek(self.options.currYear,self.options.currMonth,i)] + '</th>';
         };

        tr = tr + '</tr>' +
                  '</thead>';

      html = html + tr + self._renderTable();
      html = html + '</table>';
    return html;
  },

 _renderTable: function () {
      var self = this,
          employees = self.options.employees,
          employeDayStatus,
          currYear  = self.options.currYear,
          currMonth = self.options.currMonth,
          currDay,
          tr  = '',
          tbl = '',
          status,
          iCount = 1;


      $.each(employees,function (id,employe) {
        tr = '<tr>';
        tr = '<td>' + iCount + '</td>';
        tr = tr + '<td>' + employe.title + '</td>';
         for (i=1;i<self._getDaysInMonth(currYear,currMonth) + 1;i++) {
             currDay = i;
             status = self._getWorkStatus(id,currYear,currMonth,currDay);
             tr = tr + '<td class="workcalendar-table-td ' + self._getGlobalDayStatus(self.options.currYear,self.options.currMonth,i) + ' ' + self._getEmployeDayStatus(id,self.options.currYear,self.options.currMonth,i) + '" data-id="' + id + '" data-day="' + i + '">' + status.text + '</td>';
         };          
         tr = tr + '</tr>';
         tbl = tbl + tr;
        iCount++;
      });
   return tbl;

  },
 _getWorkStatus: function (employeeId,currYear,currMonth,currDay) {
        var self = this,
            currDateIndex = currYear + self._digitWithZero(currMonth) + self._digitWithZero(currDay),
            tA = {},
            icon='/images/128x128/info.png';

        if (self.options.employees.hasOwnProperty(employeeId) && self.options.employees[employeeId].hasOwnProperty('daysObject') && self.options.employees[employeeId].daysObject.hasOwnProperty(currDateIndex)) {
            tA = self.options.employees[employeeId].daysObject[currDateIndex];
        };

        switch (tA.type) {
            case 'move':
                if (tA.hasOwnProperty('extParams') && tA.extParams != undefined && tA.extParams.hasOwnProperty('newShift')) {
   	           return {
   	                text:tA.extParams.newShift
   	           };         
                };
            break;
            case 'info':
                if (tA.hasOwnProperty('extParams') && tA.extParams != undefined && tA.extParams.hasOwnProperty('newComment')) {

                    if (tA.extParams.hasOwnProperty('type') && self.options.typeList.hasOwnProperty(tA.extParams.type) && self.options.typeList[tA.extParams.type].hasOwnProperty('icon')) {
                        icon=self.options.typeList[tA.extParams.type].icon;
                    };

                    return {
   	                    text:'<img src="' + icon + '" onclick="alert(\'' + (tA.extParams.hasOwnProperty('type') ? ('*** ' + tA.extParams.type + ' ***') : '' ) + tA.extParams.newComment +'\')" width="30">'
   	                };
                };
            break;
        };

        return {
                text:'X'
               };         
  },
 _getGlobalDayStatus: function (currYear,currMonth,currDay) {
        var self   = this,
            result = '';

        if ($.inArray(self._getDayOfWeek(currYear,currMonth,currDay),self.options.holidayWeekDay) != -1) {
            result = result + 'workcalendar-td-holiday';
        };
        return result;         
  },
 _getEmployeDayStatus: function (employeId,currYear,currMonth,currDay) {
        var self   = this,
            result = '',
            currDateIndex = currYear + self._digitWithZero(currMonth) + self._digitWithZero(currDay),
            currDateObj ;


        if (!self.options.employees[employeId].hasOwnProperty('daysObject')) {
            return '';
        };

        if (!self.options.employees[employeId].daysObject.hasOwnProperty(currDateIndex)) {
            return '';
        };


        currDateObj =self.options.employees[employeId].daysObject[currDateIndex];

         if (!currDateObj.hasOwnProperty('type')) {
                return '';
         };

        switch (currDateObj.type) {
             case "holiday":
                   return 'workcalendar-table-td-asholiday';
              break;
              case "work":
                   return 'workcalendar-table-td-aswork';
               break;                 
               case "move":
                    return 'workcalendar-table-td-asmove';
               break;                 
               case "info":
                   return 'workcalendar-table-td-asinfo';
               break;
         };

        
        return result;
  },
 _getDayOfWeek  : function (year,month,day) {
     /*************************************
      * In standart   ISO-8601            *
      * Monday - 1                        *
      * Sun    - 7                        *
      *************************************/
      var currDate = new Date(year,month - 1,day),
           currDay = currDate.getDay() == 0 ? 7 : currDate.getDay();      
      return currDay;
  },
 _getDaysInMonth: function (year,month) {
     /**************************************
      * Get from Stackoverlow
      * https://stackoverflow.com/questions/1184334/get-number-days-in-a-specified-month-using-javascript
      **************************************/
     return new Date(year,month, 0).getDate();
  },
 _calcNewYear:function(iYear,iDiff) {
    return parseInt(iYear) + parseInt(iDiff);
 },
 _calcNewMonth:function(iYear,iMonth,iDiff) {
    var newYear = parseInt(iYear),
        newMonth = parseInt(iMonth) + parseInt(iDiff);

 

    if (newMonth > 12) {
       newMonth = 1;
       newYear = newYear + 1;
    };

    if (newMonth < 1) {
       newMonth = 12;
       newYear = newYear - 1;
    };
    return {
             year  : newYear,
             month : newMonth
           };
 },
 _digitWithZero: function (iDigit) {
      return iDigit<10 ? '0' + iDigit : '' + iDigit;
 },
 _remoteRefresh: function () {
    var self = this,
        options = self.options,
        params = {};

        $.extend(params,options.extParams,{currYear:options.currYear,currMonth:options.currMonth});

          $.postJSON(options.url,params,function (r) {
               if (r.hasOwnProperty('employees')) {
                   self.options.employees = r.employees;
                   self._initCanvas();      
               };
          });
 },
 _getWorkCalendarParams    : function (params) {
         var selected     = {},
             selectedOne  = {},
             currType     = params.type,
             self         = this,
             currYear,
             currMonth,
             params;

       el = self.element.find('.workcalendar-year-input').first();
       currYear = $(el).val();

       el = self.element.find('.workcalendar-month-input').first();
       currMonth = $(el).val();

       $.each(self.element.find('.workcalendar-selected'),function (i,el) {
           var currElement = $(el),
               currDateIndex = currYear + self._digitWithZero(currMonth) + self._digitWithZero(currElement.data('day')),
               tA = {},
               currPersonId = currElement.data('id');
                   
                   if (selected.hasOwnProperty(currPersonId)) {
                       tA[currDateIndex] = {currYear:currYear,currMonth:currMonth,currDay:currElement.data('day'),type:currType,extParams:params.extParams};
                       $.extend(selected[currPersonId].daysObject, tA);
                   }
                   else {
                     tA[currDateIndex] = {currYear:currYear,currMonth:currMonth,currDay:currElement.data('day'),type:currType,extParams:params.extParams};
                     selected[currPersonId]= {daysObject:tA};
                   };

       });

       params={selected:selected};

       $.extend(params,self.options.extParams);

       $.each(selected,function (i,s) {
           $.extend(self.options.employees[i].daysObject,s.daysObject);
       });

       if (self._trigger('_onchangedata',{},{selected:selected,type:currType})===false) {
         return;
       };



        $.postJSON(self.options.url,params,function (res) {              
               self._trigger('_onsenddata',{},{selected:selected,res:res,type:currType});
        });


      self._initCanvas();

      return selected;

 },
 _getMoveParams:function (newShift,newComment) {       
      return this._getWorkCalendarParams({
         'type':'move',
         'extParams':{newShift:newShift,newComment:newComment}
      });
 },
 _getInfoParams:function (newComment,type) {
      return this._getWorkCalendarParams({
         'type':'info',
         'extParams': {
             newComment:newComment,
             type:type
         }
      });
 },
 _createInfoListOption: function () {
     var self=this,
         r='';

     $.each(self.options.typeList,function (k,v) {
        r+='<option value="' + k + '">' + v.text + '</option>';
     });
   return r;
 }
});
})( jQuery );