import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import SearchBar from '../components/search/searchBar';


describe('SearchBar component', () => {
  it('calls onSearch with correct input and category on 🔍 click', () => {
    const mockSearch = vi.fn();
    render(<SearchBar onSearch={mockSearch} />);

    // Type into input
    const input = screen.getByPlaceholderText(/search for media/i);
    fireEvent.change(input, { target: { value: 'Death Note' } });

    // Select a category
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'anime' } });

    // Click 🔍 button
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockSearch).toHaveBeenCalledWith('Death Note', 'anime');
  });

  it('calls onSearch on Enter key press', () => {
    const mockSearch = vi.fn();
    render(<SearchBar onSearch={mockSearch} />);

    const input = screen.getByPlaceholderText(/search for media/i);
    const select = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: 'Halo' } });
    fireEvent.change(select, { target: { value: 'game' } });

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockSearch).toHaveBeenCalledWith('Halo', 'game');
  });
});
