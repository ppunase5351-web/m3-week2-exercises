const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

var stats = [
    {
        'city': 'San Juan',
        'zip': '00926',
        'state': 'PR',
        'income': '34781',
        'age': '44'
    },
    {
        'city': 'Corona',
        'zip': '11368',
        'state': 'NY',
        'income': '50797',
        'age': '32'
    },
    {
        'city': 'Chicago',
        'zip': '60629',
        'state': 'IL',
        'income': '42019',
        'age': '31'
    },
    {
        'city': 'El Paso',
        'zip': '79936',
        'state': 'TX',
        'income': '54692',
        'age': '31'
    },
    {
        'city': 'Los Angeles',
        'zip': '90011',
        'state': 'CA',
        'income': '36954',
        'age': '28'
    },
    {
        'city': 'Norwalk',
        'zip': '90650',
        'state': 'CA',
        'income': '66453',
        'age': '35'
    }
];

const tasks = {
  // 1. Create the database
  1: async () => {
    client.db('statsdb');
    console.log('Database statsdb created!');
  },

  // 2. Create the collection
  2: async () => {
    const db = client.db('statsdb');
    await db.createCollection('uscensus');
    console.log('Collection uscensus created!');
  },

  // 3. Add the given data
  3: async () => {
    const col = client.db('statsdb').collection('uscensus');
    const result = await col.insertMany(stats.map(s => ({ ...s })));
    console.log(`${result.insertedCount} records inserted into uscensus!`);
  },

  // 4. Add the two new records
  4: async () => {
    const col = client.db('statsdb').collection('uscensus');
    const newRecords = [
      { city: 'Pacoima',   zip: '91331', state: 'CA', income: '60360', age: '33' },
      { city: 'Ketchikan', zip: '99950', state: 'AK', income: '00000', age: '00' }
    ];
    const result = await col.insertMany(newRecords);
    console.log(`${result.insertedCount} new records inserted!`);
  },

  // 5. Zip code for Corona, NY
  5: async () => {
    const col = client.db('statsdb').collection('uscensus');
    const doc = await col.findOne({ city: 'Corona', state: 'NY' });
    console.log(`The zip code for Corona, NY is ${doc.zip}`);
  },

  // 6. Income for all cities in California
  6: async () => {
    const col = client.db('statsdb').collection('uscensus');
    const docs = await col.find({ state: 'CA' }).toArray();
    console.log('Income for all cities in California:');
    docs.forEach(d => console.log(`${d.city}: ${d.income}`));
  },

  // 7. Update Alaska's income and age
  7: async () => {
    const col = client.db('statsdb').collection('uscensus');
    const result = await col.updateOne(
      { state: 'AK' },
      { $set: { income: '38910', age: '46' } }
    );
    console.log(`${result.modifiedCount} record updated: Alaska income is now 38910 and age is 46`);
  },

  // 8. Sort ascending by state
  8: async () => {
    const col = client.db('statsdb').collection('uscensus');
    const docs = await col.find().sort({ state: 1 }).toArray();   // 1 = ascending, -1 = descending
    console.log('Records sorted in ascending order by state:');
    docs.forEach(d => console.log(d));
  },

  // Extra: delete the database so you can start over
  reset: async () => {
    await client.db('statsdb').dropDatabase();
    console.log('Database statsdb deleted');
  }
};

async function main() {
  const choice = process.argv[2];
  if (!tasks[choice]) {
    console.log('Usage: node app.js <task number 1-8>   (or: node app.js reset)');
    return;
  }
  try {
    await client.connect();
    await tasks[choice]();
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.close();
  }
}

main();