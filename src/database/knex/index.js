const { hash } = require('bcryptjs');

exports.seed = async function seed(knex) {
  await knex('users').insert([
    {
      name: 'admin',
      email: 'admin@email.com',
      password: await hash('987654', 8),
      is_admin: true
    }
  ]);
};