import 'dotenv/config';
import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';

const generators = {
  User: {
    _qty: 10,
    email: faker.internet.email,
    password: () =>
      bcrypt.hashSync('password', process.env.HASH_SECRET || 'key'),
    fullName: faker.person.fullName,
    role: 'USER',
  },
};

// Get Prisma models list with metadata
const queue = [...Prisma.dmmf.datamodel.models];

const generateSeeds = async () => {
  queue.forEach((model) => {
    // take current model generators
    const modelGenerators = generators[
      model.name as keyof typeof generators
    ] as any;

    const seeds = [];

    if (!modelGenerators) return;

    // Finally generate seeds for particular model
    for (let i = 0; i < modelGenerators._qty; i++) {
      const seed = model.fields.reduce((seedData, field) => {
        const generator = modelGenerators[
          field.name as keyof typeof modelGenerators
          // eslint-disable-next-line @typescript-eslint/ban-types
        ] as string | Function | undefined;

        if (typeof generator === 'function') {
          return {
            ...seedData,
            [field.name]: generator(),
          };
        }

        if (typeof generator === 'string') {
          return {
            ...seedData,
            [field.name]: { type: generator },
          };
        }

        return seedData;
      }, {});

      seeds.push(seed);
    }

    // Format and write to json file.
    const json = JSON.stringify(seeds, null, 2);
    fs.writeFile(`${__dirname}/data/${model.name}.json`, json, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
};

generateSeeds()
  .then(() => {
    console.log('Generated new seed data to prisma/seeds/data directory');
  })
  .catch((err) => {
    console.log(err);
  });
