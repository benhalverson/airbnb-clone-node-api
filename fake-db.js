const Rental = require('./models/rental');

class FakeDB {
  constructor() {
    this.rentals = [{
        title: 'title 1',
        city: 'Santa Clara',
        street: 'Main stree',
        category: 'apartment',
        image: 'localhost:4200/lol.png',
        bedrooms: 2,
        description: 'lorem text',
        dailyRate: 50
      },
      {
        title: 'title 2',
        city: 'San Francisco',
        street: 'Main street',
        category: 'condo',
        image: 'localhost:4200/lol.png',
        bedrooms: 2,
        description: 'lorem text',
        dailyRate: 90
      },
      {
        title: 'title 3',
        city: 'San Jose',
        street: '1st Street',
        category: 'House',
        image: 'localhost:4200/lol.png',
        bedrooms: 2,
        description: 'lorem text',
        dailyRate: 60
      }
    ]
  }

  pushRentalsToDB() {
    this.rentals.forEach((rental) => {
      const newRental = new Rental(rental);

      newRental.save();
    });
  }

  async cleanDB() {
   await Rental.remove({});
  }

  seedDB() {
    this.cleanDB();
    this.pushRentalsToDB();
    }
  }

module.exports = FakeDB;
