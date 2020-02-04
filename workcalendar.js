(function ($, undefined) {
$.widget("o.workcalendar",{
   options: {
      currYear:null,
      currMonth:null,
      url:null,
      extParams:{},
      employees:{},
      enableTools:true,
      _defIcon:'/images/128x128/info.png',
      holidayWeekDay: [6, 7],
      shiftList: [
          {
             value:'0',
             option:'0-ая (00:00 - 09:00)'
          },
          {
              value:'1',
              option:'1-ая (01:00 - 10:00)'
          },
          {
              value:'2',
              option:'2-ая (02:00 - 11:00)'
          },
          {
              value:'3',
              option:'3-ая (03:00 - 12:00)'
          },
          {
              value:'4',
              option:'4-ая (04:00 - 03:00)'
          },
          {
              value:'5',
              option:'5-ая (05:00 - 14:00)'
          },
          {
              value:'6',
              option:'6-ая (06:00 - 15:00)'
          },
          {
              value:'7',
              option:'7-ая (07:00 - 16:00)'
          },
          {
              value:'8',
              option:'8-ая (08:00 - 17:00)'
          },
          {
              value:'9',
              option:'9-ая (09:00 - 18:00)'
          },
          {
              value:'10',
              option:'10-ая (10:00 - 19:00)'
          },
          {
              value:'11',
              option:'11-ая (11:00 - 20:00)'
          },
          {
              value:'12',
              option:'12-ая (12:00 - 21:00)'
          },
          {
              value:'13',
              option:'13-ая (13:00 - 22:00)'
          },
          {
              value:'14',
              option:'14-ая (14:00 - 23:00)'
          },
          {
              value:'15',
              option:'15-ая (15:00 - 24:00)'
          },
          {
              value:'16',
              option:'16-ая (16:00 - 01:00)'
          },
          {
              value:'17',
              option:'17-ая (17:00 - 02:00)'
          },
          {
              value:'18',
              option:'18-ая (18:00 - 03:00)'
          },
          {
              value:'19',
              option:'19-ая (19:00 - 04:00)'
          },
          {
              value:'20',
              option:'20-ая (20:00 - 05:00)'
          },
          {
              value:'21',
              option:'21-ая (21:00 - 06:00)'
          },
          {
              value:'22',
              option:'22-ая (22:00 - 07:00)'
          },
          {
              value:'23',
              option:'23-ая (23:00 - 08:00)'
          },
          {
              value:'24',
              option:'24-ая (24:00 - 09:00)'
          }
      ],
      typeList:{
          'info':{
              'text':'Информация',
              'icon':'/images/128x128/info.png'
          },
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
      },
      labels: {
           buttons : {
               aswork:'Рабоч.',
               asholiday:'Выход.',
               asmove:'Смещ.',
               asinfo:'Инфо'
           },
           dialogs : {
               holiday:{
                title:'Выходной день',
                   comment:'Комментарий'
               },
               work:{
                   title:'Рабочий день',
                   comment:'Комментарий'
              },
               info:{
                   title:'Информация',
                   'type':'Тип:'
               },
               move:{
                   title:'Режим работы',
                   comment:'Комменатрий',
                   shift:'Смена'
               }
           }
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
                         options.enableTools ? '<td><input type="button" value="' + options.labels.buttons.aswork + '" class="workcalendar-button-aswork"></td>'    +
                                               '<td><input type="button" value="' + options.labels.buttons.asholiday + '" class="workcalendar-button-asholiday"></td>' +
                                               '<td><input type="button" value="' + options.labels.buttons.asmove + '" class="workcalendar-button-asmove"></td>'    +
                                               '<td><input type="button" value="' + options.labels.buttons.asinfo + '" class="workcalendar-button-asinfo"></td>' : '') +
                         '  </tr>'   +
                         ' </tbody>' +
                         '</table>',
            moveDialog= '<div class="workcalendar-moveDialog" title="' + options.labels.dialogs.move.title +'">'    +
                '<dl>'                                                                                                     +
                '<dt><label>' + options.labels.dialogs.move.shift + '</label></dt>'                                        +
                '<dd>'                                                                                                     +
                '<select class="workcalendar-select-shift">'                                                               +
                    self._createShiftOption()                                                                              +
                '</select>'                                                                                                +
                '</dd>'                                                                                                    +
                '<dt><label>' + options.labels.dialogs.move.comment + '</label><dt>'                                       +
                '<dd><textarea class="workcalendar-moveDialog-comment"></textarea></dd>'                                   +
                '</dl>'                                                                                                    +
                '</div>',
            infoDialog = '<div class="workcalendar-infoDialog" title="' + options.labels.dialogs.info.title +'">'   +
                              '<dl>'                                                                                       +
                                    '<dt><label>' + options.labels.dialogs.info.type +'</label></dt>'                      +
                                    '<dd>'                                                                                 +
                                    '<select class="workcalendar-infoDialog-infotype">'                                    +
                                         self._createInfoListOption()                                                      +
                                    '</select>'                                                                            +
                                    '</dd>'                                                                                +
                                    '<dd><textarea class="workcalendar-infoDialog-comment"></textarea></dd>'               +
                               '</dl>'                                                                                     +
                          '</div>',
            holidayDialog = '<div class="workcalendar-holidayDialog" title="' + options.labels.dialogs.holiday.title + '">' +
                                '<dl>' +
                                    '<dt><label>' + options.labels.dialogs.holiday.comment + '</label></dt>' +
                                    '<dd><textarea class="workcalendar-holidayDialog-comment"></textarea></dd>' +
                                    self._createHours() +
                                '</div>',
            workDialog = '<div class="workcalendar-workDialog" title="' + options.labels.dialogs.work.title + '">' +
                '<dl>' +
                '<dt><label>' + options.labels.dialogs.work.comment + '</label></dt>' +
                '<dd><textarea class="workcalendar-workDialog-comment"></textarea></dd>' +
                self._createHours() +
                '</div>',
           workDialogElement,
           holidayDialogElement,
           moveDialogElement,
           infoDialogElement,
           workFlow = self._renderCalendar();

            self.element.html('<div class="workcalendar-canvas">' + htmlHeader + workFlow + workDialog + holidayDialog + moveDialog + infoDialog + '</div>');


 /*****************************************
  * Диалоги                               *
  *****************************************/

workDialogElement = self.element.find('.workcalendar-workDialog').first();
workDialogElement.frm({
           autoOpen:false,
           width: '550px',
           showButtons: ['save'],
           _beforesave:function (e,ev) {
               var moveComment = $(this).find('.workcalendar-workDialog-comment').val(),
                   currType='aswork';

                  if (ev.action=='save') {
                    var selected=self._getWorkCalendarParams({
                       'type':currType,
                       'extParams': {
                           newComment:moveComment
                       }
                   });

                   $.postJSON(self.options.url,selected,function (res) {
                       self._trigger('_onsenddata',{},{selected:selected,res:res,type:currType});
                       ev.parent.close();
                   });

               };

               return false;
           }
       });

holidayDialogElement = self.element.find('.workcalendar-holidayDialog').first();
holidayDialogElement.frm({
           autoOpen:false,
           width: '550px',
           showButtons: ['save'],
           _beforesave:function (e,ev) {
               var holidayComment = $(this).find('.workcalendar-holidayDialog-comment').val(),
                   currType='asholiday';

               if (ev.action=='save') {
                   var selected=self._getWorkCalendarParams({
                       'type':currType,
                       'extParams': {
                           holidayComment:holidayComment
                       }
                   });

                   $.postJSON(self.options.url,selected,function (res) {
                       self._trigger('_onsenddata',{},{selected:selected,res:res,type:currType});
                       ev.parent.close();
                   });
               };
              return false;
           }
       });


moveDialogElement = self.element.find('.workcalendar-moveDialog').first();
moveDialogElement.frm({
                           autoOpen:false,
			               width: '550px',
                           showButtons: ['save'],
	        _beforesave:function (e,ev) {
                    var newShift    = $(this).find('.workcalendar-select-shift').first().val(),
                        newComment = $(this).find('.workcalendar-moveDialog-comment').val(),
                        currType='move';

                        if (ev.action=='save') {

                            var selected=self._getWorkCalendarParams({
                                'type':currType,
                                'extParams':{newShift:newShift,newComment:newComment}
                            });


                            $.postJSON(self.options.url,selected,function (res) {
                                self._trigger('_onsenddata',{},{selected:selected,res:res,type:currType});
                                ev.parent.close();
                            });
                        };

                        return false;
                  }
        });

infoDialogElement = self.element.find('.workcalendar-infoDialog').first();
infoDialogElement.frm({
                           autoOpen:false,
			               width: '550px',
                           showButtons: ['save'],
                          _beforesave:function (e,ev) {
                                var infoComment = $(this).find('.workcalendar-infoDialog-comment').val(),
                                    type        = $(this).find('.workcalendar-infoDialog-infotype').val(),
                                    currType='info';

                                   if (ev.action=='save') {
                                       var selected=self._getWorkCalendarParams({
                                           'type':currType,
                                           'extParams': {
                                               newComment:infoComment,
                                               type:type
                                           }
                                       });
                                       $.postJSON(self.options.url,selected,function (res) {
                                           self._trigger('_onsenddata',{},{selected:selected,res:res,type:currType});
                                           ev.parent.close();
                                       });
                                   };

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

        self.element.find('.workcalendar-button-aswork').first().click(function (e) {
            workDialogElement.frm('open');
            return;
        });

        self.element.find('.workcalendar-button-asholiday').first().click(function (e) {
            holidayDialogElement.frm('open');
            return;
        });

       self.element.find('.workcalendar-button-asmove').first().click(function(e){
           moveDialogElement.frm('open');
           return;
       });

       self.element.find('.workcalendar-button-asinfo').first().click(function(e){
           infoDialogElement.frm('open');
           return;
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
          iCount = 1,
          eventTd=null;


      $.each(employees,function (id,employe) {
        tr = '<tr data-id="' + id + '">';
        tr = '<td>' + iCount + '</td>';
        tr = tr + '<td>' + employe.title + '</td>';
         for (i=1;i<self._getDaysInMonth(currYear,currMonth) + 1;i++) {
             currDay = i;
             status = self._getWorkStatus(id,currYear,currMonth,currDay);

             eventTd=self._trigger('_onrederday',{},{currYear:currYear,currMonth:currMonth,currDay:currDay,employeId:id,employe:employe});


             if (eventTd===false) {
                 continue;
             };

             tr = tr + (eventTd==null || eventTd ? '<td class="workcalendar-table-td ' +
                                                               self._getGlobalDayStatus(self.options.currYear,self.options.currMonth,i) +
                                                               ' ' +
                                                              self._getEmployeDayStatus(id,self.options.currYear,self.options.currMonth,i) + '"' +
                                                              ' data-id="' + id + '" data-day="' + i + '">' + status.text + '</td>' : eventTd);
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
            tA={},
            r = {
                employeDayStatus:'workcalendar-table-td-common',
                text:'X'
            },
            icon;

        if (self.options.employees.hasOwnProperty(employeeId) && self.options.employees[employeeId].hasOwnProperty('daysObject') && self.options.employees[employeeId].daysObject.hasOwnProperty(currDateIndex)) {
            tA = self.options.employees[employeeId].daysObject[currDateIndex];
        };

        //Нет никакой информациии о ячейке
        if (!tA.hasOwnProperty('type')) {
             return r;
        };

        switch (tA.type) {
             case "holiday":
                 r.employeDayStatus='workcalendar-table-td-asholiday';
                 break;
             case "work":
                r.employeDayStatus='workcalendar-table-td-aswork';
                break;
             case "move":
                r.employeDayStatus='workcalendar-table-td-asmove';
                 if (tA.hasOwnProperty('extParams') && tA.extParams != undefined && tA.extParams.hasOwnProperty('newShift')) {
                     r.text=tA.extParams.newShift;
                 };
                 break;
             case "info":
                 r.employeDayStatus='workcalendar-table-td-asinfo';
                 if (tA.hasOwnProperty('extParams') && tA.extParams != undefined) {
                     if (tA.extParams.hasOwnProperty('type') && self.options.typeList.hasOwnProperty(tA.extParams.type) && self.options.typeList[tA.extParams.type].hasOwnProperty('icon')) {
                         icon=self.options.typeList.hasOwnProperty(tA.extParams.type) ? self.options.typeList[tA.extParams.type].icon : self.options._defIcon;
                         r.text='<img src="' + icon + '"  class="workcalendar-table-td-icon">'

                     };

                 };
                break;
      };

     return r;
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


     if (options.hasOwnProperty('url') && options.url != null) {

          $.postJSON(options.url,params,function (r) {
               if (r.hasOwnProperty('employees')) {
                   self.options.employees = r.employees;
                   self._initCanvas();      
               };
          });
     } else {
         self._initCanvas();
     };
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
         return false;
       };

      return params;
 },
 _createShiftOption: function () {
     var self=this,
         r='';
     $.each(self.options.shiftList,function (k,v) {
         r += '<option value="' + v.value + '">' + v.option + '</option>';
     });
     return r;
 },
 _createShiftOption: function () {
     var self=this,
         r='';
     $.each(self.options.shiftList,function (k,v) {
         r += '<option value="' + v.value + '">' + v.option + '</option>';
     });
     return r;
 },
 _createInfoListOption: function () {
     var self=this,
         r='';

     $.each(self.options.typeList,function (k,v) {
        r += '<option value="' + k + '">' + v.text + '</option>';
     });
   return r;
 },
 _createHours:function () {
     return '';
 },
 _getCellPersonId:function (currElement) {
     return currElement.parent().data('id');
 }
});
})( jQuery );