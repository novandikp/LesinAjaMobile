import { setLocalStorage, getLocalStorage, removeLocalStorage } from './localStorage';
import OneSignal from "react-native-onesignal";

// class Onesignalmanager
export default class NotificationManager {
    private readonly id:string ="1fa1745c-7727-40cb-b10e-1a3ae71da5cc"
    private static _instance: NotificationManager;
    private readonly tags:string ="tags"
    constructor() {
        OneSignal.setLogLevel(LogNotification.NONE,LogNotification.NONE)
        OneSignal.setAppId(this.id)
        OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
            let notification = notificationReceivedEvent.getNotification();
            const data = notification.additionalData
            notificationReceivedEvent.complete(notification);
        });
        OneSignal.setNotificationOpenedHandler(notification => {
            
        });
    }

    // Sigleton
    static getInstance():NotificationManager{
        if(!NotificationManager._instance){
            NotificationManager._instance = new this();
        }
        return NotificationManager._instance;
    }


    setTags(kelamin:any , idkecamatan:any){
        const data = {
            kelamin: kelamin,
            idkecamatan: idkecamatan
        }
        OneSignal.deleteTags(["kelamin","idkecamatan"])
        OneSignal.sendTags(data)
        setLocalStorage(this.tags,JSON.stringify(data))
    }

    destroyTags(){
        OneSignal.deleteTags(["kelamin","idkecamatan"])
        removeLocalStorage(this.tags)
    }


    async getTags(){
        return await getLocalStorage(this.tags)
    }


}

enum LogNotification {
    NONE,
    FATAL,
    ERROR,
    WARN,
    INFO,
    VERBOSE
}