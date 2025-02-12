import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  DeleteObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
// import { UserEntity } from './user.entity';

@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;
  private readonly bucketName = process.env.AWS_BUCKET_NAME;

  constructor() {
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

      const upload = new Upload({
        client: this.s3Client,
        params: params,
      });

      const data = await upload.done();
      Logger.log(`GET RESPONSE FROM AWS: ${data}`);
      return {
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
        key: fileKey,
      };
    } catch (error) {
      Logger.error('Помилка завантаження файлу:', error);
      throw error;
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
      Logger.warn(`DELETE FILE ERROR: ${error}`);
      throw new InternalServerErrorException('Не вдалося видалити файл');
    }
  }

  async deleteFileByUrl(fileUrl: string): Promise<string> {
    try {
      const fileKey = this.extractFileKeyFromUrl(fileUrl);
      if (!fileKey) {
        throw new InternalServerErrorException('Invalid file URL');
      }

      return await this.deleteFile(fileKey);
    } catch (error) {
      Logger.warn(`DELETE FILE BY URL ERROR: ${error}`);
      throw new InternalServerErrorException('Не вдалося видалити файл за URL');
    }
  }

  private extractFileKeyFromUrl(fileUrl: string): string | null {
    try {
      const url = new URL(fileUrl);
      const pathname = url.pathname;
      const fileKey = pathname.substring(1);
      return fileKey;
    } catch (error) {
      Logger.warn(`URL parsing error: ${error}`);
      return null;
    }
  }
}
