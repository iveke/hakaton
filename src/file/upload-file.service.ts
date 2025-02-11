import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
// import { UserEntity } from './user.entity';

@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;
  private readonly bucketName = process.env.AWS_BUCKET_NAME;

  constructor(
  ) {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<{ url: string; key: string }> {
    try {
      const fileKey = `${uuidv4()}-${file.originalname}`;
      const params = {
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      await this.s3Client.send(new PutObjectCommand(params));

      return {
        url: `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
        key: fileKey,
      };
    } catch (error) {
      Logger.warn(`UPLOAD FILE ERROR: ${error}`)
      throw new InternalServerErrorException('Не вдалося завантажити файл');
    }
  }

  async deleteFile(fileKey: string): Promise<string> {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: fileKey,
      };

      await this.s3Client.send(new DeleteObjectCommand(params));

      return 'Файл успішно видалено';
    } catch (error) {
      Logger.warn(`DELETE FILE ERROR: ${error}`)
      throw new InternalServerErrorException('Не вдалося видалити файл');
    }
  }
}
