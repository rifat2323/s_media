import {connect} from "mongoose";



//trMGVIRa05rGkI7j
 const connecDb = async () => {
    try{
         await connect(process.env.monogDb_Url as string ,{autoIndex:true})
     /*     mongoose.set('debug', true); */

    }catch(error){
        console.log(error)
    }
 }


export default connecDb