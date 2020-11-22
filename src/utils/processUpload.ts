import { createWriteStream } from 'fs';
import path from 'path';
type ImageFiles = {
    mimetype: string;
    filename: string;
    encoding: number;
    location: string;
}
export const processUpload = async (file: any): Promise<ImageFiles> =>{
    const {createReadStream, mimetype, encoding, filename} = await file;
    const pathname = path.join(__dirname, '..', 'public', filename);
    let stream = createReadStream();
    return new Promise((resolve,reject)=>{
        return stream
                .pipe(createWriteStream(pathname))
                .on("finish", () =>{

                    return resolve({mimetype, filename, encoding, location: '/public/'+filename})
                })
                .on("error", () =>{
                    console.log("Error Event Emitted")
                    return reject({
                        success: false,
                        message: "Failed"
                    })
                })
    })
}