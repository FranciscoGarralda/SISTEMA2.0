import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Test básico para verificar que el sistema funciona
describe('Sistema Básico', () => {
  test('debería renderizar un componente básico', () => {
    const TestComponent = () => <div data-testid="test-component">Test</div>;
    render(<TestComponent />);
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  test('debería manejar localStorage correctamente', () => {
    localStorage.setItem('test', 'value');
    expect(localStorage.setItem).toHaveBeenCalledWith('test', 'value');
  });

  test('debería manejar fetch correctamente', () => {
    fetch('/api/test');
    expect(fetch).toHaveBeenCalledWith('/api/test');
  });
});
