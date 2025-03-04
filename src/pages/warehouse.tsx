import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { WarehouseView } from 'src/sections/warehouse/view';

// ----------------------------------------------------------------------

export default function Page() {

  return (
    <>
      <Helmet>
        <title> {`Warehouse - ${CONFIG.appName}`}</title>
      </Helmet>
       <WarehouseView />
    </>
  );
}
