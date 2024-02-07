import mongoose from "mongoose";
import app from "./app";
import config from "./config/index";

(async() => {
    try {
        await mongoose.connect(config.MONGODB_URL)
            console.log("DB Connected");

            app.on('error', (err) => {
                console.log(err);
                throw err
            })    
            
            app.listen(config.PORT, () => {
                console.log(`Listening on Port ${config.PORT}`);

            })
        
    } catch (err) {
        console.log(err)
        throw err
    }
})()