import { Dimensions, Text, TouchableOpacity } from "react-native"
import { color } from "../../../utils/color";
import { BOLD } from "../../../utils/fonts";
import { useTranslation } from "react-i18next";

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

const IgnoreButton =()=>{
    const {t} = useTranslation();
    return <TouchableOpacity style={{width:WIDTH-50,marginTop:20, height:50, borderRadius:10, backgroundColor:color.Black_light, justifyContent:'center', borderWidth:1, borderColor:'#3E64FF'}}>
        <Text style={{fontSize:16, fontFamily:BOLD, color:color.white,alignSelf:'center'}}>{t('booking_ignore')}</Text>
    </TouchableOpacity>
}
export default IgnoreButton