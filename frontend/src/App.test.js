// usage: npm run test
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

describe('<Login/>', async () => {
    it('Correct Username and Password', () => {
        render(<App />);

        const usernameInput = screen.queryByPlaceholderText('Username')
        fireEvent.change(usernameInput, { target: { value: '123' } })

        const passwordInput = screen.queryByPlaceholderText('Password')
        fireEvent.change(passwordInput, { target: { value: '123' } })

        // Test Correct username and password
        const alertMock = jest.spyOn(window,'alert').mockImplementation(); 
        fireEvent.click(screen.getByRole('button'));
        expect(alertMock).toHaveBeenCalledTimes(1);

    });

    it('Incorrect Username and Password', () => {
      render(<App />);

      const usernameInput = screen.queryByPlaceholderText('Username')
      fireEvent.change(usernameInput, { target: { value: 'not a name' } })

      const passwordInput = screen.queryByPlaceholderText('Password')
      fireEvent.change(passwordInput, { target: { value: 'invalid' } })

      /* const message = await screen.findByText(/Something went wrong/); */
      // expect(message).toBeInTheDocument();

      // Test Incorrect username and password that remains one alert in total
      const alertMock = jest.spyOn(window,'alert').mockImplementation(); 
      fireEvent.click(screen.getByRole('button'));
      expect(alertMock).toHaveBeenCalledTimes(1);

  });


});