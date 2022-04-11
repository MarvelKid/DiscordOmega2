import mongoose from 'mongoose';

interface mongooseConnectionOptions {
  useNewUrlParser: boolean;
  autoIndex: boolean;
  connectTimeoutMS: number;
  family: number;
  useUnifiedTopology: boolean;
}

const options = <mongooseConnectionOptions>{
  useNewUrlParser: true,
  autoIndex: false,
  connectTimeoutMS: 10000,
  family: 4,
  useUnifiedTopology: true,
};

class MongoDB {
  public constructor(
    private readonly connectionURL: string,
    private readonly connectionOptions: mongooseConnectionOptions = options
  ) {
    /** @private */ this.connectionURL = connectionURL;
    /** @private */ this.connectionOptions = connectionOptions;
  }

  public init(): void {
    try {
      mongoose.connect(this.connectionURL, this.connectionOptions);
    } catch (error) {
      console.error(error);
    }

    mongoose.Promise = global.Promise;

    mongoose.connection.on('connected', () => console.log('MongoDB has connected.'));
  }

  public async ping(): Promise<number> {
    const currentNano = process.hrtime();

    await mongoose.connection.db.command({ ping: 1 });

    const time = process.hrtime(currentNano);

    return (time[0] * 1e9 + time[1]) * 1e-6;
  }
}

export default MongoDB;
