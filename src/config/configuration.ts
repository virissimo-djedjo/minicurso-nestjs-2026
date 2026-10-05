export default () => ({
  app: {
    port: parseInt(process.env.PORT ?? '3030', 10),
    host: process.env.HOST ?? '0.0.0.0',
  },
  db: {
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  storage: {
    provider: process.env.STORAGE_PROVIDER ?? 'local',
    s3: {
      endpoint: process.env.S3_ENDPOINT,
      bucket: process.env.S3_BUCKET,
      accessKeyId: process.env.STORAGE_ROOT_USER,
      secretAccessKey: process.env.STORAGE_ROOT_PASSWORD,
    },
  },
});
