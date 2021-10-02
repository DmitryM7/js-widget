<?php
/**
 * Created by PhpStorm.
 * User: dmitr
 * Date: 18.03.20
 * Time: 9:38
 */

namespace app\controllers;

use app\components\SysClass;
use Yii;
use app\components\CController;
use app\models;
use app\models\MPerson;
use app\models\IPerson;
use app\models\MScheduler;
use yii\helpers\Json;


class WckController extends CController {

    public function actionTable() {
        $params=$_POST;
        $currPerson=$this->getCurrPerson();

        $person=$currPerson;

        $scheduler=MScheduler::getBySource($person);

        return $scheduler->getToMonthJson($params['currYear'],$params['currMonth']);



        return '{"employees":{
                  "1":{
                       "title":"Иванов И.С.",
                       "daysObject":{
                         "20200310":{
                           "type":"info",
                           "text":"Некая текстовка"
                         },
                         "20200311":{
                           "type":"info",
                           "text":"Некая текстовка"
                         },
                         "20200312":{
                           "type":"holiday",
                           "text":"Некая текстовка"
                         }
                         }}
                  }}';
    }

    public function actionModify() {
        $params=$_POST;

        $currPerson=$this->getCurrPerson();

        $person=$currPerson;

        $scheduler=MScheduler::getBySource($person);

        $wck=$scheduler->getOneByPk($params['id']);

        $r=$wck->toPublicArray();

        foreach ($wck->hours as $hour) {
            $r['hours'][]=$hour->toPublicArray();
        };


        return Json::encode($r);

    }

    public function actionSave() {
        $params=$_POST;

        $params['wholeday']=Yii::$app->sysClass->toBool($params['wholeday'] ?? true);

        $currPerson=$this->getCurrPerson();

        $scheduler=MScheduler::getBySource($currPerson);

        $r=0;


        if (isset($params['days']['selected'])) {
                foreach ($params['days']['selected'] as $personId=>$personObjects) {
                    $person=MPerson::findOne($personId);

                    if (isset($params['id'])) {
                        $wck=$scheduler->getOneByPk($params['id']);
                        $wck->attributes=$params;
                        $params['hours']=$params['hours'] ?? [];
                        $wck->clearHours();
                        foreach ($params['hours'] as $hour) {
                            $wck->addHours($hour['begTime'],$hour['endTime']);
                        };
                        $wck->save();


                    } else {
                        foreach ($personObjects['daysObject'] as $currDateIndex=>$dayObject) {

                            $r=$scheduler->clearDay($currDateIndex)
                                         ->addDay($currDateIndex,
                                                  $person,
                                                  $dayObject['type'],
                                                  Yii::$app->sysClass->toBool($params['wholeday']),
                                                  $params['hours'] ?? [],
                                                  [
                                                      'comment'=>$dayObject['extParams']['newComment'],
                                                      'category'=>$params['category'] ?? null
                                                  ])
                                         ->save();

                        };
                    };

        };

        return $r;

    }

  }

    public function actionClear() {
        $params=$_POST;
        $currPerson=$this->getCurrPerson();
        $scheduler=MScheduler::getBySource($currPerson);

        if (isset($params['days']['selected'])) {
            foreach ($params['days']['selected'] as $personId=>$personObjects) {
                foreach ($personObjects['daysObject'] as $currDateIndex=>$dayObject) {
                    $r=$scheduler->clearDay($currDateIndex);
                };
            };
        };
        return '__GOOD__';
    }
}