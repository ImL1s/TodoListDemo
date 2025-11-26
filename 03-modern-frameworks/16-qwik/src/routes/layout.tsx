/**
 * Layout Component
 *
 * This is a Qwik City layout component that wraps all routes.
 * It's used to add common elements that appear on every page.
 *
 * In this simple app, we just pass through to the Slot.
 */

import { component$, Slot } from '@builder.io/qwik';

export default component$(() => {
  return <Slot />;
});
