import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
  rest.get(`${process.env.REACT_APP_API_BASE_URL}/profile`, (req, res, ctx) => {
    return res(
      ctx.json({
        user: {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'user',
        },
        preferences: {
          theme: 'light',
          language: 'en',
        },
        notifications: {
          email: true,
          sms: false,
        },
      })
    );
  })
  // Add more handlers for other API endpoints as needed
);

export { server, rest };
