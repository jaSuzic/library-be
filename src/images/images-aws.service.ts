import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk'

@Injectable()
export class UploadImageAwsService {

    async upload(file) {
        const { originalname } = file;
        const newFileName = Date.now() + '_' + originalname

        const bucketS3 = process.env.AWS_BUCKET;
        return this.uploadS3(file.buffer, bucketS3, newFileName);
    }

    uploadS3(file, bucket, name) {
        const s3 = this.getS3();
        const params = {
            Bucket: bucket,
            Key: String(name),
            Body: file
        }
        return new Promise((res, rej) => {
            s3.upload(params, (err, data) => {
                if (err) {
                    console.log("There was error with uploading file to s3: ", err)
                    rej(err.message)
                }
                res(data);
            })
        })
    }

    getS3() {
        return new S3({
            accessKeyId: process.env.AWS_MY_ACCESS_KEY,
            secretAccessKey: process.env.AWS_MY_SECRET_KEY
        })
    }

    removeImage(fileName: string) {
        const s3 = this.getS3();
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: fileName
        }
        return new Promise((res, rej) => {
            s3.deleteObject(params, (err, data) => {
                if (err) {
                    console.log("There was error with uploading file to s3: ", err)
                    rej(err.message)
                }
                res(data);
            })
        })
    }
}
