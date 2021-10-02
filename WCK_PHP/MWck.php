<?php
/**
 * Created by PhpStorm.
 * User: Маслов Дмитрий
 * Date: 30.09.20
 * Time: 9:29
 */

namespace app\models;


use app\components\SourceFactory;
use Yii;
use yii\db\ActiveRecord;
use app\components\SysClass;
use yii\web\IdentityInterface;
use yii\models;


class MWck extends MAr implements IInner {

    protected $_hours=[];


    public function rules()
    {
        return array_merge(parent::rules(),
            [
                [ [ 'comment','category','shift' ], 'trim' ],
                [['shift'],'string','length'=>[0,75]],
                [ [ 'comment','category' ], 'string', 'length' => [ 0, 1500] ],
                [ ["wholeday"],  'boolean','trueValue'=>TRUE,'falseValue'=>FALSE,'strict'=>FALSE]
            ]);
    }


    public static function tableName()
    {
        return 'wck';
    }

    public function getPublicPropertyArray() {
        return array_merge([
                'id','comment','category','begtime','endtime','wholeday','shift'
            ],
            parent::getPublicPropertyArray());
    }



    function __construct($config = [])    {
        $this->addProperty2Save('_hours');
        return parent::__construct($config);
    }

    public function beforeValidate() {

        $this->year          = mb_substr($this->currdateindex,0,4);
        $this->month         = mb_substr($this->currdateindex,4,2);
        $this->day           = mb_substr($this->currdateindex,6,2);

        return parent::beforeValidate();
    }

    public function getOwner() {
            //Уверен, что лучше не так делать, но не знаю как правильно
        switch ($this->taxon) {
            case 'wck scheduler':
                return MWck::find($this->pid);
            default:
                return MWck::find($this->pid);
        };

    }

    public function getSource() {
        return SourceFactory::create($this->stbl,$this->sid);
    }

    public function addHours($begTime,$endTime,$textInfo=null) {
        $hours=new MWck();
        $hours->setSource($this->getSource());
        $hours->setTarget($this->getTarget());
        $hours->setOwner($this->getOwner());
        $hours->taxon='wck hours';
        $hours->currdateindex=$this->currdateindex;
        $hours->begtime=$begTime;
        $hours->endtime=$endTime;
        $this->_hours[]=$hours;

        if (!is_null($textInfo)) {
            if (is_array($textInfo)) {
                if (isset($textInfo['comment'])) {
                    $hours->comment=$textInfo['comment'];
                };

                if (isset($textInfo['extInfo'])) {
                    $hours->extInfo=$textInfo['extInfo'];
                };

            };
        };

        return $this;
    }

    public function clearHours() {
        Yii::$app->db->createCommand()->delete($this->getTableName(),['pid'=>$this->getPk(),'taxon'=>'wck hours'])->execute();
        return $this;
    }
    public function setOwner($obj)
    {

        if ($obj instanceof IIdentify) {
            $this->pid=$obj->getPk();
        };


        return $this;
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
        $this->ttbl=$obj->getTableName();
        $this->tid=$obj->getPk();
        };
        return $this;
    }
    public function markAsDelete()
    {
        $this->isdelete=true;
    }

    public function unMarkAsDelete()
    {
        $this->isdelete=false;
    }

    public function isMarkAsDelete()
    {
        return false;
    }

    public function getTarget() {
        return SourceFactory::create($this->ttbl,$this->tid);
    }

    public function getHours() {
        return $this->hasMany(MWck::className(),['pid'=>'id']);
    }

}