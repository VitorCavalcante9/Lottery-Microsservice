import { Kafka, Consumer as KafkaConsumer } from 'kafkajs';
import { resolve } from 'path';
import SendMailService from '../services/SendMailService';

interface IConsumeProps {
  topic: string;
  fromBeginning: boolean;
}

export default class Consumer {
  private consumer: KafkaConsumer;

  constructor(groupId: string) {
    const kafka = new Kafka({
      brokers: ['kafka:29092'],
    });

    this.consumer = kafka.consumer({ groupId });
  }

  public async consume({ topic, fromBeginning }: IConsumeProps): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic, fromBeginning });

    console.log('Iniciando busca...');

    const betsPath = resolve(
      __dirname,
      '..',
      'views',
      'emails',
      'betsMail.hbs'
    );

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const data = JSON.parse(message.value?.toString()!);
        console.log(JSON.parse(data));
        const variables = {
          bets: data.bets,
          name: data.name,
        };
        await SendMailService.execute(
          data.emails.join(', '),
          'Novas apostas realizadas',
          variables,
          betsPath
        );
      },
    });
  }
}
