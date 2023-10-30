import { Image, Text, View } from "react-native"
import { color } from "../../utils/color"
import { BOLD, REGULAR } from "../../utils/fonts"

const RideEstAndTypes=({title, subtTitle, iconType})=>{

    const getIconType=(iconType)=>{
        if(iconType === 'EstRide'){
            return  require('../../Assests/image/estprice.png')
        }else if(iconType === 'RideType'){
            return require('../../Assests/image/ridetype.png')
        }else {
           return require('../../Assests/image/ridelocation.png')
        }
    }

    return (
        <View>
            <Text style={{fontSize:12, fontFamily:REGULAR, color:'#ACACAC'}}>{title}</Text>
            <View style={{flexDirection:'row', marginTop:5}}>
                <Image style={{width:14,height:15,resizeMode:"contain"}} source={getIconType(iconType)}/>
            <Text style={{fontsize:14, fontFamily:BOLD, color:color.white, marginStart:5}}>{subtTitle}</Text>
            </View>
        </View>
    )
}
export default RideEstAndTypes