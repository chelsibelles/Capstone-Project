// tests/component.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides custom matchers for Jest
import Login from '../components/Login'; // Import the component to test

describe('Login Component', () => {
  it('renders login form correctly', () => {
    render(<Login onLogin={jest.fn()} />);

    // Check if all form elements are rendered
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('displays error message when fields are empty', () => {
    render(<Login onLogin={jest.fn()} />);

    // Click the login button without entering credentials
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check if error message is displayed
    expect(screen.getByRole('alert')).toHaveTextContent('Both fields are required');
  });

  it('calls onLogin function with correct username and password', () => {
    const mockOnLogin = jest.fn();
    render(<Login onLogin={mockOnLogin} />);

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    // Click the login button
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check if the onLogin function is called with correct values
    expect(mockOnLogin).toHaveBeenCalledWith('testuser', 'password123');
  });

  it('does not display an error message when fields are filled', () => {
    render(<Login onLogin={jest.fn()} />);

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    // Click the login button
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check that error message is not displayed
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
