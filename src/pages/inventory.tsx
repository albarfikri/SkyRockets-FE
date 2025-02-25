import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { InventoryView } from 'src/sections/inventory/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Users - ${CONFIG.appName}`}</title>
      </Helmet>

      <InventoryView />
    </>
  );
}
