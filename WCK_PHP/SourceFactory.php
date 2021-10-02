<?php
/**
 * Created by PhpStorm.
 * User: Маслов Дмитрий
 * Date: 23.10.20
 * Time: 22:51
 */

namespace app\components;


use app\models\MPerson;
use yii\base\Component;

class SourceFactory extends Component {
    public static function create($stbl,$sid) {
        switch ($stbl) {
            case "person":
                return MPerson::findOne($sid);
            case "wck":
                return MWck::findOne($sid);
        };
    }
} 