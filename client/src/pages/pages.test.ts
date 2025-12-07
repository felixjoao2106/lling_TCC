import { describe, it, expect } from 'vitest';

// Test that all page components can be imported without errors
describe('Page Components', () => {
  it('should import Home page', async () => {
    const module = await import('./Home');
    expect(module.default).toBeDefined();
  });

  it('should import Explore page', async () => {
    const module = await import('./Explore');
    expect(module.default).toBeDefined();
  });

  it('should import Photographers page', async () => {
    const module = await import('./Photographers');
    expect(module.default).toBeDefined();
  });

  it('should import Profile page', async () => {
    const module = await import('./Profile');
    expect(module.default).toBeDefined();
  });

  it('should import Bookings page', async () => {
    const module = await import('./Bookings');
    expect(module.default).toBeDefined();
  });

  it('should import Messages page', async () => {
    const module = await import('./Messages');
    expect(module.default).toBeDefined();
  });

  it('should import BecomePhotographer page', async () => {
    const module = await import('./BecomePhotographer');
    expect(module.default).toBeDefined();
  });
});

describe('User Dashboard Pages', () => {
  it('should import UserDashboard page', async () => {
    const module = await import('./user/UserDashboard');
    expect(module.default).toBeDefined();
  });

  it('should import Favorites page', async () => {
    const module = await import('./user/Favorites');
    expect(module.default).toBeDefined();
  });

  it('should import Reviews page', async () => {
    const module = await import('./user/Reviews');
    expect(module.default).toBeDefined();
  });

  it('should import UserSettings page', async () => {
    const module = await import('./user/UserSettings');
    expect(module.default).toBeDefined();
  });
});

describe('Photographer Dashboard Pages', () => {
  it('should import PhotographerDashboard page', async () => {
    const module = await import('./photographer/PhotographerDashboard');
    expect(module.default).toBeDefined();
  });

  it('should import PhotographerSettings page', async () => {
    const module = await import('./photographer/PhotographerSettings');
    expect(module.default).toBeDefined();
  });

  it('should import Services page', async () => {
    const module = await import('./photographer/Services');
    expect(module.default).toBeDefined();
  });

  it('should import Checkouts page', async () => {
    const module = await import('./photographer/Checkouts');
    expect(module.default).toBeDefined();
  });
});
