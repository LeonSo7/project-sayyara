import { NextPage } from "next";
import { TabPanel, TabView } from "primereact/tabview";
import React from "react";

const ShopDashboard: NextPage = () => {
  return (
    <div>
      <TabView>
        <TabPanel header="Quotes"></TabPanel>
        <TabPanel header="Service Requests"></TabPanel>
      </TabView>
    </div>
  );
};

export default React.memo(ShopDashboard);