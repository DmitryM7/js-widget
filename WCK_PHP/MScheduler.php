<?php
/**
 * Created by PhpStorm.
 * User: Маслов Дмитрий
 * Date: 13.10.20
 * Time: 9:37
 */

namespace app\models;

use yii;
use app\models\MWck;
use yii\base\ErrorException;
use app\components\SourceFactory;
use yii\helpers\Json;

class MScheduler extends MAr implements IInner {

    const AS_HOLIDAY  = 'WCK_AS_HOLIDAY',
          AS_WORK     = 'WCK_AS_WORK',
          DAY_TAXON   = 'wck day',
          HOURS_TAXON = 'wck hours';



    protected $_days=[];

    public static function tableName()
    {
        return 'wck';
    }

    function __construct($config = [])    {
        $this->addProperty2Save('_days');
        return parent::__construct($config);
    }

    public function beforeValidate() {
        if (is_null($this->taxon)) {
            $this->taxon='wck scheduler';
        };

        return parent::beforeValidate();
    }

    public function clearDay($currDateIndex) {

            $wckDay=MWck::findOne([
                                   'pid'=>$this->getPk(),
                                   'currdateindex'=>$currDateIndex,
                                   'taxon'=>'wck day'
            ]);

            if ($wckDay instanceof IAr) {
                Yii::$app->db->createCommand()->delete($wckDay->getTableName(),['pid'=>$wckDay->getPk()])->execute();
                $wckDay->delete();
            };

            return $this;

    }

    public function addDay($currDateIndex,
                           $target,
                           $type,
                           $wholeDay,
                           $hoursArr,
                           $textInfo=null) {
        $wck=new MWck();
        $wck->taxon=static::DAY_TAXON;
        $wck->setSource($this->getSource());
        $wck->setOwner($this->getOwner());
        $wck->setTarget($target);

        $wck->currdateindex = $currDateIndex;
        $wck->type=$type;
        $wck->wholeday=$wholeDay;

        foreach ($hoursArr as $hours) {;
            $wck->addHours($hours['begTime'],$hours['endTime']);
        };

        $this->_days[]=$wck;


        if (!is_null($textInfo)) {
            if (is_array($textInfo)) {

                if (isset($textInfo['comment'])) {
                    $wck->comment=$textInfo['comment'];
                };

                if (isset($textInfo['extInfo'])) {
                    $wck->extInfo=$textInfo['extInfo'];
                };


                if (isset($textInfo['category'])) {
                    $wck->category=$textInfo['category'];
                }
            };
        };

        return $this;

    }

    public static function getBySource($source) {
        $scheduler=MScheduler::findOne([
            'stbl'  => $source->getTableName(),
            'sid'   => $source->getPk(),
            'taxon' => 'wck scheduler'
        ]);

        if (!$scheduler instanceof IAr) {
            $scheduler=new MScheduler();
            $scheduler->setSource($source);
            $scheduler->setOwner($source);
            $scheduler->save();
        };

        return $scheduler;
    }

    public function getToMonth($year,$month) {
            $wck=MWck::find()->where([
                'stbl'=>$this->stbl,
                'sid'=>$this->sid,
                'taxon'=>static::DAY_TAXON,
            ])
                ->andWhere(['like','currdateindex',"{$year}{$month}%",false])
                ->all();

        return $wck;
    }

    public function getToMonthJson($year,$month) {
        $wcks=$this->getToMonth($year,$month);

        $r=new \StdClass();

        $p=[];

        foreach ($wcks as $wck) {

                if ($this->beforeGetTarget($wck)===false) {
                    continue;
                };

                $person=$wck->getTarget();
                if (!$person instanceof IPerson) {
                    throw new yii\base\Exception('Invalid interface of parent work class');
                };

                $personId=$person->getPk();
                $p[$personId]=new \StdClass();
                $p[$personId]->title=$person->getFullName();
                $p[$personId]->daysObject=new \StdClass();

            $currdateindex=$wck->currdateindex;
            $p[$personId]->daysObject->$currdateindex=new \StdClass();
            $p[$personId]->daysObject->$currdateindex->type=$wck->type;
            $p[$personId]->daysObject->$currdateindex->text=$wck->comment;
            $p[$personId]->daysObject->$currdateindex->category=$wck->category;
            $p[$personId]->daysObject->$currdateindex->shift=$wck->shift;
            $p[$personId]->daysObject->$currdateindex->id=$wck->getPk();
            $p[$personId]->daysObject->$currdateindex->wholeday=$wck->wholeday;

        };

        if (count($p)>0) {
            $r->employees=$p;
        };

        return Json::encode($r);
    }

    public function getOneByPk($pk) {
    $wck=MWck::findOne($pk);
    return $wck;
}

    protected function resolveFields(array $fields, array $expand)
    {
    }

    public function setSource($obj)
    {

        if ($obj instanceof IIdentify) {
            $this->stbl = $obj->getTableName();
            $this->sid  = $obj->getPk();
        };

        return $this;
    }

    public function setTarget($obj) {
        if ($obj instanceof IIdentify) {

            if ($obj instanceof IIdentify) {
                $this->ttbl = $obj->getTableName();
                $this->tid  = $obj->getPk();
            };

            return $this;
        }
    }

    public function setOwner($obj)
    {
        $this->pid=$obj->getPk();
    }

    public function getOwner()
    {
        return $this->pid;
    }

    public function markAsDelete()
    {
        // TODO: Implement markAsDelete() method.
    }

    public function isMarkAsDelete()
    {
        return false;
        // TODO: Implement isMarkAsDelete() method.
    }

    public function unMarkAsDelete() {

    }

    public function getSource() {
        return SourceFactory::create($this->stbl,$this->sid);
    }

    public function getTarget() {
        return SourceFactory::create($this->ttbl,$this->tid);
    }

    public function beforeGetTarget() {
        return true;
    }
}