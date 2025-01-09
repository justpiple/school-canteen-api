# School Canteen Ordering System (API)

## Overview

The School Canteen Ordering System is a web application designed to facilitate the management of school canteens. It allows administrators, stand owners, and students to interact with the system efficiently. The application provides features for managing users, stands, menus, orders, and statistics.

## Features

- User authentication and role management (Students, Stand Admins, Super Admins)
- Stand management (create, update, delete stands)
- Menu management (add, update, delete menu items)
- Order management (place, view, and manage orders)
- Statistics for stand owners (monthly income, total orders, top-selling menus)

## Technologies Used

- **Backend**: Node.js, NestJS
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger

## Installation

### Prerequisites

- Node.js (version 20 or higher)
- MySQL (version 5.7 or higher)

### Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/justpiple/school-canteen-api.git
   cd school-canteen-api
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up the database**:

   ```bash
   cp env.example .env
   ```

- Create a MySQL database for the project.
- Update the `.env` file with your database connection string and other necessary environment variables

4. **Run Prisma migrations**:

   ```bash
   npx prisma migrate dev
   ```

5. **Start the application**:

   ```bash
   npm run start:dev
   ```

## Usage

- The application runs on `http://localhost:3000`.
- You can access the API documentation at `http://localhost:3000/docs`.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the contributors and the open-source community for their support.
